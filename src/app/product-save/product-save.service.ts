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
      switch (auth.currentUser?.uid) {
        case null:
          productType = 'Temp_Users';
          currentUser = localStorage.getItem('id') || '';
          break;

        case undefined:
          productType = 'Temp_Users';
          currentUser = localStorage.getItem('id') || '';
          break;

        default:
          productType = 'Users';
          if (auth.currentUser != null) currentUser = auth.currentUser.uid;
          break;
      }
      console.log(productType, 'productType');
      console.log(currentUser, 'currentUser');
      const firestoreCartData = await this.fetchCart(
        currentUser,
        productType
      ).catch((err) => {
        console.log('Error ', err);
      });

      console.log(firestoreCartData, 'firestoreCartData');
      if (firestoreCartData != null) {
        console.log(firestoreCartData, 'length');
        if (firestoreCartData.length !== 0) {
          for (let i = 0; i < firestoreCartData.length; i++) {
            if (firestoreCartData[i].id === product.id) {
              firestoreCartData[i].amount = amount;
              matchFound = true;
              console.log('matchFound', matchFound);
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
    console.log(productId, productType);
    const document =
      (await getDoc(doc(firestore, productType, productId))) || [];
    if (document.exists()) {
      console.log(document.data(), 'document.data()', document);
      return document.data()['cart'] || [];
    }
  }
}
