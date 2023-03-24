import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class PayService {
  itemsInCart$: BehaviorSubject<IProductSaved[] | null> = new BehaviorSubject<
    IProductSaved[] | null
  >(null);
  totalItemCost$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentCartLength$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private router: Router) {}

  async pay() {
    const auth = getAuth();
    console.log('Pay');
    const userId = getAuth().currentUser?.uid || '';
    let mergeVariable = false;
    const userType = 'Users';

    const doesFirestoreEntryExist = async () => {
      const docRef = doc(getFirestore(), userType, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    };

    // Check if the user has something in the cart, just to be sure
    if (this.totalItemCost$.value !== 0 && this.itemsInCart$.value !== null) {
      let totalAmount = 0;
      for (let i = 0; i < this.itemsInCart$.value.length; i++) {
        totalAmount += this.itemsInCart$.value[i].amount;
      }

      // Check if the user has a purchase history in Firestore
      const firestoreExist = await doesFirestoreEntryExist();
      if (firestoreExist) {
        mergeVariable = true;

        updateDoc(doc(getFirestore(), 'Purchase_History', userId), {
          history: arrayUnion({
            id: Math.random().toString(36).substring(2, 31),
            items: this.itemsInCart$.value,
            totalCost: this.totalItemCost$.value,
            totalAmount: totalAmount,
            date: new Date(),
          }),
        });
      } else if (!firestoreExist) {
        mergeVariable = false;
        setDoc(doc(getFirestore(), 'Purchase_History', userId), {
          history: arrayUnion({
            id: Math.random().toString(36).substring(2, 31),
            items: this.itemsInCart$.value,
            totalCost: this.totalItemCost$.value,
            totalAmount: totalAmount,
            date: new Date(),
          }),
        });
      } else {
        console.log('Error: Something went wrong');
      }
    }
    // Send the user to the order confirmation page
    window.localStorage.setItem('payment', 'true');
    this.router.navigate(['/order-confirmation']);
  }
}
