import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct, IProductSaved } from '../products/product';

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
  constructor() {}

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
    }
  }
}
