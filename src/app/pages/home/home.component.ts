import { Component, DestroyRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { PageLoadingComponent } from '../../shared/components/page-loading/page-loading.component';
import { HomeSectionKey, STORE_LINK_IDS } from '../../shared/models/content-ids';
import { ContentService } from '../../shared/services/content.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { injectHeroStoreLinks } from '../../shared/utils/inject-hero-store-links';
import { prepareApiContent } from '../../shared/utils/prepare-api-content';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, PageLoadingComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly navigation = inject(NavigationService);
  private readonly contentService = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly loadError = signal('');

  protected readonly sections = signal<Partial<Record<HomeSectionKey, SafeHtml>>>({});

  ngOnInit(): void {
    this.route.fragment
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((fragment) => {
        if (fragment) {
          setTimeout(() => this.navigation.scrollToSection(fragment), 100);
        }
      });

    forkJoin({
      sections: this.contentService.getHomeSections(),
      iosStore: this.contentService.getContent(STORE_LINK_IDS.ios),
      androidStore: this.contentService.getContent(STORE_LINK_IDS.android),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ sections, iosStore, androidStore }) => {
          const safe: Partial<Record<HomeSectionKey, SafeHtml>> = {};

          for (const key of Object.keys(sections) as HomeSectionKey[]) {
            let html = sections[key].content;

            if (key === 'hero') {
              html = injectHeroStoreLinks(html, iosStore.content, androidStore.content);
            }

            safe[key] = this.sanitizer.bypassSecurityTrustHtml(
              prepareApiContent(html, false),
            );
          }

          this.sections.set(safe);
          this.loading.set(false);
        },
        error: () => {
          this.loadError.set('Unable to load home page content. Please try again later.');
          this.loading.set(false);
        },
      });
  }

  @HostListener('click', ['$event'])
  protected onSectionClick(event: MouseEvent): void {
    const scrollEl = (event.target as HTMLElement).closest('[data-scroll]');
    if (!scrollEl) {
      return;
    }

    event.preventDefault();
    const sectionId = scrollEl.getAttribute('data-scroll');
    if (sectionId) {
      this.navigation.scrollToSection(sectionId);
    }

    const href = (scrollEl as HTMLAnchorElement).getAttribute('href');
    if (href?.startsWith('/')) {
      void this.router.navigateByUrl(href);
    }
  }
}
