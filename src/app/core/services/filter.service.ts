import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SortingOption } from '../../shared/models/sorting.model';
import { VideoActions } from '../../features/video/store/video.actions';
import {
  selectShowFilters,
  selectSorting,
  selectIsSortingByDate,
  selectIsSortingByViews,
  selectIsAscending,
  selectIsDescending,
  selectFilterKeyword,
} from '../../features/video/store/video.selectors';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private store = inject(Store);

  readonly showFilters$: Observable<boolean> =
    this.store.select(selectShowFilters);
  readonly sorting$: Observable<SortingOption> =
    this.store.select(selectSorting);
  readonly isSortingByDate$: Observable<boolean> = this.store.select(
    selectIsSortingByDate
  );
  readonly isSortingByViews$: Observable<boolean> = this.store.select(
    selectIsSortingByViews
  );
  readonly isAscending$: Observable<boolean> =
    this.store.select(selectIsAscending);
  readonly isDescending$: Observable<boolean> =
    this.store.select(selectIsDescending);
  readonly filterKeyword$: Observable<string> =
    this.store.select(selectFilterKeyword);

  toggleFilters(): void {
    this.store.dispatch(VideoActions.toggleFiltersVisibility());
  }

  hideFilters(): void {
    this.store.dispatch(VideoActions.setFiltersVisibility({ visible: false }));
  }

  setSorting(field: 'date' | 'viewCount', direction: 'asc' | 'desc'): void {
    this.store.dispatch(
      VideoActions.setSorting({
        sorting: { field, direction },
      })
    );
  }

  toggleSortDirection(): void {
    this.store.dispatch(VideoActions.toggleSortDirection());
  }

  currentSorting(): SortingOption {
    let result: SortingOption = { field: 'date', direction: 'desc' };
    const subscription = this.sorting$.subscribe((sorting) => {
      result = sorting;
    });
    subscription.unsubscribe();
    return result;
  }

  setFilterKeyword(keyword: string): void {
    this.store.dispatch(VideoActions.setFilterKeyword({ keyword }));
  }
}
