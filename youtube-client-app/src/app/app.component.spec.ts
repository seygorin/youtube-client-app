import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: '<div class="mock-header">Mock Header</div>',
  standalone: true,
})
class MockHeaderComponent {}

@Component({
  selector: 'app-footer',
  template: '<div class="mock-footer">Mock Footer</div>',
  standalone: true,
})
class MockFooterComponent {}

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

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent,
        MockHeaderComponent,
        MockFooterComponent,
      ],
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
        {
          provide: BreakpointObserver,
          useValue: {
            observe: (): Observable<{ matches: boolean }> =>
              of({ matches: false }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render header component', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
  });

  it('should render footer component', () => {
    const footerElement = fixture.debugElement.query(By.css('app-footer'));
    expect(footerElement).toBeTruthy();
  });

  it('should have a main element containing router-outlet', () => {
    const mainElement = fixture.debugElement.query(By.css('main'));
    expect(mainElement).toBeTruthy();

    const routerOutletElement = mainElement.query(By.css('router-outlet'));
    expect(routerOutletElement).toBeTruthy();
  });

  it('should have the correct structure (header, main, footer)', () => {
    const rootElement = fixture.nativeElement;
    const childNodes = Array.from(rootElement.children).map((node) => {
      const element = node as HTMLElement;
      return element.tagName.toLowerCase();
    });

    expect(childNodes[0]).toBe('app-header');
    expect(childNodes[1]).toBe('main');
    expect(childNodes[2]).toBe('app-footer');
  });

  it('should maintain correct order of components', () => {
    const elements = fixture.debugElement.queryAll(
      By.css('app-header, main, app-footer')
    );

    expect(elements.length).toBe(3);
    expect(elements[0].name).toBe('app-header');
    expect(elements[1].name).toBe('main');
    expect(elements[2].name).toBe('app-footer');
  });

  it('should have a RouterOutlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should have main element for content', () => {
    const mainElement = fixture.debugElement.query(By.css('main'));
    expect(mainElement).toBeTruthy();
  });
});
