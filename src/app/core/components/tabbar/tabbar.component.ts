import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tabbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tabbar.component.html',
})
export class TabbarComponent {}
