import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import { VideoItem } from '../../models/video.model';
import { selectSortedVideos } from '../../store/video.selectors';
import { FilterService } from '../../../../core/services/filter.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, SearchItemComponent],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  private store = inject(Store);
  private filterService = inject(FilterService);

  sortedVideos$ = this.store.select(selectSortedVideos(this.filterService));

  trackById(index: number, video: VideoItem): string {
    return video.id;
  }
}
