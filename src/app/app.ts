import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { TabbarComponent } from './core/components/tabbar/tabbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, TabbarComponent],
  templateUrl: './app.html',
})
export class App {}
