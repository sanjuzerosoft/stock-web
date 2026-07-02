import { Component } from '@angular/core';
import { DynamicContentPageComponent } from '../../shared/components/dynamic-content-page/dynamic-content-page.component';
import { CONTENT_IDS } from '../../shared/models/content-ids';

@Component({
  selector: 'app-privacy',
  imports: [DynamicContentPageComponent],
  template: `
    <app-dynamic-content-page
      [contentId]="contentIds.privacy"
      pillLabel="Privacy Policy"
      pageId="policy"
    />
  `,
})
export class PrivacyComponent {
  protected readonly contentIds = CONTENT_IDS;
}
