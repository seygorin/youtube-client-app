import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { VideoItem } from '../../models/video.model';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import {
  selectAllVideos,
  selectLoading,
  selectSortedAndFilteredVideos,
  selectVideosLoaded,
} from '../../store/video.selectors';
import { Observable, filter, take } from 'rxjs';
import { VideoActions } from '../../store/video.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [
    CommonModule,
    SearchItemComponent,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent implements OnInit {
  private store = inject(Store);

  sortedVideos$: Observable<VideoItem[]> = this.store.select(
    selectSortedAndFilteredVideos
  );

  isLoading$: Observable<boolean> = this.store.select(selectLoading);

  ngOnInit(): void {
    this.store
      .select(selectAllVideos)
      .pipe(take(1))
      .subscribe((videos) => {
        if (!videos || videos.length === 0) {
          this.loadVideosSequentially();
        }
      });
  }

  private loadVideosSequentially(): void {
    this.store.dispatch(VideoActions.loadPopularVideos());

    this.store
      .select(selectVideosLoaded)
      .pipe(
        filter((loaded) => loaded),
        take(1)
      )
      .subscribe(() => {
        this.store.dispatch(VideoActions.loadCustomVideos());
      });
  }

  trackById(index: number, video: VideoItem): string {
    return video.id;
  }
}
