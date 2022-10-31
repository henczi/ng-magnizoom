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

  imageSrc = 'https://www.w3schools.com/html/pic_trulli.jpg';

  toggleImageSrc() {
    this.imageSrc = this.imageSrc === 'https://www.w3schools.com/html/pic_trulli.jpg'
      ? 'https://www.w3schools.com/html/img_girl.jpg'
      : 'https://www.w3schools.com/html/pic_trulli.jpg';

  }
}
