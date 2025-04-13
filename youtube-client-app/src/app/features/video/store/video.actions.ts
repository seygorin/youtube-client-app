import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { VideoItem } from '../models/video.model';
import { SortingOption } from '../../../shared/models/sorting.model';

export const VideoActions = createActionGroup({
  source: 'Video',
  events: {
    'Load Videos': emptyProps(),
    'Load Videos Success': props<{ videos: VideoItem[] }>(),
    'Load Videos Failure': props<{ error: string }>(),

    'Load Custom Videos': emptyProps(),
    'Load Custom Videos Success': props<{ customVideos: VideoItem[] }>(),
    'Load Custom Videos Failure': props<{ error: string }>(),

    'Add Custom Video': props<{ video: VideoItem }>(),
    'Add Custom Video Success': props<{ video: VideoItem }>(),
    'Add Custom Video Failure': props<{ error: string }>(),

    'Delete Custom Video': props<{ videoId: string }>(),
    'Delete Custom Video Success': props<{ videoId: string }>(),
    'Delete Custom Video Failure': props<{ error: string }>(),

    'Select Video': props<{ videoId: string }>(),
    'Select Video Success': props<{ video: VideoItem }>(),
    'Select Video Failure': props<{ error: string }>(),

    'Set Search Query': props<{ query: string }>(),
    'Search Videos': props<{ query: string }>(),
    'Search Videos Success': props<{ videos: VideoItem[] }>(),
    'Search Videos Failure': props<{ error: string }>(),
    'Clear Search Results': emptyProps(),

    'Set Sorting': props<{ sorting: SortingOption }>(),
    'Toggle Sort Direction': emptyProps(),
    'Toggle Filters Visibility': emptyProps(),
    'Set Filters Visibility': props<{ visible: boolean }>(),

    'Set Filter Keyword': props<{ keyword: string }>(),

    'Load Popular Videos': emptyProps(),
    'Load Popular Videos Success': props<{ videos: VideoItem[] }>(),
    'Load Popular Videos Failure': props<{ error: string }>(),

    'Reset Videos Loaded': emptyProps(),

    'Load More Popular Videos': emptyProps(),
    'Load More Popular Videos Success': props<{ videos: VideoItem[] }>(),
    'Load More Popular Videos Failure': props<{ error: string }>(),
  },
});
