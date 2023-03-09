import { Component } from '@angular/core';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { IProductSaved } from './products/product';
import { FirestoreUserHandlerService } from './user-handling/firestore-user-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular_shop';

  constructor(
    private firestoreUserHandlerService: FirestoreUserHandlerService
  ) {
    firestoreUserHandlerService.handleUser();
  }
}
