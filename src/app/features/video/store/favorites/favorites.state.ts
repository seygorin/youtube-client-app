import { VideoItem } from '../../models/video.model';

export interface FavoritesState {
  favorites: VideoItem[];
  loading: boolean;
  error: string | null;
}

export const initialFavoritesState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};
