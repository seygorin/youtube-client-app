import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const VIDEO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/video-list/video-list.component').then(
        (m) => m.VideoListComponent
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('../favorites/pages/favorites-list/favorites-list.component').then(
        (m) => m.FavoritesListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/video-detail/video-detail.component').then(
        (m) => m.VideoDetailComponent
      ),
  },
];
