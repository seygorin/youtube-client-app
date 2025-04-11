import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { VideoItem } from '../models/video.model';
import { VideoActions } from '../store/video.actions';
import {
  selectError,
  selectHasSearchResults,
  selectLoading,
  selectSearchQuery,
  selectSearchResults,
} from '../store/video.selectors';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private store = inject(Store);

  readonly searchQuery$ = this.store.select(selectSearchQuery);
  readonly searchResults$ = this.store.select(selectSearchResults);
  readonly hasResults$ = this.store.select(selectHasSearchResults);
  readonly loading$ = this.store.select(selectLoading);
  readonly error$ = this.store.select(selectError);

  setSearchQuery(query: string): void {
    this.store.dispatch(VideoActions.setSearchQuery({ query }));
  }

  getCurrentQuery(): Observable<string> {
    return this.searchQuery$;
  }

  performSearch(query?: string): void {
    if (query) {
      this.setSearchQuery(query);
      this.store.dispatch(VideoActions.searchVideos({ query }));
    } else {
      let currentQuery = '';
      const subscription = this.searchQuery$.subscribe((q) => {
        currentQuery = q;
      });
      subscription.unsubscribe();

      if (currentQuery) {
        this.store.dispatch(VideoActions.searchVideos({ query: currentQuery }));
      }
    }
  }

  clearResults(): void {
    this.store.dispatch(VideoActions.clearSearchResults());
  }

  getVideoById(videoId: string): Observable<VideoItem | null> {
    return this.store.select((state) => {
      const results = selectSearchResults(state);
      return results.find((video) => video.id === videoId) || null;
    });
  }
}
