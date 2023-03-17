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
  defaultObject: IProductSaved = {
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
  };
  currentCartContents$ = new BehaviorSubject<IProductSaved[]>([
    this.defaultObject,
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
    console.log('Current cart contents:', this.currentCartContents$.value);

    let debug: boolean = false;
    try {
      this.currentCartContents$.value[0].amount === -2;
    } catch (error) {
      debug = true;
    }

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
      this.removeItem(product as IProductSaved);
    }
    // Add item to cart
    else if (
      debug ||
      (this.currentCartContents$.value[0].id !== '0' && !presentInCart)
    ) {
      this.addItem(product as IProductSaved);
    }
    // First time loading cart
    else if (this.currentCartContents$.value[0].id === '0') {
      this.firstLoadCart(user, userType);
    }
    // Update the cart
    else if (this.currentCartContents$.value.length !== 0 && presentInCart) {
      this.updateCart(product as IProductSaved);
    }
  }

  idSearcher(currentCart: IProductSaved[], product: IProductSaved) {
    for (let i = 0; i < currentCart.length; i++) {
      if (currentCart[i].id === product?.id) {
        console.log('Looking for ID');
        currentCart[i].amount = product.amount;
        return currentCart;
      }
    }
    return currentCart;
  }

  cartLengthCounter(currentCart: IProductSaved[], newValue: number) {
    console.log('Counting cart length:', currentCart);
    for (let i = 0; i < currentCart.length; i++) {
      newValue += currentCart[i].amount;
    }
    return newValue;
  }
  removeItem(product: IProductSaved) {
    let newValue = 0;
    console.log('remove');
    for (let i = 0; i < this.currentCartContents$.value.length; i++) {
      if (this.currentCartContents$.value[i].id === product.id) {
        this.currentCartContents$.value.splice(i, 1);
        console.log('Nuvarande värde:', this.currentCartContents$.value);
        console.log('Värdet som skickas in', newValue);
        newValue = this.cartLengthCounter(
          this.currentCartContents$.value,
          newValue
        );
        console.log('New value:', newValue);
        console.log(newValue);
        this.currentCartTotalAmount$.next(newValue);
      }
      console.log('Current length', this.currentCartContents$.value);
      if (this.currentCartContents$.value.length < 1) {
        console.log('EMPTY CART!');
        this.currentCartValue = 0;
        this.currentCartTotalAmount$.next(0);
      }
    }
  }
  addItem(product: IProductSaved) {
    let newValue = 0;
    console.log('add');
    if (product) {
      this.currentCartContents$.value.push(product);
    }
    newValue = this.cartLengthCounter(
      this.currentCartContents$.value,
      newValue
    );
    console.log('New value:', newValue);
    console.log('Current value:', this.currentCartValue);
    console.log('Current cart contents:', this.currentCartContents$.value);
    this.currentCartTotalAmount$.next(newValue);
  }

  async firstLoadCart(user: string | null, userType: string) {
    console.log('first time');
    let newValue = 0;
    let currentArray: IProductSaved[] = [];
    const fetchedArray = (
      await getDoc(doc(getFirestore(), userType, user || ''))
    ).data();
    if (fetchedArray) {
      currentArray = fetchedArray['cart'] as IProductSaved[];
    }

    this.currentCartContents$.next(currentArray);
    if (this.currentCartContents$.value.length > 0) {
      newValue = this.cartLengthCounter(
        this.currentCartContents$.value,
        newValue
      );
    }
    this.currentCartValue = newValue;
  }

  async updateCart(product: IProductSaved | null) {
    let newValue = 0;
    console.log('update');
    let currentCart = this.currentCartContents$.value;
    currentCart = this.idSearcher(currentCart, product as IProductSaved);

    for (let i = 0; i < currentCart.length; i++) {
      newValue += currentCart[i].amount;
    }
    this.currentCartContents$.next(currentCart);
    this.currentCartValue = this.cartLengthCounter(currentCart, newValue);
  }
}
