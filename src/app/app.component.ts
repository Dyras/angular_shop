import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular_shop';

  badgeUpdater() {
    if (localStorage.getItem('cart') !== null) {
      let counter = 0;
      for (
        let i = 0;
        i < JSON.parse(localStorage.getItem('cart') || '[]').length;
        i++
      ) {
        counter += parseInt(
          JSON.parse(localStorage.getItem('cart') || '[]')[i].amount
        );
      }
      return counter;
      {
      }
    } else return 0;
  }
}
