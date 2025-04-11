import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { VideoItem } from '../../models/video.model';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import { selectSortedAndFilteredVideos } from '../../store/video.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, SearchItemComponent],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  private store = inject(Store);

  sortedVideos$: Observable<VideoItem[]> = this.store.select(
    selectSortedAndFilteredVideos
  );

  trackById(index: number, video: VideoItem): string {
    return video.id;
  }
}
