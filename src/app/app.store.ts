import { ActionReducerMap } from '@ngrx/store';
import { videoReducer } from './features/video/store/video.reducer';
import { VideoEffects } from './features/video/store/video.effects';
import { VideoState } from './features/video/models/state.model';
import { favoritesReducer } from './features/video/store/favorites/favorites.reducer';
import { FavoritesEffects } from './features/video/store/favorites/favorites.effects';
import { FavoritesState } from './features/video/store/favorites/favorites.state';

export interface AppState {
  video: VideoState;
  favorites: FavoritesState;
}

export const reducers: ActionReducerMap<AppState> = {
  video: videoReducer,
  favorites: favoritesReducer,
};

export const effects = [VideoEffects, FavoritesEffects];
