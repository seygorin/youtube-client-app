import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPublicationDateColor]',
  standalone: true,
  host: {
    '[style.border-bottom-width.px]': '5',
    '[style.border-bottom-style]': '"solid"',
  },
})
export class PublicationDateColorDirective implements OnInit {
  @Input({ required: true }) publishedAt!: string;

  private readonly RED_COLOR = '#f44336';
  private readonly YELLOW_COLOR = '#ffeb3b';
  private readonly GREEN_COLOR = '#4caf50';
  private readonly BLUE_COLOR = '#2196f3';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.publishedAt) {
      return;
    }

    const publishDate = new Date(this.publishedAt);
    const currentDate = new Date();

    const diffTime = currentDate.getTime() - publishDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let borderColor: string;

    if (diffDays > 180) {
      borderColor = this.RED_COLOR;
    } else if (diffDays > 30) {
      borderColor = this.YELLOW_COLOR;
    } else if (diffDays > 7) {
      borderColor = this.GREEN_COLOR;
    } else {
      borderColor = this.BLUE_COLOR;
    }

    this.renderer.setStyle(
      this.el.nativeElement,
      'border-bottom-color',
      borderColor
    );
  }
}
