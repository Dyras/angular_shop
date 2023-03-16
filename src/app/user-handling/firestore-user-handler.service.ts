import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { CartService } from '../cart-service/cart.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreUserHandlerService {
  constructor(private cartService: CartService) {}
  handleUser() {
    const auth = getAuth();
    const firestore = getFirestore();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User is logged in');
        this.cartService.setCartLength(null);

        this.idCreator();
      } else {
        if (
          localStorage.getItem('id')?.length === 0 ||
          !localStorage.getItem('id')
        ) {
          this.idCreator();

          this.cartService.setCartLength(null);
        }
        const user = localStorage.getItem('id');

        if (user != null) {
          const ref = doc(firestore, 'Temp_Users', user);
          const docSnap = await getDoc(ref);
          if (!docSnap.exists()) {
            console.log('User not found in firestore, adding user');
            this.createFirestoreTempUser(user);
          }
        }
      }
    });
  }
  createFirestoreTempUser(user: string) {
    setDoc(doc(getFirestore(), 'Temp_Users', user), {
      user: user,
      firstSeen: new Date(),
      cart: [],
    });
  }
  // If the user logs in, we need to create a new temp ID
  // This is done to prevent the user from losing their cart if they log in and then out again
  idCreator() {
    localStorage.setItem(
      'id',

      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
    console.log('Generated new ID: ' + localStorage.getItem('id'));
  }
}
