import {
  Component,
  inject,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { VideoItem } from '../../models/video.model';
import { SearchItemComponent } from '../../components/search-item/search-item.component';
import {
  selectAllVideos,
  selectLoading,
  selectSortedAndFilteredVideos,
  selectVideosLoaded,
} from '../../store/video.selectors';
import {
  Observable,
  filter,
  take,
  distinctUntilChanged,
  combineLatest,
  map,
} from 'rxjs';
import { VideoActions } from '../../store/video.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [
    CommonModule,
    SearchItemComponent,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
})
export class VideoListComponent implements OnInit {
  private store = inject(Store);
  private ngZone = inject(NgZone);

  @ViewChild('videoContainer') videoContainer!: ElementRef;

  sortedVideos$: Observable<VideoItem[]> = this.store.select(
    selectSortedAndFilteredVideos
  );

  isLoading$: Observable<boolean> = this.store.select(selectLoading);

  public isLoadingMore = false;
  private scrollPosition = 0;
  private loadingInitiated = false;
  private initialLoadComplete = false;

  ngOnInit(): void {
    this.store
      .select(selectAllVideos)
      .pipe(take(1))
      .subscribe((videos) => {
        if (!videos || videos.length === 0) {
          this.loadVideosSequentially();
        } else {
          this.initialLoadComplete = true;
        }
      });

    this.store
      .select(selectLoading)
      .pipe(distinctUntilChanged())
      .subscribe((isLoading) => {
        if (!isLoading && this.isLoadingMore) {
          this.isLoadingMore = false;
          this.loadingInitiated = false;

          setTimeout(() => {
            window.scrollTo({
              top: this.scrollPosition,
              behavior: 'auto',
            });
          }, 10);
        }
      });
  }

  private loadVideosSequentially(): void {
    this.store.dispatch(VideoActions.loadPopularVideos());

    this.store
      .select(selectVideosLoaded)
      .pipe(
        filter((loaded) => loaded),
        take(1)
      )
      .subscribe(() => {
        this.initialLoadComplete = true;
        this.store.dispatch(VideoActions.loadCustomVideos());
      });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (
      this.isLoadingMore ||
      this.loadingInitiated ||
      !this.initialLoadComplete
    )
      return;

    this.scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (documentHeight - (this.scrollPosition + windowHeight) < 300) {
      this.loadMoreVideos();
    }
  }

  loadMoreVideos(): void {
    this.ngZone.runOutsideAngular(() => {
      this.store
        .select(selectLoading)
        .pipe(take(1))
        .subscribe((isLoading) => {
          if (!isLoading && !this.isLoadingMore && !this.loadingInitiated) {
            this.ngZone.run(() => {
              this.loadingInitiated = true;
              this.isLoadingMore = true;
              this.store.dispatch(VideoActions.loadMorePopularVideos());
            });
          }
        });
    });
  }

  trackById(index: number, video: VideoItem): string {
    return index + ':' + video.id;
  }

  showMainLoader(): Observable<boolean> {
    return combineLatest([
      this.isLoading$,
      this.store.select(selectAllVideos),
    ]).pipe(
      map(([isLoading, videos]) => {
        return isLoading && (!videos || videos.length === 0);
      })
    );
  }
}
