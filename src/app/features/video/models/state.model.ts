import { VideoItem } from './video.model';
import { SortingOption } from '../../../shared/models/sorting.model';

export interface VideoState {
  videos: VideoItem[];
  customVideos: VideoItem[];
  selectedVideo: VideoItem | null;
  searchResults: VideoItem[];
  searchQuery: string;
  sorting: SortingOption;
  filterKeyword: string;
  showFilters: boolean;
  loading: boolean;
  error: string | null;
  videosLoaded: boolean;
}
