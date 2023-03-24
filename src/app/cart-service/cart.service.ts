import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartLoaded = false;
  cartLoadedUser = false;
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
  currentCartContents$ = new BehaviorSubject<IProductSaved[]>([]);
  constructor() {
    this.currentCartContents$.subscribe((value) => {
      let total = 0;
      for (let i = 0; i < value.length; i++) {
        total += value[i].amount;
      }
      const auth = getAuth();
      let userId = '';
      let userType = '';
      if (auth.currentUser) {
        userType = 'Users';
        userId = auth.currentUser.uid;
      } else {
        userType = 'Temp_Users';
        userId = localStorage.getItem('id') || '';
      }
      if (this.cartLoaded === false && userType === 'Temp_Users') {
        console.log('Test 0');
        this.firstLoadCart(userId, userType);
        this.cartLoaded = true;
        this.cartLoadedUser = false;
      } else if (this.cartLoadedUser === false && userType === 'Users') {
        this.firstLoadCart(userId, userType);
        this.cartLoadedUser = true;
        this.cartLoaded = false;
      }
    });
  }

  async setCartLength(product: IProductSaved | null) {
    const auth = getAuth();
    let user = auth.currentUser?.uid || null;
    let userType = 'Users';
    if (!auth.currentUser) {
      user = localStorage.getItem('id') || null;
      userType = 'Temp_Users';
    }
    let presentInCart = false;
    for (let i = 0; i < this.currentCartContents$.value.length; i++) {
      if (this.currentCartContents$.value[i].id === product?.id) {
        presentInCart = true;
      }
    }
    try {
      if (this.currentCartContents$.value[0].id === '0') {
        this.currentCartContents$.value.splice(0, 1);
      }
    } catch {}

    console.log('Current cart contents:', this.currentCartContents$.value);

    if (product !== null && product?.amount === -1) {
      this.removeItem(product as IProductSaved);
    } else if (product !== null && product?.amount === -2) {
      this.removeItem(product as IProductSaved);
    } else if (product !== null && product?.amount === 1) {
      this.addItem(product as IProductSaved);
    } else if (product !== null && product?.amount > 1) {
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

  cartLengthCounter(currentCart: IProductSaved[]) {
    let newValue = 0;
    console.log('Counting cart length:', currentCart);
    for (let i = 0; i < currentCart.length; i++) {
      newValue += currentCart[i].amount;
    }

    console.log('New value:', newValue);
    return newValue;
  }
  // Remove item from cart
  removeItem(product: IProductSaved) {
    let newValue = 0;
    console.log('remove');
    for (let i = 0; i < this.currentCartContents$.value.length; i++) {
      if (this.currentCartContents$.value[i].id === product.id) {
        this.currentCartContents$.value.splice(i, 1);
        console.log('Nuvarande värde:', this.currentCartContents$.value);
        console.log('Värdet som skickas in', newValue);
        newValue = this.cartLengthCounter(this.currentCartContents$.value);
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

  // Load the cart
  async firstLoadCart(user: string | null, userType: string) {
    const tempUser = localStorage.getItem('id') || null;
    console.log('first time, temp', tempUser, userType);
    console.log('first time, user', user, userType);
    let newValue = 0;
    let currentArray: IProductSaved[] = [];
    const auth = getAuth();
    const userAuth = auth.currentUser;
    console.log(userAuth);
    let fetchedArray = (
      await getDoc(doc(getFirestore(), userType, user || ''))
    ).data();
    if (fetchedArray) {
      currentArray = fetchedArray?.['cart'] as IProductSaved[];
    }

    if (userAuth?.uid === user) {
      if (this.currentCartContents$.value.length > 0) {
        console.log('Moving temp cart to user cart');
        console.log('Test 1');

        setDoc(doc(getFirestore(), 'Users', user || ''), {
          cart: this.currentCartContents$.value,
        });
        newValue = this.cartLengthCounter(this.currentCartContents$.value);
      } else {
        getDoc(doc(getFirestore(), 'Users', user || '')).then((doc) => {
          if (doc.exists()) {
            console.log('Test 2');
            this.currentCartContents$.next(
              doc.data()?.['cart'] as IProductSaved[]
            );
            this.currentCartTotalAmount$.next(
              this.cartLengthCounter(this.currentCartContents$.value)
            );
          } else {
          }
        });
      }
    } else {
      getDoc(doc(getFirestore(), 'Temp_Users', tempUser || '')).then((doc) => {
        if (doc.exists()) {
          console.log('Test 5');
          this.currentCartContents$.next(
            doc.data()?.['cart'] as IProductSaved[]
          );
          this.currentCartTotalAmount$.next(
            this.cartLengthCounter(this.currentCartContents$.value)
          );
        }
      });
    }

    if (this.currentCartContents$.value) {
      console.log(this.currentCartContents$.value);
      this.currentCartContents$.next(currentArray);
      if (this.currentCartContents$.value.length > 0) {
        newValue = this.cartLengthCounter(this.currentCartContents$.value);
      }
    }
  }

  // Add item to cart
  addItem(product: IProductSaved) {
    let newValue = 0;
    console.log('add');
    console.log('product', product);
    let matchFound = -1;

    for (let i = 0; i < this.currentCartContents$.value.length; i++) {
      if (this.currentCartContents$.value[i].id === product.id) {
        matchFound = i;
      }
    }
    if (matchFound === -1) {
      this.currentCartContents$.value.push(product);
    } else {
      this.currentCartContents$.value[matchFound].amount = 1;
    }
    console.log('New Value:', newValue);

    newValue = this.cartLengthCounter(this.currentCartContents$.value);
    this.currentCartTotalAmount$.next(newValue);
  }

  // Update item in cart
  async updateCart(product: IProductSaved | null) {
    let newValue = 0;
    console.log('update');
    let currentCart = this.currentCartContents$.value;
    currentCart = this.idSearcher(currentCart, product as IProductSaved);

    this.currentCartContents$.next(currentCart);
    newValue = this.cartLengthCounter(this.currentCartContents$.value);
    this.currentCartTotalAmount$.next(newValue);
  }

  // Empty cart in the database
  async emptyCart() {
    const userId = getAuth().currentUser?.uid;

    const userType = 'Users';
    window.localStorage.removeItem('payment');
    if (userId !== undefined) {
      await setDoc(doc(getFirestore(), userType, userId), {
        cart: [],
      });
      this.currentCartContents$.next([]);
      this.currentCartTotalAmount$.next(0);
    }
  }
}
