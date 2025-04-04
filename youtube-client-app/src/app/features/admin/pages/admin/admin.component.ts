import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { VideoService } from '../../../video/services/video.service';
import { VideoItem } from '../../../video/models/video.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private videoService = inject(VideoService);
  private router = inject(Router);
  protected authService = inject(AuthService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  customVideos = this.videoService.customVideos;

  displayedColumns: string[] = [
    'thumbnail',
    'title',
    'channelTitle',
    'actions',
  ];

  constructor() {
    if (!this.authService.isAuthenticated()) {
      void this.router.navigate(['/login']);
    }
  }

  addNewCard(): void {
    void this.router.navigate(['/admin/create']);
  }

  deleteCard(video: VideoItem): void {
    if (confirm('Are you sure you want to delete this video card?')) {
      this.videoService.deleteCustomVideo(video.id);
      this.snackBar.open('Video card deleted successfully!', 'Close', {
        duration: 3000,
      });
    }
  }
}
