import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ValidationService } from '../../../../core/auth/services/validation.service';
import { VideoService } from '../../../video/services/video.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-video',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-video.component.html',
  styleUrl: './create-video.component.scss',
})
export class CreateVideoComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private validationService = inject(ValidationService);
  private videoService = inject(VideoService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  cardForm: FormGroup = this.createForm();
  isSubmitting = false;
  submitError = '';

  constructor() {
    if (!this.authService.isAuthenticated()) {
      void this.router.navigate(['/login']);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: ['', [Validators.maxLength(500)]],
      thumbnail: [
        '',
        [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      ],
      videoLink: [
        '',
        [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      ],
    });
  }

  private extractYoutubeId(url: string): string {
    const regExp =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[1].length === 11 ? match[1] : '';
  }

  onSubmit(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    try {
      const { title, description, thumbnail, videoLink } = this.cardForm.value;

      const videoId = this.extractYoutubeId(videoLink);

      const newCard = {
        id: videoId,
        title,
        description,
        thumbnail,
        publishedAt: new Date().toISOString(),
        viewCount: 0,
        likeCount: 0,
        dislikeCount: 0,
        commentCount: 0,
        channelTitle: this.authService.currentUser()?.name || 'Custom User',
      };

      this.videoService.addCustomVideo(newCard);

      this.snackBar.open('Video card created successfully!', 'Close', {
        duration: 3000,
      });

      void this.router.navigate(['/admin']);
    } catch (error) {
      this.submitError = 'Error creating video card. Please try again.';
      console.error('Error creating card:', error);
      this.isSubmitting = false;
    }
  }

  cancel(): void {
    void this.router.navigate(['/admin']);
  }

  get titleControl() {
    return this.cardForm.get('title');
  }

  get descriptionControl() {
    return this.cardForm.get('description');
  }

  get thumbnailControl() {
    return this.cardForm.get('thumbnail');
  }

  get videoLinkControl() {
    return this.cardForm.get('videoLink');
  }
}
