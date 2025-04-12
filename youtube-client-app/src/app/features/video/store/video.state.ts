import { VideoState } from '../models/state.model';

export const CUSTOM_VIDEOS_KEY = 'custom_videos';

export const initialVideoState: VideoState = {
  videos: [],
  customVideos: [],
  selectedVideo: null,
  searchResults: [],
  searchQuery: '',
  sorting: {
    field: 'date',
    direction: 'desc',
  },
  filterKeyword: '',
  showFilters: false,
  loading: false,
  error: null,
  videosLoaded: false,
};
