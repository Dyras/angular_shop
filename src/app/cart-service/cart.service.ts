import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, DocumentData, getDoc, getFirestore } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  currentCartValue = 0;
  currentCart$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor() {}

  async getCartLength(user: User | null) {
    const firestore = getFirestore();
    let currentArray: DocumentData = [];
    this.currentCartValue = 0;

    if (user != null) {
      const fetchedProducts = await getDoc(doc(firestore, 'Users', user.uid));
      if (fetchedProducts.exists()) {
        currentArray = fetchedProducts.data();
        const finalArray = currentArray['cart'] as IProductSaved[];

        for (let i = 0; i < finalArray.length; i++) {
          this.currentCartValue += finalArray[i].amount;
        }
      }
      return this.currentCartValue;
    } else {
      const fetchedProducts = await getDoc(
        doc(firestore, 'Temp_Users', localStorage.getItem('id') || '')
      );

      currentArray = fetchedProducts.data() || [];
      const finalArray = currentArray['cart'] as IProductSaved[];
      for (let i = 0; i < finalArray.length; i++) {
        this.currentCartValue += finalArray[i].amount;
      }
      return this.currentCartValue;
    }
  }
}
