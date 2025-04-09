import { Injectable, signal, computed, inject } from '@angular/core';
import { FilterService } from '../../../core/services/filter.service';
import { VideoItem } from '../models/video.model';
import { SearchService } from './search.service';
import { YoutubeApiService } from './youtube-api.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private _videos = signal<VideoItem[]>([
    {
      id: 'YN8zNnV0sK8',
      title: 'Introduction to Angular - Learning Angular',
      description:
        'In this series, learn how to build your first Angular application. Angular is a web framework that allows teams to deliver web apps with confidence. Discover how these tools build scalable applications.',
      publishedAt: '2025-03-15T12:42:19.000Z',
      thumbnail: 'https://i.ytimg.com/vi/xAT0lHYhHMY/maxresdefault.jpg',
      viewCount: 33265,
      likeCount: 1173,
      dislikeCount: 26,
      commentCount: 170,
      channelTitle: 'Angular',
    },
    {
      id: 'wPT3K3w6JtU',
      title: 'Angular Material Components - Complete Guide',
      description:
        'Explore the Material Design components available in Angular Material. Learn how to create beautiful, responsive interfaces with Angular Material components.',
      thumbnail: 'https://i.ytimg.com/vi/wPT3K3w6JtU/maxresdefault.jpg',
      publishedAt: '2023-05-20T10:30:00Z',
      viewCount: 85000,
      likeCount: 3200,
      dislikeCount: 150,
      commentCount: 450,
      channelTitle: 'Angular University',
    },
    {
      id: 'REu2BcnlD34',
      title: 'Angular Signals - The Future of State Management',
      description:
        'Learn about Angular Signals, the new primitive for managing state in Angular applications. Discover how Signals offer an elegant alternative to RxJS for reactive programming.',
      thumbnail: 'https://i.ytimg.com/vi/REu2BcnlD34/maxresdefault.jpg',
      publishedAt: '2024-12-01T14:25:00Z',
      viewCount: 45000,
      likeCount: 2100,
      dislikeCount: 30,
      commentCount: 210,
      channelTitle: 'Angular',
    },
    {
      id: 'qbPTdW7KgOg',
      title: 'Standalone Components in Angular - Modern Angular Development',
      description:
        'Discover how Standalone Components simplify Angular development by reducing the need for NgModules. Learn the benefits and implementation details of this new paradigm.',
      thumbnail: 'https://i.ytimg.com/vi/qbPTdW7KgOg/maxresdefault.jpg',
      publishedAt: '2025-04-04T11:10:00Z',
      viewCount: 28500,
      likeCount: 1560,
      dislikeCount: 12,
      commentCount: 95,
      channelTitle: 'Google Developers',
    },
  ]);

  private searchService = inject(SearchService);
  private youtubeApiService = inject(YoutubeApiService);

  searchQuery = signal<string>('');

  sortedVideos = computed(() => {
    const sorting = this.filterService.currentSorting();

    return [...this._videos()]
      .filter(
        (video) =>
          this.searchQuery() === '' ||
          video.title.toLowerCase().includes(this.searchQuery().toLowerCase())
      )
      .sort((a, b) => {
        const multiplier = sorting.direction === 'asc' ? 1 : -1;

        if (sorting.field === 'date') {
          return (
            multiplier *
            (new Date(a.publishedAt).getTime() -
              new Date(b.publishedAt).getTime())
          );
        } else {
          return multiplier * (a.viewCount - b.viewCount);
        }
      });
  });

  private readonly CUSTOM_VIDEOS_KEY = 'custom_videos';

  private _customVideos = signal<VideoItem[]>([]);
  customVideos = this._customVideos.asReadonly();

  constructor(private filterService: FilterService) {
    this.loadCustomVideos();
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  getVideoById(id: string): Observable<VideoItem | undefined> {
    const localVideo = this._videos().find((video) => video.id === id);
    if (localVideo) {
      return of(localVideo);
    }

    const searchVideo = this.searchService.getVideoById(id);
    if (searchVideo) {
      return of(searchVideo);
    }

    return this.youtubeApiService.getVideoDetails(id).pipe(
      map((videos) => (videos.length > 0 ? videos[0] : undefined)),
      catchError((error) => {
        console.error('Error fetching video details:', error);
        return of(undefined);
      })
    );
  }

  addVideo(video: VideoItem): void {
    this._videos.update((videos) => [...videos, video]);
  }

  addCustomVideo(video: VideoItem): void {
    try {
      const customVideos = this.getCustomVideos();

      customVideos.push(video);

      localStorage.setItem(
        this.CUSTOM_VIDEOS_KEY,
        JSON.stringify(customVideos)
      );

      this._videos.update((videos) => [...videos, video]);
      this._customVideos.update((videos) => [...videos, video]);

      console.log('Video successfully added:', video);
    } catch (error) {
      console.error('Error adding custom video:', error);
      throw error;
    }
  }

  deleteCustomVideo(videoId: string): void {
    const customVideos = this.getCustomVideos().filter((v) => v.id !== videoId);

    localStorage.setItem(this.CUSTOM_VIDEOS_KEY, JSON.stringify(customVideos));

    this._videos.update((videos) => videos.filter((v) => v.id !== videoId));
    this._customVideos.update((videos) =>
      videos.filter((v) => v.id !== videoId)
    );
  }

  private getCustomVideos(): VideoItem[] {
    const storedVideos = localStorage.getItem(this.CUSTOM_VIDEOS_KEY);
    return storedVideos ? JSON.parse(storedVideos) : [];
  }

  loadCustomVideos(): void {
    const customVideos = this.getCustomVideos();

    if (customVideos.length > 0) {
      this._videos.update((videos) => [...videos, ...customVideos]);
      this._customVideos.set(customVideos);
    }
  }
}
