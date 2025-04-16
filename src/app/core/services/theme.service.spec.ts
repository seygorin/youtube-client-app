import { TestBed } from '@angular/core/testing';
import ThemeService from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let originalLocalStorage: Storage;
  let mockMatchMedia: jasmine.Spy;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;

    localStorageSpy = jasmine.createSpyObj('localStorage', [
      'getItem',
      'setItem',
    ]);
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    spyOn(document.body.classList, 'add');
    spyOn(document.body.classList, 'remove');

    mockMatchMedia = jasmine.createSpy('matchMedia').and.returnValue({
      matches: false,
    });
    Object.defineProperty(window, 'matchMedia', { value: mockMatchMedia });

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme if no theme is saved', () => {
    localStorageSpy.getItem.and.returnValue(null);
    mockMatchMedia.and.returnValue({ matches: false });

    service = TestBed.inject(ThemeService);

    expect(service.isDarkTheme()).toBeFalse();
    expect(document.body.classList.remove).toHaveBeenCalledWith('dark-theme');
  });

  it('should toggle theme from light to dark', () => {
    service.setDarkTheme(false);
    localStorageSpy.setItem.calls.reset();
    (document.body.classList.add as jasmine.Spy).calls.reset();
    (document.body.classList.remove as jasmine.Spy).calls.reset();

    service.toggleTheme();

    expect(service.isDarkTheme()).toBeTrue();
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
  });

  it('should toggle theme from dark to light', () => {
    service.setDarkTheme(true);
    localStorageSpy.setItem.calls.reset();
    (document.body.classList.add as jasmine.Spy).calls.reset();
    (document.body.classList.remove as jasmine.Spy).calls.reset();

    service.toggleTheme();

    expect(service.isDarkTheme()).toBeFalse();
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.body.classList.remove).toHaveBeenCalledWith('dark-theme');
  });

  it('should set dark theme and update localStorage', () => {
    localStorageSpy.setItem.calls.reset();
    (document.body.classList.add as jasmine.Spy).calls.reset();

    service.setDarkTheme(true);

    expect(service.isDarkTheme()).toBeTrue();
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
  });

  it('should set light theme and update localStorage', () => {
    service.setDarkTheme(true);

    localStorageSpy.setItem.calls.reset();
    (document.body.classList.remove as jasmine.Spy).calls.reset();

    service.setDarkTheme(false);

    expect(service.isDarkTheme()).toBeFalse();
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.body.classList.remove).toHaveBeenCalledWith('dark-theme');
  });
});
