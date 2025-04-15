import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
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

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            videos: {
              id: null,
              title: '',
              description: '',
              publishedAt: '',
              thumbnail: '',
              viewCount: 0,
              likeCount: 0,
              dislikeCount: 0,
              commentCount: 0,
              channelTitle: '',
              isCustom: false,
            },
            filters: {
              showFilters: false,
              sorting: {
                field: 'date',
                direction: 'desc',
              },
              filterKeyword: '',
            },
            custom: {
              customVideos: [],
            },
            favorites: {
              favorites: [],
              loading: false,
              error: null,
            },
            auth: {
              isLoggedIn: false,
              user: null,
              error: null,
            },
          },
        }),
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should contain a material toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should contain search input field', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement).toBeTruthy();
  });

  it('should contain buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should contain material icons', () => {
    const icons = fixture.nativeElement.querySelectorAll('mat-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render a toolbar with app title or logo', () => {
    const appName =
      fixture.nativeElement.querySelector('.logo') ||
      fixture.nativeElement.querySelector('h1');
    expect(appName).toBeTruthy();
  });
});
