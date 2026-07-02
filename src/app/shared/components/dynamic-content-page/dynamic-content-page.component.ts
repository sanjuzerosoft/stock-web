import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FooterComponent } from '../../../core/components/footer/footer.component';
import { PageLoadingComponent } from '../page-loading/page-loading.component';
import { ContentService } from '../../services/content.service';
import { prepareApiContent } from '../../utils/prepare-api-content';
import { prepareAboutContent } from '../../utils/prepare-about-content';

@Component({
  selector: 'app-dynamic-content-page',
  imports: [FooterComponent, PageLoadingComponent],
  templateUrl: './dynamic-content-page.component.html',
})
export class DynamicContentPageComponent implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  readonly contentId = input.required<number>();
  readonly pillLabel = input.required<string>();
  readonly pageId = input.required<string>();

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly title = signal('');
  protected readonly safeContent = signal<SafeHtml | null>(null);

  ngOnInit(): void {
    this.contentService
      .getContent(this.contentId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (info) => {
          this.title.set(info.title);
          const html =
            this.pageId() === 'about'
              ? prepareAboutContent(info.content)
              : prepareApiContent(info.content);
          this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Unable to load content. Please try again later.');
          this.loading.set(false);
        },
      });
  }
}
