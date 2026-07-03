import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);

  scrollToSection(sectionId: string): void {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let attempts = 0;
    const scroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (attempts < 10) {
        attempts += 1;
        setTimeout(scroll, 100);
      }
    };

    const onHome = this.router.url === '/' || this.router.url.startsWith('/#');

    if (onHome) {
      setTimeout(scroll, 60);
    } else {
      void this.router.navigate(['/'], { fragment: sectionId });
    }
  }

  navigateToPage(path: '/' | '/about'): void {
    void this.router.navigate([path]);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  isActive(path: string): boolean {
    if (path === '/') {
      return this.router.url === '/' || this.router.url.startsWith('/#');
    }
    return this.router.url.startsWith(path);
  }
}
