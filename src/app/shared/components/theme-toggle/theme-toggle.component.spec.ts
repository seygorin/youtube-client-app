import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatIconHarness } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import ThemeToggleComponent from './theme-toggle.component';
import ThemeService from '../../../core/services/theme.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';

beforeAll(() => {
  if (!window.matchMedia('(min-width: 768px)').addEventListener) {
    Object.defineProperty(MediaQueryList.prototype, 'addEventListener', {
      value: function (type: string, listener: EventListener) {
        this.addListener(listener);
      },
    });

    Object.defineProperty(MediaQueryList.prototype, 'removeEventListener', {
      value: function (type: string, listener: EventListener) {
        this.removeListener(listener);
      },
    });
  }
});

const breakpointObserverMock = {
  observe: jasmine.createSpy('observe').and.returnValue(of({ matches: false })),
};

class MockThemeService {
  isDarkTheme = signal(false);

  setDarkTheme = jasmine
    .createSpy('setDarkTheme')
    .and.callFake((isDark: boolean) => {
      this.isDarkTheme.set(isDark);
    });

  toggleTheme = jasmine.createSpy('toggleTheme').and.callFake(() => {
    this.isDarkTheme.set(!this.isDarkTheme());
  });
}

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: MockThemeService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    themeService = new MockThemeService();

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent, MatIconModule],
      providers: [
        { provide: ThemeService, useValue: themeService },
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ThemeService', () => {
    expect(component.themeService).toBeTruthy();
    expect(component.themeService).toBe(themeService);
  });

  it('should display light_mode icon when theme is light', () => {
    themeService.isDarkTheme.set(false);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement.nativeElement.textContent.trim()).toBe('light_mode');
  });

  it('should display dark_mode icon when theme is dark', () => {
    themeService.isDarkTheme.set(true);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement.nativeElement.textContent.trim()).toBe('dark_mode');
  });

  it('should use ThemeService to manage theme state', () => {
    expect(themeService.isDarkTheme()).toBeFalse();

    themeService.toggleTheme();
    expect(themeService.isDarkTheme()).toBeTrue();

    themeService.setDarkTheme(false);
    expect(themeService.isDarkTheme()).toBeFalse();
  });

  it('should render a material icon', async () => {
    const icons = await loader.getAllHarnesses(MatIconHarness);
    expect(icons.length).toBe(1);
  });

  it('should have correct icon text based on theme', async () => {
    const icon = await loader.getHarness(MatIconHarness);

    themeService.isDarkTheme.set(false);
    fixture.detectChanges();
    expect(await icon.getName()).toBe('light_mode');

    themeService.isDarkTheme.set(true);
    fixture.detectChanges();
    expect(await icon.getName()).toBe('dark_mode');
  });

  it('should toggle theme when icon is clicked directly', () => {
    const iconElement = fixture.debugElement.query(By.css('mat-icon'));

    themeService.toggleTheme.calls.reset();

    iconElement.nativeElement.click();

    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should toggle theme on keydown.enter event', () => {
    const iconElement = fixture.debugElement.query(By.css('mat-icon'));

    themeService.toggleTheme.calls.reset();

    iconElement.triggerEventHandler('keydown.enter', {});

    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should toggle theme and prevent default on keydown.space event', () => {
    const iconElement = fixture.debugElement.query(By.css('mat-icon'));

    themeService.toggleTheme.calls.reset();

    const keyEvent = { preventDefault: jasmine.createSpy('preventDefault') };

    iconElement.triggerEventHandler('keydown.space', keyEvent);

    expect(themeService.toggleTheme).toHaveBeenCalled();
    expect(keyEvent.preventDefault).toHaveBeenCalled();
  });

  it('should update icon when theme changes', () => {
    themeService.isDarkTheme.set(false);
    fixture.detectChanges();

    let iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement.nativeElement.textContent.trim()).toBe('light_mode');

    themeService.isDarkTheme.set(true);
    fixture.detectChanges();

    iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement.nativeElement.textContent.trim()).toBe('dark_mode');
  });
});
