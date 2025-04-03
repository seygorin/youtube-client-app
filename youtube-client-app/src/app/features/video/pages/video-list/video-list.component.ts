import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterComponent } from '../../components/search-filter/search-filter.component';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import { VideoService } from '../../services/video.service';
import { FilterService } from '../../../../core/services/filter.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, SearchItemComponent],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  videoService = inject(VideoService);
  filterService = inject(FilterService);

  sortedVideos = this.videoService.sortedVideos;
  showFilters = this.filterService.showFilters;
}
