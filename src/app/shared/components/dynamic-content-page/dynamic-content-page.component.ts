import { Component, DestroyRef, HostListener, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  readonly contentId = input.required<number>();
  readonly pillLabel = input.required<string>();
  readonly pageId = input.required<string>();

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly title = signal('');
  protected readonly safeContent = signal<SafeHtml | null>(null);

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return;

    // Only handle anchors inside the api-content container
    if (!anchor.closest('.api-content')) return;

    const href = (anchor as HTMLAnchorElement).getAttribute('href') || '';
    if (!href) return;

    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

    let url: URL | null = null;
    try {
      url = new URL(href, document.baseURI);
    } catch {
      url = null;
    }

    if (url && url.origin !== location.origin) return;

    const baseEl = document.querySelector('base[href]');
    const baseHref = baseEl?.getAttribute('href') ?? '/';
    let basePath = '';
    try {
      basePath = new URL(baseHref, document.baseURI).pathname.replace(/\/$/, '');
    } catch {
      basePath = baseHref.replace(/\/$/, '');
    }

    let internalPath = url ? url.pathname : href;
    if (basePath && basePath !== '/' && internalPath.startsWith(basePath)) {
      internalPath = internalPath.slice(basePath.length) || '/';
    }
    const suffix = url ? `${url.search}${url.hash}` : '';
    internalPath = `${internalPath}${suffix}`;

    event.preventDefault();
    void this.router.navigateByUrl(internalPath);
  }

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
