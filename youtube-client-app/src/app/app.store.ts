import { ActionReducerMap } from '@ngrx/store';
import { videoReducer } from './features/video/store/video.reducer';
import { VideoEffects } from './features/video/store/video.effects';
import { VideoState } from './features/video/models/state.model';

export interface AppState {
  video: VideoState;
}

export const reducers: ActionReducerMap<AppState> = {
  video: videoReducer,
};

export const effects = [VideoEffects];
