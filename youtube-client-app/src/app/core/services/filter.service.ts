import { Injectable, signal, computed } from '@angular/core';
import { SortingOption } from '../../shared/models/sorting.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  showFilters = signal<boolean>(false);

  private _sortingOption = signal<SortingOption>({
    field: 'date',
    direction: 'desc',
  });

  isSortingByDate = computed(() => this._sortingOption().field === 'date');
  isSortingByViews = computed(
    () => this._sortingOption().field === 'viewCount'
  );
  isAscending = computed(() => this._sortingOption().direction === 'asc');
  isDescending = computed(() => this._sortingOption().direction === 'desc');

  currentSorting = this._sortingOption.asReadonly();

  toggleFilters(): void {
    this.showFilters.update((value) => !value);
  }

  setSorting(field: 'date' | 'viewCount', direction: 'asc' | 'desc'): void {
    this._sortingOption.set({ field, direction });
  }

  toggleSortDirection(): void {
    this._sortingOption.update((current) => ({
      ...current,
      direction: current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }
}
