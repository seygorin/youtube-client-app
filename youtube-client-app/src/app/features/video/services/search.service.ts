import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { VideoItem } from '../models/video.model';
import { YoutubeApiService } from './youtube-api.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchQuery = new BehaviorSubject<string>('');
  private _searchResults = new BehaviorSubject<VideoItem[]>([]);
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _searchError = new BehaviorSubject<string | null>(null);

  readonly searchQuery$ = this._searchQuery.asObservable();
  readonly searchResults$ = this._searchResults.asObservable();
  readonly isLoading$ = this._isLoading.asObservable();
  readonly searchError$ = this._searchError.asObservable();

  constructor(private youtubeApiService: YoutubeApiService) {}

  setSearchQuery(query: string): void {
    this._searchQuery.next(query);
  }

  getCurrentQuery(): string {
    return this._searchQuery.value;
  }

  getResults(): VideoItem[] {
    return this._searchResults.value;
  }

  performSearch(): Observable<VideoItem[]> {
    const query = this._searchQuery.value.trim();

    if (query.length < 3) {
      this._searchError.next('Search query must be at least 3 characters long');
      return this.searchResults$;
    }

    this._isLoading.next(true);
    this._searchError.next(null);

    return this.youtubeApiService.searchVideos(query).pipe(
      switchMap((searchResponse) => {
        if (searchResponse.items.length === 0) {
          this._searchResults.next([]);
          this._isLoading.next(false);
          return this.searchResults$;
        }

        const videoIds = searchResponse.items
          .map((item) => item.id.videoId)
          .join(',');
        return this.youtubeApiService.getVideoDetails(videoIds);
      }),
      switchMap((videos) => {
        this._searchResults.next(videos);
        this._isLoading.next(false);
        return this.searchResults$;
      })
    );
  }

  clearResults(): void {
    this._searchResults.next([]);
    this._searchError.next(null);
  }

  saveSearchResults(videos: VideoItem[]): void {
    this._searchResults.next(videos);
  }

  getVideoById(videoId: string): VideoItem | undefined {
    const searchResults = this._searchResults.getValue();
    return searchResults.find((video) => video.id === videoId);
  }
}
