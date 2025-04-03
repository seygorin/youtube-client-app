import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import ThemeService from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule],
  template: `
    <div class="theme-toggle">
      <mat-icon>light_mode</mat-icon>
      <mat-slide-toggle
        [checked]="themeService.isDarkTheme()"
        (change)="themeService.toggleTheme()"
        color="primary"
      ></mat-slide-toggle>
      <mat-icon>dark_mode</mat-icon>
    </div>
  `,
  styles: `
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,
})
export default class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
