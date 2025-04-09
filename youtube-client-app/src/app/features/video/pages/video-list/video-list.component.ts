import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../services/video.service';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import { VideoItem } from '../../models/video.model';
@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, SearchItemComponent],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent {
  private videoService = inject(VideoService);

  sortedVideos = this.videoService.sortedVideos;

  trackById(index: number, video: VideoItem): string {
    return video.id;
  }
}
