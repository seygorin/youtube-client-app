import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { VideoItem } from '../../models/video.model';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import {
  selectAllVideos,
  selectLoading,
  selectSortedAndFilteredVideos,
} from '../../store/video.selectors';
import { Observable, take } from 'rxjs';
import { VideoActions } from '../../store/video.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, SearchItemComponent, MatProgressSpinnerModule],
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
          this.store.dispatch(VideoActions.loadPopularVideos());
        }
      });
  }

  trackById(index: number, video: VideoItem): string {
    return video.id;
  }
}
