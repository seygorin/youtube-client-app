import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { VideoState } from '../models/state.model';
import { VideoItem } from '../models/video.model';

export const selectVideoState = createFeatureSelector<VideoState>('video');

export const selectAllVideos = createSelector(
  selectVideoState,
  (state) => state.videos
);

export const selectCustomVideos = createSelector(
  selectVideoState,
  (state) => state.customVideos
);

export const selectSelectedVideo = createSelector(
  selectVideoState,
  (state) => state.selectedVideo
);

export const selectLoading = createSelector(
  selectVideoState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectVideoState,
  (state) => state.error
);

export const selectSearchResults = createSelector(
  selectVideoState,
  (state) => state.searchResults
);

export const selectSearchQuery = createSelector(
  selectVideoState,
  (state) => state.searchQuery
);

export const selectHasSearchResults = createSelector(
  selectSearchResults,
  (results) => results.length > 0
);

export const selectSorting = createSelector(
  selectVideoState,
  (state) => state.sorting
);

export const selectShowFilters = createSelector(
  selectVideoState,
  (state) => state.showFilters
);

export const selectIsSortingByDate = createSelector(
  selectSorting,
  (sorting) => sorting.field === 'date'
);

export const selectIsSortingByViews = createSelector(
  selectSorting,
  (sorting) => sorting.field === 'viewCount'
);

export const selectIsAscending = createSelector(
  selectSorting,
  (sorting) => sorting.direction === 'asc'
);

export const selectIsDescending = createSelector(
  selectSorting,
  (sorting) => sorting.direction === 'desc'
);

export const selectFilterKeyword = createSelector(
  selectVideoState,
  (state) => state.filterKeyword
);

export const selectSortedVideos = createSelector(
  selectAllVideos,
  selectSorting,
  (videos, sorting) => {
    return [...videos].sort((a, b) => {
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
  }
);

export const selectSortedAndFilteredVideos = createSelector(
  selectAllVideos,
  selectSorting,
  selectFilterKeyword,
  (videos, sorting, keyword) => {
    let filteredVideos = videos;

    if (keyword && keyword.trim() !== '') {
      const keywordLower = keyword.toLowerCase().trim();
      filteredVideos = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(keywordLower) ||
          video.description.toLowerCase().includes(keywordLower) ||
          video.channelTitle.toLowerCase().includes(keywordLower)
      );
    }

    return [...filteredVideos].sort((a, b) => {
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
  }
);

export const selectVideoById = (
  videoId: string
): MemoizedSelector<object, VideoItem | null> =>
  createSelector(
    selectAllVideos,
    selectSearchResults,
    (videos, searchResults) => {
      const foundInVideos = videos.find((video) => video.id === videoId);
      if (foundInVideos) return foundInVideos;

      const foundInSearch = searchResults.find((video) => video.id === videoId);
      return foundInSearch || null;
    }
  );

export const selectVideosLoaded = createSelector(
  selectVideoState,
  (state) => state.videosLoaded
);
