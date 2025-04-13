import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { FavoritesActions } from './favorites.actions';
import { VideoItem } from '../../models/video.model';
import { selectAllFavorites } from './favorites.selectors';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      switchMap(() => {
        try {
          const favoritesJson = localStorage.getItem('favorites');
          const favorites: VideoItem[] = favoritesJson
            ? JSON.parse(favoritesJson)
            : [];
          return of(FavoritesActions.loadFavoritesSuccess({ favorites }));
        } catch (error) {
          console.error('Error loading favorites:', error);
          return of(
            FavoritesActions.loadFavoritesFailure({
              error: 'Failed to load favorites',
            })
          );
        }
      })
    )
  );

  saveToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          FavoritesActions.addToFavorites,
          FavoritesActions.removeFromFavorites,
          FavoritesActions.toggleFavorite
        ),
        withLatestFrom(this.store.select(selectAllFavorites)),
        map(([_, favorites]) => {
          try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
          } catch (error) {
            console.error('Error saving favorites:', error);
          }
          return { type: '[Favorites] Save Complete' };
        })
      ),
    { dispatch: false }
  );
}
