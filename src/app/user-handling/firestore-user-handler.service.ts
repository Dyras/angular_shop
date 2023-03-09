import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreUserHandlerService {
  constructor() {}
  handleUser() {
    const auth = getAuth();
    const firestore = getFirestore();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User is logged in');
        const tempUser = localStorage.getItem('id') || '';

        const storageArray = JSON.parse(localStorage.getItem('cart') || '[]');

        // Add all items from localStorage to Firestore for the logged in user
        setDoc(doc(firestore, 'Users', user.uid), {
          cart: storageArray,
        });
        // Add all items from localStorage to Firestore for the temp user ID
        // This is done to keep the cart items for the user if they log out
        setDoc(doc(firestore, 'Temp_Users', tempUser), {
          cart: storageArray,
        });
      } else {
        if (
          localStorage.getItem('id')?.length === 0 ||
          !localStorage.getItem('id')
        ) {
          localStorage.setItem(
            'id',

            Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15)
          );
          console.log(
            'User not logged in. Generated new ID: ' +
              localStorage.getItem('id')
          );
        }
        const user = localStorage.getItem('id');

        console.log('User', user);
        if (user != null) {
          const ref = doc(firestore, 'Temp_Users', user);
          const docSnap = await getDoc(ref);
          if (docSnap.exists()) {
            localStorage.setItem(
              'cart',
              JSON.stringify(docSnap.data()['cart'])
            );
          } else {
            setDoc(doc(firestore, 'Temp_Users', user), {
              user: user,
              firstSeen: new Date(),
              cart: [],
            });
          }
        }
      }
    });
  }
}
