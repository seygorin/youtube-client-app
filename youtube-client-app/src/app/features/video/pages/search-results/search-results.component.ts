import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import { VideoItem } from '../../models/video.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, SearchItemComponent, MatProgressSpinnerModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  searchResults: VideoItem[] = [];
  isLoading = false;
  searchError: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        const query = params['query'];
        if (!query || query.trim().length < 3) {
          void this.router.navigate(['/']);
          return;
        }
        this.searchQuery = query;
        this.searchService.setSearchQuery(query);

        this.searchService.performSearch(query);
      })
    );

    this.subscriptions.add(
      this.searchService.searchResults$.subscribe((results) => {
        this.searchResults = results;
      })
    );

    this.subscriptions.add(
      this.searchService.loading$.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );

    this.subscriptions.add(
      this.searchService.error$.subscribe((error) => {
        this.searchError = error;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  trackById(index: number, video: VideoItem): string {
    return video.id;
  }
}
