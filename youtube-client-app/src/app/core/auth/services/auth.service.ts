import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, AuthResponse } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  isAuthenticated = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  constructor(
    private router: Router,
    private storageService: LocalStorageService
  ) {
    this.isAuthenticated.set(this.hasToken());
    this.currentUser.set(this.getUserFromStorage());
  }

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

    this.storageService.setItem(this.TOKEN_KEY, authResponse.token);
    this.storageService.setItem(this.USER_KEY, authResponse.user);

    this.isAuthenticated.set(true);
    this.currentUser.set(authResponse.user);

    return { success: true };
  }

  logout(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
    this.storageService.removeItem(this.USER_KEY);

    this.isAuthenticated.set(false);
    this.currentUser.set(null);

    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storageService.getItem<string>(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private getUserFromStorage(): User | null {
    return this.storageService.getItem<User>(this.USER_KEY);
  }
}
