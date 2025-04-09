import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SearchFilterComponent } from '../../../features/video/components/search-filter/search-filter.component';
import { AuthService } from '../../auth/services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { SearchService } from '../../../features/video/services/search.service';
import { FilterService } from '../../services/filter.service';
import ThemeToggleComponent from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterLink,
    SearchFilterComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  filterService = inject(FilterService);
  authService = inject(AuthService);
  navigationService = inject(NavigationService);
  searchService = inject(SearchService);
  router = inject(Router);

  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.subscribe((value) => {
      this.searchService.setSearchQuery(value || '');
    });
  }

  toggleFiltering(): void {
    this.filterService.toggleFilters();
  }

  onSearch(): void {
    const query = this.searchControl.value;
    if (query && query.trim().length >= 3) {
      void this.router.navigate(['/search-results'], {
        queryParams: { query: query.trim() },
      });
    }
  }
}
