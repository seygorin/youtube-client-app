import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { VideoService } from '../../../video/services/video.service';
import { VideoItem } from '../../../video/models/video.model';
import { Observable, map, startWith } from 'rxjs';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

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
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  customVideos$: Observable<VideoItem[]> = this.videoService.customVideos$.pipe(
    startWith([]),
    map((videos) => videos || [])
  );

  displayedColumns: string[] = [
    'thumbnail',
    'title',
    'channelTitle',
    'actions',
  ];

  addNewCard(): void {
    void this.router.navigate(['/admin/create']);
  }

  deleteCard(video: VideoItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete "${video.title}"?`,
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'No, Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.videoService.deleteCustomVideo(video.id);
        this.snackBar.open('Video card deleted successfully!', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}
