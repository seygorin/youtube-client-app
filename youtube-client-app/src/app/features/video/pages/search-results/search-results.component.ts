import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { VideoItem } from '../../models/video.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    SearchItemComponent,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  private searchService = inject(SearchService);
  private router = inject(Router);

  isLoading = false;
  searchResults: VideoItem[] = [];
  searchError: string | null = null;
  searchQuery = '';

  ngOnInit(): void {
    this.searchQuery = this.searchService.getCurrentQuery();

    if (!this.searchQuery || this.searchQuery.trim().length < 3) {
      void this.router.navigate(['/']);
      return;
    }

    this.isLoading = true;

    this.searchService.performSearch().subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error in search results:', err);
        this.searchError =
          'An error occurred while searching. Please try again.';
        this.isLoading = false;
      },
    });

    this.searchService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.searchService.searchError$.subscribe((error) => {
      this.searchError = error;
    });
  }

  trackById(index: number, item: VideoItem): string {
    return item.id;
  }
}
