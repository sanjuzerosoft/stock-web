import { Component } from '@angular/core';
import { DynamicContentPageComponent } from '../../shared/components/dynamic-content-page/dynamic-content-page.component';
import { CONTENT_IDS } from '../../shared/models/content-ids';

@Component({
  selector: 'app-about',
  imports: [DynamicContentPageComponent],
  template: `
    <app-dynamic-content-page
      [contentId]="contentIds.about"
      pillLabel="About"
      pageId="about"
    />
  `,
})
export class AboutComponent {
  protected readonly contentIds = CONTENT_IDS;
}
