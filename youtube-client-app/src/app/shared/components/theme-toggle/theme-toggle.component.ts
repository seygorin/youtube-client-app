import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import ThemeService from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export default class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
