import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
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
}
