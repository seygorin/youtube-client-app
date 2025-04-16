import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VideoItem } from '../../models/video.model';
import { PublicationDateColorDirective } from '../../../../shared/directives/publication-date-color.directive';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectCustomVideos } from '../../store/video.selectors';
import { selectIsFavorite } from '../../store/favorites/favorites.selectors';
import { FavoritesActions } from '../../store/favorites/favorites.actions';
import { AuthService } from '../../../../core/auth/services/auth.service';

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

  constructor(private store: Store, public authService: AuthService) {}

  ngOnInit(): void {
    this.store
      .select(selectCustomVideos)
      .pipe(
        map((customVideos) =>
          customVideos.some((customVideo) => customVideo.id === this.video.id)
        )
      )
      .subscribe((isCustom) => {
        this.isCustomVideo = isCustom;
      });

    this.isFavorite$ = this.store.select(selectIsFavorite(this.video.id));

    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatch(FavoritesActions.toggleFavorite({ video: this.video }));
  }
}
