import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly navigation = inject(NavigationService);

  protected onScroll(sectionId: string): void {
    this.navigation.scrollToSection(sectionId);
  }
}
