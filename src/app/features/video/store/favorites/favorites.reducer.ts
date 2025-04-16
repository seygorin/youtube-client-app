import { createReducer, on } from '@ngrx/store';
import { FavoritesActions } from './favorites.actions';
import { initialFavoritesState } from './favorites.state';

export const favoritesReducer = createReducer(
  initialFavoritesState,

  on(FavoritesActions.loadFavorites, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favorites,
    loading: false,
  })),

  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FavoritesActions.addToFavorites, (state, { video }) => {
    const exists = state.favorites.some((fav) => fav.id === video.id);
    if (exists) {
      return state;
    }

    return {
      ...state,
      favorites: [...state.favorites, video],
    };
  }),

  on(FavoritesActions.removeFromFavorites, (state, { videoId }) => ({
    ...state,
    favorites: state.favorites.filter((video) => video.id !== videoId),
  })),

  on(FavoritesActions.toggleFavorite, (state, { video }) => {
    const exists = state.favorites.some((fav) => fav.id === video.id);

    if (exists) {
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== video.id),
      };
    } else {
      return {
        ...state,
        favorites: [...state.favorites, video],
      };
    }
  })
);
