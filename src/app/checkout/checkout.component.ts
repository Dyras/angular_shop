import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
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
    const auth = getAuth();
    const firestore = getFirestore();
    let userId = '';
    let userType = '';
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
        userType = 'Users';
      } else {
        userId = localStorage.getItem('id') || '';
        userType = 'Temp_Users';
      }
      const firestoreCart = await getDoc(doc(firestore, 'Temp_Users', userId));
      if (firestoreCart) {
        setTimeout(() => {
          const firestoreCartData = firestoreCart.data();
          if (firestoreCartData) {
            this.itemsInCart$.next(
              firestoreCartData['cart'] as IProductSaved[]
            );
          }
          this.updateTotalCost();
        }, 200);
      }
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
        this.cartService.currentCart$.next(
          await this.cartService.getCartLength(user)
        );
      } else {
        this.cartService.currentCart$.next(
          await this.cartService.getCartLength(null)
        );
      }
    });
  }
}
