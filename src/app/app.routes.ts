import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'search-results',
    loadComponent: () =>
      import(
        './features/video/pages/search-results/search-results.component'
      ).then((m) => m.SearchResultsComponent),
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./features/favorites/favorites.routes').then(
        (m) => m.FAVORITES_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'video',
    loadChildren: () =>
      import('./features/video/video.routes').then((m) => m.VIDEO_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./features/video/video.routes').then((m) => m.VIDEO_ROUTES),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
