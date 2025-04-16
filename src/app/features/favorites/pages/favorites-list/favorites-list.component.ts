import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { VideoItem } from '../../../video/models/video.model';
import { SearchItemComponent } from '../../../video/components/search-item/search-item.component';
import { selectAllFavorites } from '../../../video/store/favorites/favorites.selectors';
import { FavoritesActions } from '../../../video/store/favorites/favorites.actions';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, SearchItemComponent],
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss'],
})
export class FavoritesListComponent implements OnInit {
  favoriteVideos$: Observable<VideoItem[]>;

  constructor(private store: Store) {
    this.favoriteVideos$ = this.store.select(selectAllFavorites);
  }

  ngOnInit(): void {
    this.store.dispatch(FavoritesActions.loadFavorites());
  }

  trackById(index: number, video: VideoItem): string {
    return index + ':' + video.id;
  }
}
