import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'card-details',
    loadComponent: () => import('./card-details/card-details.component'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default routes;
