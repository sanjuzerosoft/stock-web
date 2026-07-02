import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-loading',
  templateUrl: './page-loading.component.html',
})
export class PageLoadingComponent {
  readonly variant = input<'home' | 'doc'>('doc');
}
