import { Component } from '@angular/core';
import { FirestoreUserHandlerService } from './user-handling/firestore-user-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private firestoreUserHandlerService: FirestoreUserHandlerService
  ) {
    firestoreUserHandlerService.handleUser();
  }
}
