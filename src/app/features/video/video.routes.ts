import { Routes } from '@angular/router';

export const VIDEO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/video-list/video-list.component').then(
        (m) => m.VideoListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/video-detail/video-detail.component').then(
        (m) => m.VideoDetailComponent
      ),
  },
];
