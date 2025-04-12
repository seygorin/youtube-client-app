import { createReducer, on } from '@ngrx/store';
import { initialVideoState } from './video.state';
import { VideoActions } from './video.actions';

export const videoReducer = createReducer(
  initialVideoState,

  on(VideoActions.loadVideos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VideoActions.loadVideosSuccess, (state, { videos }) => ({
    ...state,
    videos,
    loading: false,
  })),

  on(VideoActions.loadVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(VideoActions.loadCustomVideos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VideoActions.loadCustomVideosSuccess, (state, { customVideos }) => ({
    ...state,
    customVideos,
    videos: [
      ...state.videos.filter(
        (v) => !state.customVideos.some((cv) => cv.id === v.id)
      ),
      ...customVideos,
    ],
    loading: false,
  })),

  on(VideoActions.loadCustomVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(VideoActions.addCustomVideo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VideoActions.addCustomVideoSuccess, (state, { video }) => ({
    ...state,
    videos: [...state.videos, video],
    customVideos: [...state.customVideos, video],
    loading: false,
  })),

  on(VideoActions.addCustomVideoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(VideoActions.deleteCustomVideo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VideoActions.deleteCustomVideoSuccess, (state, { videoId }) => ({
    ...state,
    videos: state.videos.filter((video) => video.id !== videoId),
    customVideos: state.customVideos.filter((video) => video.id !== videoId),
    loading: false,
  })),

  on(VideoActions.deleteCustomVideoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(VideoActions.selectVideo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VideoActions.selectVideoSuccess, (state, { video }) => ({
    ...state,
    selectedVideo: video,
    loading: false,
  })),

  on(VideoActions.selectVideoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(VideoActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query,
  })),

  on(VideoActions.searchVideos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VideoActions.searchVideosSuccess, (state, { videos }) => ({
    ...state,
    searchResults: videos,
    loading: false,
  })),

  on(VideoActions.searchVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(VideoActions.clearSearchResults, (state) => ({
    ...state,
    searchResults: [],
    searchQuery: '',
  })),

  on(VideoActions.setSorting, (state, { sorting }) => ({
    ...state,
    sorting: sorting,
  })),

  on(VideoActions.toggleSortDirection, (state) => ({
    ...state,
    sorting: {
      ...state.sorting,
      direction:
        state.sorting.direction === 'asc'
          ? ('desc' as const)
          : ('asc' as const),
    },
  })),

  on(VideoActions.toggleFiltersVisibility, (state) => ({
    ...state,
    showFilters: !state.showFilters,
  })),

  on(VideoActions.setFiltersVisibility, (state, { visible }) => ({
    ...state,
    showFilters: visible,
  })),

  on(VideoActions.setFilterKeyword, (state, { keyword }) => ({
    ...state,
    filterKeyword: keyword,
  })),

  on(VideoActions.loadPopularVideos, (state) => ({
    ...state,
    loading: !state.videosLoaded,
    error: null,
  })),

  on(VideoActions.loadPopularVideosSuccess, (state, { videos }) => ({
    ...state,
    videos,
    loading: false,
    videosLoaded: true,
  })),

  on(VideoActions.loadPopularVideosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    videosLoaded: false,
  })),

  on(VideoActions.resetVideosLoaded, (state) => ({
    ...state,
    videosLoaded: false,
  }))
);
