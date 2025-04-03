import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ThemeToggleComponent from './shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export default class AppComponent {
  title = 'youtube-client-app';
}
