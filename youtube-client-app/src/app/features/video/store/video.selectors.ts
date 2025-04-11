import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VideoState } from './video.state';
import { FilterService } from '../../../core/services/filter.service';

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

export const selectSortedVideos = (filterService: FilterService) =>
  createSelector(selectAllVideos, (videos) => {
    const sortingOption = filterService.currentSorting();

    return [...videos].sort((a, b) => {
      const multiplier = sortingOption.direction === 'asc' ? 1 : -1;

      if (sortingOption.field === 'date') {
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

export const selectVideoById = (videoId: string) =>
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
