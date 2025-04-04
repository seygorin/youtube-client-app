import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoService } from '../../services/video.service';
import { VideoItem } from '../../models/video.model';
import { PublicationDateColorDirective } from '../../../../shared/directives/publication-date-color.directive';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    PublicationDateColorDirective,
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoService = inject(VideoService);
  private sanitizer = inject(DomSanitizer);

  video = signal<VideoItem | undefined>(undefined);
  isFavorite = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const videoId = params.get('id');
      if (videoId) {
        const videoData = this.videoService.getVideoById(videoId);
        if (videoData) {
          this.video.set(videoData);
        } else {
          void this.router.navigate(['/not-found'], {
            skipLocationChange: true,
          });
        }
      }
    });
  }

  getYoutubeEmbedUrl(videoId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }
}
