import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

  async ngOnInit(): Promise<void> {
    this.cartService.currentCartContents$.subscribe((data) => {
      if (data.length !== 0) {
        this.itemsInCart$.next(data);
      }
      this.updateTotalCost();
    });
  }
  updateTotalCost() {
    const storageArray = this.itemsInCart$.value || [];
    let counter = 0;
    if (storageArray.length !== 0) {
      for (let i = 0; i < storageArray.length; i++) {
        counter += storageArray[i].amount * storageArray[i].price;
        if (i == storageArray.length - 1) {
          this.totalItemCost$.next(counter);
          this.zeroCheck = counter;
        }
      }
    } else {
      this.totalItemCost$.next(0);
    }
  }
  async updateItem(id: IProductSaved, amount: number) {
    this.productSaveService.updateCart(id, amount);
    this.updateTotalCost();
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.cartService.setCartLength(id);
      } else {
        this.cartService.setCartLength(id);
      }
    });
  }
}
