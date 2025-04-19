import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { VideoItem } from '../models/video.model';
import { selectCustomVideos } from '../store/video.selectors';
import { selectIsFavorite } from '../store/favorites/favorites.selectors';
import { FavoritesActions } from '../store/favorites/favorites.actions';

@Injectable({
  providedIn: 'root',
})
export class VideoFacade {
  constructor(private store: Store) {}

  isCustomVideo(videoId: string): Observable<boolean> {
    return this.store
      .select(selectCustomVideos)
      .pipe(
        map((customVideos) =>
          customVideos.some((video) => video.id === videoId)
        )
      );
  }

  isFavorite(videoId: string): Observable<boolean> {
    return this.store.select(selectIsFavorite(videoId));
  }

  loadFavorites(): void {
    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  toggleFavorite(video: VideoItem): void {
    this.store.dispatch(FavoritesActions.toggleFavorite({ video }));
  }
}
