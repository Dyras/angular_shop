import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  currentCartValue = 0;
  currentCartTotalAmount$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  currentCartContents$ = new BehaviorSubject<IProductSaved[]>([
    {
      id: '0',
      name: '',
      manufacturer: '',
      description: '',
      articleType: '',
      price: 0,
      rating: 0,
      imageUrl: '',
      outOfStock: false,
      slug: '',
      packaging: '',
      publishedAt: new Date(),
      amount: 0,
    },
  ]);
  constructor() {
    this.currentCartContents$.subscribe((value) => {
      let total = 0;
      for (let i = 0; i < value.length; i++) {
        total += value[i].amount;
      }
      this.currentCartTotalAmount$.next(total);
    });
  }

  async setCartLength(product: IProductSaved | null) {
    const auth = getAuth();
    let user = auth.currentUser?.uid || null;
    let userType = 'Users';
    let newValue = 0;
    let currentArray: IProductSaved[] | undefined = [];
    if (!auth.currentUser) {
      user = localStorage.getItem('id') || null;
      userType = 'Temp_Users';
    }
    let presentInCart = false;

    for (let i = 0; i < this.currentCartContents$.value.length; i++) {
      if (this.currentCartContents$.value[i].id === product?.id) {
        console.log('Looking for ID');
        presentInCart = true;
      }
    }
    console.log('Present in cart:', presentInCart);
    console.log('Product:', product);
    // Remove item from cart
    if (product !== null && product.amount === -1) {
      console.log('remove');
      for (let i = 0; i < this.currentCartContents$.value.length; i++) {
        if (this.currentCartContents$.value[i].id === product.id) {
          this.currentCartContents$.value.splice(i, 1);
          for (let i = 0; i < this.currentCartContents$.value.length; i++) {
            newValue += this.currentCartContents$.value[i].amount;
          }
          this.currentCartValue = newValue;
        }
      }
    }
    // First time loading cart
    if (this.currentCartContents$.value[0].id === '0') {
      console.log('first time');
      const fetchedArray = (
        await getDoc(doc(getFirestore(), userType, user || ''))
      ).data();
      if (fetchedArray) {
        currentArray = fetchedArray['cart'] as IProductSaved[];
      }

      this.currentCartContents$.next(currentArray);
      if (this.currentCartContents$.value.length > 0) {
        for (let i = 0; i < this.currentCartContents$.value.length; i++) {
          newValue += this.currentCartContents$.value[i].amount;
        }
      }
      this.currentCartValue = newValue;
    } else if (!presentInCart) {
      console.log('add');
      if (product) {
        this.currentCartContents$.value.push(product);
      }
      for (let i = 0; i < this.currentCartContents$.value.length; i++) {
        newValue += this.currentCartContents$.value[i].amount;
      }
      console.log('New value:', newValue);
      console.log('Current value:', this.currentCartValue);
      this.currentCartTotalAmount$.next(newValue);
    }
    // Update the cart
    else if (this.currentCartContents$.value.length !== 0 && presentInCart) {
      console.log('update');
      let currentArray = this.currentCartContents$.value;
      for (let i = 0; i < currentArray.length; i++) {
        if (currentArray[i].id === product?.id) {
          console.log('Looking for ID');
          currentArray[i].amount = product.amount;
        }
      }
      for (let i = 0; i < currentArray.length; i++) {
        newValue += currentArray[i].amount;
      }
      this.currentCartContents$.next(currentArray);
      this.currentCartValue = newValue;
    }
  }
}
