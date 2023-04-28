import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { IProduct, IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class ProductSaveService {
  // Update the cart with the new amount of the product
  async updateCart(product: IProduct, amount: number) {
    let currentUser = this.checkUser();
    let matchFound = false;

    const firestoreCartData = await this.fetchCart(
      currentUser.type,
      currentUser.uid
    ).catch((err) => {
      console.log('Error ', err);
    });

    if (firestoreCartData != null && firestoreCartData.length !== 0) {
      for (let i = 0; i < firestoreCartData.length; i++) {
        if (firestoreCartData[i].id === product.id) {
          firestoreCartData[i].amount = amount;
          matchFound = true;
          setDoc(doc(getFirestore(), currentUser.type, currentUser.uid), {
            cart: firestoreCartData,
          }).catch((err) => {
            console.log('Error ', err);
          });
          console.log(firestoreCartData[i].amount, ' === ', amount);
        }
      }
    }

    if (!matchFound) {
      firestoreCartData.push({ ...product, amount: amount });
      setDoc(doc(getFirestore(), currentUser.type, currentUser.uid), {
        cart: firestoreCartData,
      });
    }
  }

  // Fetch the cart from Firestore
  async fetchCart(productType: string, productId: string) {
    const firestore = getFirestore();
    const document =
      (await getDoc(doc(firestore, productType, productId))) || [];
    if (document.exists()) {
      console.log('Running fetchCart');
      return document.data()['cart'] || ([] as IProductSaved[]);
    }
  }

  // Check if the user is logged in or not
  checkUser() {
    const auth = getAuth();
    let currentUser = { uid: 'test', type: 'test' };

    if (auth.currentUser?.uid !== undefined) {
      currentUser = {
        uid: auth.currentUser?.uid,
        type: 'Users',
      };
    } else {
      currentUser = {
        uid: localStorage.getItem('id') || '',
        type: 'Temp_Users',
      };
    }
    console.log('Current User: ', currentUser);
    return currentUser;
  }

  // Remove a product from the cart
  async removeFromCart(product: IProduct | null) {
    if (product != null) {
      let currentUser = this.checkUser();
      let firestoreCartData = await this.fetchCart(
        currentUser.type,
        currentUser.uid
      );
      firestoreCartData = firestoreCartData.filter(
        (item: IProductSaved) => item.id !== product.id
      );
      setDoc(doc(getFirestore(), currentUser.type, currentUser.uid), {
        cart: firestoreCartData,
      });
    }
  }
}
