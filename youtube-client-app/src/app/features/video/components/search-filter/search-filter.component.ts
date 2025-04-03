import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../../core/services/filter.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
})
export class SearchFilterComponent {
  filterService = inject(FilterService);

  showFilters = this.filterService.showFilters;
  isSortingByDate = this.filterService.isSortingByDate;
  isSortingByViews = this.filterService.isSortingByViews;
  isAscending = this.filterService.isAscending;
  isDescending = this.filterService.isDescending;

  sortByDate(): void {
    const direction = this.isAscending() ? 'asc' : 'desc';
    this.filterService.setSorting('date', direction);
  }

  sortByViews(): void {
    const direction = this.isAscending() ? 'asc' : 'desc';
    this.filterService.setSorting('viewCount', direction);
  }

  toggleDirection(): void {
    this.filterService.toggleSortDirection();
  }
}
