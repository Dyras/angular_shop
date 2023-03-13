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
    const auth = getAuth();
    const productId = product.id;
    let currentUser = '';
    let productType: string = '';
    let matchFound = false;
    if (productId !== '0') {
      if (auth.currentUser?.uid !== undefined) {
        productType = 'Users';

        currentUser = auth.currentUser?.uid;
      } else {
        productType = 'Temp_Users';

        currentUser = localStorage.getItem('id') || '';
      }

      const firestoreCartData = await this.fetchCart(
        currentUser,
        productType
      ).catch((err) => {
        console.log('Error ', err);
      });

      if (firestoreCartData != null) {
        if (firestoreCartData.length !== 0) {
          for (let i = 0; i < firestoreCartData.length; i++) {
            if (firestoreCartData[i].id === product.id) {
              firestoreCartData[i].amount = amount;
              matchFound = true;
              setDoc(doc(getFirestore(), productType, currentUser), {
                cart: firestoreCartData,
              });
            }
          }
        }
      }

      if (!matchFound) {
        firestoreCartData.push({ ...product, amount: amount });
        setDoc(doc(getFirestore(), productType, currentUser), {
          cart: firestoreCartData,
        });
      }
    }
  }

  async fetchCart(productId: string, productType: string) {
    const firestore = getFirestore();
    const document =
      (await getDoc(doc(firestore, productType, productId))) || [];
    if (document.exists()) {
      return document.data()['cart'] || [];
    }
  }
}
