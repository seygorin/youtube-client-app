import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { VideoItem } from '../models/video.model';
import { VideoActions } from '../store/video.actions';
import {
  selectAllVideos,
  selectCustomVideos,
  selectLoading,
  selectSortedVideos,
  selectVideoById,
} from '../store/video.selectors';
import { FilterService } from '../../../core/services/filter.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private store = inject(Store);
  private filterService = inject(FilterService);

  readonly videos$ = this.store.select(selectAllVideos);
  readonly customVideos$ = this.store.select(selectCustomVideos);
  readonly loading$ = this.store.select(selectLoading);
  readonly sortedVideos$ = this.store.select(
    selectSortedVideos(this.filterService)
  );

  constructor() {
    this.loadCustomVideos();
  }

  getAllVideos(): Observable<VideoItem[]> {
    return this.videos$;
  }

  getVideoById(id: string): Observable<VideoItem | null> {
    this.store.dispatch(VideoActions.selectVideo({ videoId: id }));

    return this.store.select(selectVideoById(id));
  }

  addCustomVideo(video: VideoItem): void {
    this.store.dispatch(VideoActions.addCustomVideo({ video }));
  }

  deleteCustomVideo(videoId: string): void {
    this.store.dispatch(VideoActions.deleteCustomVideo({ videoId }));
  }

  loadCustomVideos(): void {
    this.store.dispatch(VideoActions.loadCustomVideos());
  }
}
