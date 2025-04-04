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
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
