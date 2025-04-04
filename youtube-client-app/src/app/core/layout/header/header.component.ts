import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, filter } from 'rxjs/operators';
import { FilterService } from '../../services/filter.service';
import { VideoService } from '../../../features/video/services/video.service';
import { SearchFilterComponent } from '../../../features/video/components/search-filter/search-filter.component';
import { AuthService } from '../../auth/services/auth.service';
import { NavigationService } from '../../services/navigation.service';
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
  videoService = inject(VideoService);
  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((value) => value !== null)
      )
      .subscribe((value) => {
        this.videoService.setSearchQuery(value || '');
      });
  }

  toggleFiltering(): void {
    this.filterService.toggleFilters();
  }
}
