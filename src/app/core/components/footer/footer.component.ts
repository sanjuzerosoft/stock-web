import { Component, DestroyRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FOOTER_CONTENT_ID } from '../../../shared/models/content-ids';
import { ContentService } from '../../../shared/services/content.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { prepareApiContent } from '../../../shared/utils/prepare-api-content';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  private readonly navigation = inject(NavigationService);
  private readonly contentService = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly bottomContent = signal<SafeHtml | null>(null);

  ngOnInit(): void {
    this.contentService
      .getContent(FOOTER_CONTENT_ID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (record) => {
          this.bottomContent.set(
            this.sanitizer.bypassSecurityTrustHtml(prepareApiContent(record.content, false)),
          );
        },
        error: () => {
          this.bottomContent.set(null);
        },
      });
  }

  protected onScroll(sectionId: string): void {
    this.navigation.scrollToSection(sectionId);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return;

    // Only handle anchors inside the footer's dynamic content
    if (!anchor.closest('.footer-bottom-content')) return;

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
}
