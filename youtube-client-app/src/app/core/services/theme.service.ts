import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
class ThemeService {
  isDarkTheme = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDarkTheme(true);
    }

    if (!savedTheme) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      this.setDarkTheme(prefersDark);
    }
  }

  setDarkTheme(isDark: boolean) {
    this.isDarkTheme.set(isDark);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
	
  toggleTheme() {
    this.setDarkTheme(!this.isDarkTheme());
  }
}

export default ThemeService;
