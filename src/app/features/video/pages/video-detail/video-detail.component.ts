import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoService } from '../../services/video.service';
import { VideoItem } from '../../models/video.model';
import { PublicationDateColorDirective } from '../../../../shared/directives/publication-date-color.directive';
import { Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Store } from '@ngrx/store';
import { selectIsFavorite } from '../../store/favorites/favorites.selectors';
import { FavoritesActions } from '../../store/favorites/favorites.actions';
import { AuthService } from '../../../../core/auth/services/auth.service';

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
    MatProgressSpinnerModule,
    PublicationDateColorDirective,
    LoadingSpinnerComponent,
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoService = inject(VideoService);
  private sanitizer = inject(DomSanitizer);
  private store = inject(Store);
  public authService = inject(AuthService);
  private subscriptions = new Subscription();

  video = signal<VideoItem | undefined>(undefined);
  videoEmbedUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  isFavorite = signal<boolean>(false);

  ngOnInit(): void {
    this.store.dispatch(FavoritesActions.loadFavorites());

    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        const videoId = params.get('id');
        if (videoId) {
          this.isLoading.set(true);
          this.error.set(null);

          this.setYoutubeEmbedUrl(videoId);

          this.subscriptions.add(
            this.store
              .select(selectIsFavorite(videoId))
              .subscribe((isFavorite) => {
                this.isFavorite.set(isFavorite);
              })
          );

          this.subscriptions.add(
            this.videoService.getVideoById(videoId).subscribe({
              next: (videoData) => {
                if (videoData) {
                  this.video.set(videoData);
                  this.isLoading.set(false);
                } else {
                  this.error.set('Video not found');
                  this.isLoading.set(false);
                }
              },
              error: (err) => {
                console.error('Error loading video:', err);
                this.error.set('Error loading video. Please try again.');
                this.isLoading.set(false);
              },
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setYoutubeEmbedUrl(videoId: string): void {
    const url = `https://www.youtube.com/embed/${videoId}`;
    this.videoEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.video()) {
      this.store.dispatch(
        FavoritesActions.toggleFavorite({ video: this.video()! })
      );
    }
  }
}
