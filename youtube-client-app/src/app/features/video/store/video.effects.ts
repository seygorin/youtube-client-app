import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { VideoItem } from '../models/video.model';
import { VideoActions } from './video.actions';
import {
  selectAllVideos,
  selectCustomVideos,
  selectVideosLoaded,
} from './video.selectors';
import { YoutubeApiService } from '../services/youtube-api.service';
import { CUSTOM_VIDEOS_KEY } from './video.state';

@Injectable()
export class VideoEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private youtubeApiService = inject(YoutubeApiService);

  loadCustomVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.loadCustomVideos),
      map(() => {
        try {
          const storedVideos = localStorage.getItem(CUSTOM_VIDEOS_KEY);
          const customVideos: VideoItem[] = storedVideos
            ? JSON.parse(storedVideos)
            : [];
          return VideoActions.loadCustomVideosSuccess({ customVideos });
        } catch {
          return VideoActions.loadCustomVideosFailure({
            error: 'Failed to load custom videos from localStorage',
          });
        }
      })
    )
  );

  addCustomVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.addCustomVideo),
      withLatestFrom(this.store.select(selectCustomVideos)),
      map(([action, customVideos]) => {
        try {
          const updatedCustomVideos = [...customVideos, action.video];
          localStorage.setItem(
            CUSTOM_VIDEOS_KEY,
            JSON.stringify(updatedCustomVideos)
          );
          return VideoActions.addCustomVideoSuccess({ video: action.video });
        } catch {
          return VideoActions.addCustomVideoFailure({
            error: 'Failed to add custom video',
          });
        }
      })
    )
  );

  deleteCustomVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.deleteCustomVideo),
      withLatestFrom(this.store.select(selectCustomVideos)),
      map(([action, customVideos]) => {
        try {
          const filteredCustomVideos = customVideos.filter(
            (video) => video.id !== action.videoId
          );
          localStorage.setItem(
            CUSTOM_VIDEOS_KEY,
            JSON.stringify(filteredCustomVideos)
          );
          return VideoActions.deleteCustomVideoSuccess({
            videoId: action.videoId,
          });
        } catch {
          return VideoActions.deleteCustomVideoFailure({
            error: 'Failed to delete custom video',
          });
        }
      })
    )
  );

  selectVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.selectVideo),
      withLatestFrom(this.store.select(selectAllVideos)),
      switchMap(([action, videos]) => {
        const localVideo = videos.find((video) => video.id === action.videoId);
        if (localVideo) {
          return of(VideoActions.selectVideoSuccess({ video: localVideo }));
        }

        return this.youtubeApiService.getVideoById(action.videoId).pipe(
          map((videos) => {
            if (videos.length > 0) {
              return VideoActions.selectVideoSuccess({ video: videos[0] });
            }
            return VideoActions.selectVideoFailure({
              error: 'Video not found',
            });
          }),
          catchError((error) =>
            of(VideoActions.selectVideoFailure({ error: error.message }))
          )
        );
      })
    )
  );

  searchVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.searchVideos),
      switchMap((action) => {
        const query = action.query.trim();

        if (query.length < 3) {
          return of(
            VideoActions.searchVideosFailure({
              error: 'Search query must be at least 3 characters long',
            })
          );
        }

        return this.youtubeApiService.searchVideos(query).pipe(
          switchMap((searchResponse) => {
            if (searchResponse.items.length === 0) {
              return of(VideoActions.searchVideosSuccess({ videos: [] }));
            }

            const videoIds = searchResponse.items
              .map((item) => item.id.videoId)
              .join(',');

            return this.youtubeApiService.getVideoDetails(videoIds).pipe(
              map((videos) => VideoActions.searchVideosSuccess({ videos })),
              catchError((error) =>
                of(
                  VideoActions.searchVideosFailure({
                    error: `Error fetching video details: ${error.message}`,
                  })
                )
              )
            );
          }),
          catchError((error) =>
            of(
              VideoActions.searchVideosFailure({
                error: `Error searching videos: ${error.message}`,
              })
            )
          )
        );
      })
    )
  );

  checkAndLoadPopularVideos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VideoActions.loadPopularVideos),
      withLatestFrom(
        this.store.select(selectAllVideos),
        this.store.select(selectVideosLoaded)
      ),
      switchMap(([_, videos, videosLoaded]) => {
        if (videosLoaded && videos.length > 0) {
          return of(VideoActions.loadPopularVideosSuccess({ videos }));
        }

        return this.youtubeApiService.getPopularVideos(12).pipe(
          map((videos) => VideoActions.loadPopularVideosSuccess({ videos })),
          catchError((error) =>
            of(
              VideoActions.loadPopularVideosFailure({
                error: `Failed to load popular videos: ${error.message}`,
              })
            )
          )
        );
      })
    )
  );
}
