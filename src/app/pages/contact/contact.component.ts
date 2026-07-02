import { Component, DestroyRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContactService } from '../../shared/services/contact.service';
import { ContentService } from '../../shared/services/content.service';
import { CONTENT_IDS } from '../../shared/models/content-ids';
import { prepareApiContent } from '../../shared/utils/prepare-api-content';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly contactService = inject(ContactService);
  private readonly contentService = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitting = signal(false);
  protected readonly submitSuccess = signal(false);
  protected readonly submitError = signal('');
  protected readonly reachLoading = signal(true);
  protected readonly reachContent = signal<SafeHtml | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    message: ['', Validators.required],
  });

  ngOnInit(): void {
    this.contentService
      .getContent(CONTENT_IDS.contactReach)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (record) => {
          this.reachContent.set(
            this.sanitizer.bypassSecurityTrustHtml(prepareApiContent(record.content, false)),
          );
          this.reachLoading.set(false);
        },
        error: () => {
          this.reachContent.set(null);
          this.reachLoading.set(false);
        },
      });
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown', ['$event'])
  protected onReachAction(event: MouseEvent | KeyboardEvent): void {
    if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const target = (event.target as HTMLElement).closest('[data-nav]');
    if (!target) {
      return;
    }

    event.preventDefault();
    const path = target.getAttribute('data-nav');
    if (path?.startsWith('/') && !path.startsWith('//')) {
      void this.router.navigateByUrl(path);
    }
  }

  protected submit(): void {
    this.submitSuccess.set(false);
    this.submitError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, phone, message } = this.form.getRawValue();

    this.submitting.set(true);

    this.contactService
      .submitContact({
        name,
        email,
        phone,
        message,
        date: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitSuccess.set(true);
          this.form.reset();
        },
        error: () => {
          this.submitting.set(false);
          this.submitError.set('Something went wrong. Please try again or email us at info@stock-advisors.com.');
        },
      });
  }

  protected showError(controlName: 'name' | 'email' | 'phone' | 'message'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  protected errorMessage(controlName: 'name' | 'email' | 'phone' | 'message'): string {
    const control = this.form.controls[controlName];

    if (!control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (controlName === 'email' && control.errors['email']) {
      return 'Please enter a valid email address.';
    }

    return 'This field is invalid.';
  }
}
