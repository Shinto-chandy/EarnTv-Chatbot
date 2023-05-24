import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: ['.container { margin-top: 20px; }']
})
export class AppComponent { }

