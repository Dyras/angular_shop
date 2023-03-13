import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { IProduct, IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class ProductSaveService {
  constructor() {}

  //
  async updateCart(product: IProduct, amount: number) {
    const firestore = getFirestore();
    const auth = getAuth();
    let matchFound = false;
    const tempUser = localStorage.getItem('id') || '';

    if (product.id !== '0') {
      if (auth.currentUser != null) {
        const firestoreCart = await getDoc(
          doc(firestore, 'Users', auth.currentUser.uid)
        );
        if (firestoreCart.exists()) {
          const firestoreCartData = firestoreCart.data()['cart'] || [];

          for (let i = 0; i < firestoreCartData.length; i++) {
            if (firestoreCartData[i].id === product.id) {
              firestoreCartData[i].amount = amount;
              setDoc(doc(firestore, 'Users', auth.currentUser.uid), {
                cart: firestoreCartData,
              });
              matchFound = true;
            }
          }
          if (!matchFound) {
            firestoreCartData.push({ ...product, amount: amount });
            setDoc(doc(firestore, 'Users', auth.currentUser.uid), {
              cart: firestoreCartData,
            });
          }
        }
      } else {
        const firestoreCart = await getDoc(
          doc(firestore, 'Temp_Users', tempUser || '')
        );
        if (firestoreCart.exists()) {
          const firestoreCartData = firestoreCart.data()['cart'];
          for (let i = 0; i < firestoreCartData.length; i++) {
            if (firestoreCartData[i].id === product.id) {
              firestoreCartData[i].amount = amount;
              setDoc(doc(firestore, 'Temp_Users', tempUser), {
                cart: firestoreCartData,
              });
              matchFound = true;
            }
          }
          if (!matchFound) {
            firestoreCartData.push({ ...product, amount: amount });
            setDoc(doc(firestore, 'Temp_Users', tempUser), {
              cart: firestoreCartData,
            });
          }
        }
      }
    }
  }

  localStorageChecker(id: string): number {
    const storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
    for (let i = 0; i < storageArray.length; i++) {
      if (storageArray[i].id === id) {
        return storageArray[i].amount;
      }
    }
    return 0;
  }
}
