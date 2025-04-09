import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import {
  SearchResponse,
  VideoDetailsResponse,
} from '../../../shared/models/search-response.model';
import { VideoItem } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class YoutubeApiService {
  constructor(private http: HttpClient) {}

  searchVideos(query: string): Observable<SearchResponse> {
    return this.http
      .get<SearchResponse>(
        `@youtube/search?type=video&part=snippet&maxResults=15&q=${query}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error searching videos:', error);
          return of({
            kind: '',
            etag: '',
            pageInfo: { totalResults: 0, resultsPerPage: 0 },
            items: [],
          });
        })
      );
  }

  getVideoDetails(videoIds: string): Observable<VideoItem[]> {
    return this.http
      .get<VideoDetailsResponse>(
        `@youtube/videos?id=${videoIds}&part=snippet,statistics`
      )
      .pipe(
        map((response) => {
          return response.items.map((item) => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails.high.url,
            viewCount: parseInt(item.statistics.viewCount, 10),
            likeCount: parseInt(item.statistics.likeCount, 10),
            dislikeCount: item.statistics.dislikeCount
              ? parseInt(item.statistics.dislikeCount, 10)
              : 0,
            commentCount: parseInt(item.statistics.commentCount, 10),
            channelTitle: item.snippet.channelTitle,
            videoLink: `https://www.youtube.com/watch?v=${item.id}`,
          }));
        }),
        catchError((error) => {
          console.error('Error fetching video details:', error);
          return of([]);
        })
      );
  }
}
