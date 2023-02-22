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
    if (localStorage.getItem('cart') !== null) {
      const arrayLength = JSON.parse(localStorage.getItem('cart') || '[]');
      this.itemsInCart$.next(arrayLength);

      for (let i = 0; i < arrayLength.length; i++) {
        this.zeroCheck += parseInt(arrayLength[i].amount);
        if (this.zeroCheck !== 0) {
          break;
        }
      }
      let counter = 0;

      for (let i = 0; i < arrayLength.length; i++) {
        counter += arrayLength[i].amount * arrayLength[i].price;
        if (i == arrayLength.length - 1) {
          this.totalItemCost$.next(counter);
        }
      }
    }
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
    this.cartService.currentCart$.next(this.cartService.getCartLength());
  }
}
