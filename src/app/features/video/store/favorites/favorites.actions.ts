import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { VideoItem } from '../../models/video.model';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Load Favorites': emptyProps(),
    'Load Favorites Success': props<{ favorites: VideoItem[] }>(),
    'Load Favorites Failure': props<{ error: string }>(),

    'Toggle Favorite': props<{ video: VideoItem }>(),
    'Add To Favorites': props<{ video: VideoItem }>(),
    'Remove From Favorites': props<{ videoId: string }>(),

    'Save Favorites': props<{ favorites: VideoItem[] }>(),
    'Save Favorites Success': emptyProps(),
    'Save Favorites Failure': props<{ error: string }>(),
  },
});
