import { Component } from '@angular/core';
import { DynamicContentPageComponent } from '../../shared/components/dynamic-content-page/dynamic-content-page.component';
import { CONTENT_IDS } from '../../shared/models/content-ids';

@Component({
  selector: 'app-disclosure',
  imports: [DynamicContentPageComponent],
  template: `
    <app-dynamic-content-page
      [contentId]="contentIds.disclosure"
      pillLabel="Disclosure"
      pageId="disclosure"
    />
  `,
})
export class DisclosureComponent {
  protected readonly contentIds = CONTENT_IDS;
}
