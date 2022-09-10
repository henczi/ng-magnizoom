import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-magnizoom-app';

  zoom = 3;
  position = { x: 200, y: 100 };
}
