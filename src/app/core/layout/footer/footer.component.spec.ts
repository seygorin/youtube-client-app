import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import FooterComponent from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create footer', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer with author link', () => {
    const footerElement = fixture.debugElement.query(By.css('footer'));
    expect(footerElement).toBeTruthy();

    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement).toBeTruthy();
    expect(linkElement.nativeElement.textContent).toBe('seygorin');
    expect(linkElement.nativeElement.href).toContain('github.com/seygorin');
    expect(linkElement.nativeElement.target).toBe('_blank');
    expect(linkElement.nativeElement.rel).toBe('noopener noreferrer');
  });
});
