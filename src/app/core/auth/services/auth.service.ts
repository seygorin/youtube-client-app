import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  isAuthenticated = signal<boolean>(this.hasToken());
  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(private router: Router) {}

  login(credentials: LoginRequest): { success: boolean; message?: string } {
    if (!credentials.email || !credentials.password) {
      return { success: false, message: 'Email and password are required' };
    }

    const authResponse: AuthResponse = {
      user: {
        email: credentials.email,
        name: credentials.email.split('@')[0],
      },
      token: 'fake-jwt-token-' + Math.random().toString(36).substring(2),
    };

    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

    this.isAuthenticated.set(true);
    this.currentUser.set(authResponse.user);

    return { success: true };
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.isAuthenticated.set(false);
    this.currentUser.set(null);

    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
