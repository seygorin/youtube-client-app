import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../../core/services/filter.service';
import { Observable, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
})
export class SearchFilterComponent implements OnInit {
  filterService = inject(FilterService);

  showFilters$: Observable<boolean> = this.filterService.showFilters$;
  isSortingByDate$: Observable<boolean> = this.filterService.isSortingByDate$;
  isSortingByViews$: Observable<boolean> = this.filterService.isSortingByViews$;
  isAscending$: Observable<boolean> = this.filterService.isAscending$;
  isDescending$: Observable<boolean> = this.filterService.isDescending$;

  filterKeyword = '';

  private keywordInput$ = new Subject<string>();

  ngOnInit(): void {
    this.keywordInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((keyword) => {
        this.filterService.setFilterKeyword(keyword);
      });

    this.filterService.filterKeyword$.subscribe((keyword) => {
      if (this.filterKeyword !== keyword) {
        this.filterKeyword = keyword;
      }
    });
  }

  sortByDate(): void {
    let isAsc = false;
    const subscription = this.isAscending$.subscribe((value) => {
      isAsc = value;
    });
    subscription.unsubscribe();

    let isByDate = false;
    const subscription2 = this.isSortingByDate$.subscribe((value) => {
      isByDate = value;
    });
    subscription2.unsubscribe();

    if (isByDate) {
      this.filterService.toggleSortDirection();
    } else {
      const direction = isAsc ? 'asc' : 'desc';
      this.filterService.setSorting('date', direction);
    }
  }

  sortByViews(): void {
    let isAsc = false;
    const subscription = this.isAscending$.subscribe((value) => {
      isAsc = value;
    });
    subscription.unsubscribe();

    let isByViews = false;
    const subscription2 = this.isSortingByViews$.subscribe((value) => {
      isByViews = value;
    });
    subscription2.unsubscribe();

    if (isByViews) {
      this.filterService.toggleSortDirection();
    } else {
      const direction = isAsc ? 'asc' : 'desc';
      this.filterService.setSorting('viewCount', direction);
    }
  }

  toggleDirection(): void {
    this.filterService.toggleSortDirection();
  }

  onFilterKeywordChange(keyword: string): void {
    this.keywordInput$.next(keyword);
  }
}
