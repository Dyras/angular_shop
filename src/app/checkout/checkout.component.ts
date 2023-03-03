import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart-service/cart.service';
import { ProductSaveService } from '../product-save/product-save.service';
import { IProductSaved } from '../products/product';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  amountList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  zeroCheck: number = 0;
  itemsInCart$: BehaviorSubject<IProductSaved[] | null> = new BehaviorSubject<
    IProductSaved[] | null
  >(null);
  totalItemCost$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(
    private cartService: CartService,
    private productSaveService: ProductSaveService
  ) {}

  ngOnInit(): void {
    const localStorageContents = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );
    this.itemsInCart$.next(localStorageContents);

    this.updateTotalCost();
    document.title = 'Johans webbshop - Kassa';
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
  updateItem(id: IProductSaved, amount: number) {
    this.productSaveService.updateCart(id, amount);
    this.updateTotalCost();
    this.cartService.currentCart$.next(this.cartService.getCartLength());
  }
}
