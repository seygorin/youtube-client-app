import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  private route = inject(ActivatedRoute);

  isLoading = false;
  searchResults: VideoItem[] = [];
  searchError: string | null = null;
  searchQuery = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const query = params['query'];

      if (!query || query.trim().length < 3) {
        void this.router.navigate(['/']);
        return;
      }

      this.searchQuery = query;
      this.searchService.setSearchQuery(query);

      this.isLoading = true;

      this.searchService.performSearch().subscribe({
        next: (results) => {
          this.searchResults = results;
          this.isLoading = false;
          this.searchService.saveSearchResults(results);
        },
        error: (err) => {
          console.error('Error in search results:', err);
          this.searchError =
            'An error occurred while searching. Please try again.';
          this.isLoading = false;
        },
      });
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
