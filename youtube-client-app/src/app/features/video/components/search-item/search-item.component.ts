import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VideoItem } from '../../models/video.model';
import { PublicationDateColorDirective } from '../../../../shared/directives/publication-date-color.directive';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectCustomVideos } from '../../store/video.selectors';

@Component({
  selector: 'app-search-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PublicationDateColorDirective,
  ],
  templateUrl: './search-item.component.html',
  styleUrl: './search-item.component.scss',
})
export class SearchItemComponent implements OnInit {
  @Input() video!: VideoItem;

  isCustomVideo = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectCustomVideos)
      .pipe(
        map((customVideos) =>
          customVideos.some((customVideo) => customVideo.id === this.video.id)
        )
      )
      .subscribe((isCustom) => {
        this.isCustomVideo = isCustom;
      });
  }
}
