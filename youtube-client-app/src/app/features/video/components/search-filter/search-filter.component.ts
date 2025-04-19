import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../../core/services/filter.service';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  Subject,
  combineLatest,
  take,
} from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);

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
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((keyword) => {
        this.filterService.setFilterKeyword(keyword);
      });

    this.filterService.filterKeyword$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((keyword) => {
        if (this.filterKeyword !== keyword) {
          this.filterKeyword = keyword;
        }
      });
  }

  sortByDate(): void {
    combineLatest([
      this.isAscending$.pipe(take(1)),
      this.isSortingByDate$.pipe(take(1)),
    ])
      .pipe(take(1))
      .subscribe(([isAsc, isByDate]) => {
        if (isByDate) {
          this.filterService.toggleSortDirection();
        } else {
          const direction = isAsc ? 'asc' : 'desc';
          this.filterService.setSorting('date', direction);
        }
      });
  }

  sortByViews(): void {
    combineLatest([
      this.isAscending$.pipe(take(1)),
      this.isSortingByViews$.pipe(take(1)),
    ])
      .pipe(take(1))
      .subscribe(([isAsc, isByViews]) => {
        if (isByViews) {
          this.filterService.toggleSortDirection();
        } else {
          const direction = isAsc ? 'asc' : 'desc';
          this.filterService.setSorting('viewCount', direction);
        }
      });
  }

  toggleDirection(): void {
    this.filterService.toggleSortDirection();
  }

  onFilterKeywordChange(keyword: string): void {
    this.keywordInput$.next(keyword);
  }
}
