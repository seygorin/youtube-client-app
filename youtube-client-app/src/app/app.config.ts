import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { youtubeApiInterceptor } from './core/interceptors/api.interceptor';
import { videoReducer } from './features/video/store/video.reducer';
import { VideoEffects } from './features/video/store/video.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([youtubeApiInterceptor])),
    provideStore({ video: videoReducer }),
    provideEffects([VideoEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};

export default appConfig;
