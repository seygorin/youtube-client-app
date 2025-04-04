import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private filterService = inject(FilterService);

  isHomePage = signal<boolean>(false);
  currentUrl = signal<string>('');

  constructor() {
    this.checkCurrentPage();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentPage();
      });
  }

  private checkCurrentPage(): void {
    const currentUrl = this.router.url;
    this.currentUrl.set(currentUrl);

    const isHome = currentUrl === '/';
    this.isHomePage.set(isHome);

    if (!isHome) {
      this.filterService.hideFilters();
    }
  }

  isCurrentRoute(path: string): boolean {
    return this.router.url === path;
  }

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }
}
