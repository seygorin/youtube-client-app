import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VideoItem } from '../../models/video.model';
import { PublicationDateColorDirective } from '../../../../shared/directives/publication-date-color.directive';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { VideoFacade } from '../../facades/video.facade';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PublicationDateColorDirective,
  ],
  templateUrl: './search-item.component.html',
  styleUrl: './search-item.component.scss',
})
export class SearchItemComponent implements OnInit {
  @Input() video!: VideoItem;

  isCustomVideo = false;
  isFavorite$!: Observable<boolean>;

  private videoFacade = inject(VideoFacade);
  private destroyRef = inject(DestroyRef);
  public authService = inject(AuthService);

  ngOnInit(): void {
    this.videoFacade
      .isCustomVideo(this.video.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isCustom) => {
        this.isCustomVideo = isCustom;
      });

    this.isFavorite$ = this.videoFacade.isFavorite(this.video.id);
    this.videoFacade.loadFavorites();
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.videoFacade.toggleFavorite(this.video);
  }
}
