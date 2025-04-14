import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { FavoritesState } from './favorites.state';

export const selectFavoritesState =
  createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  (state) => state.favorites
);

export const selectFavoritesLoading = createSelector(
  selectFavoritesState,
  (state) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state) => state.error
);

export const selectIsFavorite = (
  videoId: string
): MemoizedSelector<object, boolean> =>
  createSelector(selectAllFavorites, (favorites) =>
    favorites.some((video) => video.id === videoId)
  );
