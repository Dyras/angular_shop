import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart-service/cart.service';
import { IProductSaved } from '../products/product';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  zeroCheck: number = 0;
  itemsInCart$: BehaviorSubject<IProductSaved[] | null> = new BehaviorSubject<
    IProductSaved[] | null
  >(null);
  totalItemCost$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const localStorageContents = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );
    this.itemsInCart$.next(localStorageContents);

    this.updateTotalCost();
  }
  changeAmount(id: string, amount: number) {
    const storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
    if (amount > 0) {
      for (let i = 0; i < storageArray.length; i++) {
        if (storageArray[i].id === id) {
          storageArray[i].amount += amount;
          localStorage.setItem('cart', JSON.stringify(storageArray));
          this.itemsInCart$.next(storageArray);
        }
      }
    } else if (amount < 0) {
      for (let i = 0; i < storageArray.length; i++) {
        if (storageArray[i].id === id) {
          storageArray[i].amount += amount;

          localStorage.setItem('cart', JSON.stringify(storageArray));
          this.itemsInCart$.next(storageArray);
        }
      }
    }
    this.updateTotalCost();
    this.cartService.currentCart$.next(this.cartService.getCartLength());
  }

  updateTotalCost() {
    const storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
    let counter = 0;
    if (storageArray.length !== 0) {
      for (let i = 0; i < storageArray.length; i++) {
        counter += storageArray[i].amount * storageArray[i].price;
        if (i == storageArray.length - 1) {
          this.totalItemCost$.next(counter);
        }
      }
    } else {
      this.totalItemCost$.next(0);
    }
  }
  removeItem(id: string) {
    const storageArray = JSON.parse(localStorage.getItem('cart') || '[]');
    for (let i = 0; i < storageArray.length; i++) {
      if (storageArray[i].id === id) {
        storageArray.splice(i, 1);
        localStorage.setItem('cart', JSON.stringify(storageArray));
        this.itemsInCart$.next(storageArray);
      }
    }
    this.updateTotalCost();
    this.cartService.currentCart$.next(this.cartService.getCartLength());
  }
}
