import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProductSaved } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  currentCartValue = 0;
  currentCart$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor() {}
  getCartLength() {
    let currentArray = JSON.parse(window.localStorage.getItem('cart') || '[]');

    let currentCartValue = 0;
    for (let i = 0; i < currentArray.length; i++) {
      currentCartValue += currentArray[i].amount;
    }
    return currentCartValue;
  }
}
