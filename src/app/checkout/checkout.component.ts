import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { BehaviorSubject, merge } from 'rxjs';
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
    private productSaveService: ProductSaveService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.cartService.currentCartContents$.subscribe((data) => {
      if (data.length !== 0) {
        this.itemsInCart$.next(data);
      }
      this.updateTotalCost();
    });
    console.log(Math.random().toString(36).substring(2, 31));
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

  async pay() {
    console.log('Pay');
    const userId = getAuth().currentUser?.uid || '';
    let mergeVariable = false;
    const userType = 'Users';

    const doesFirestoreEntryExist = async () => {
      const docRef = doc(getFirestore(), userType, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    };

    // Check if the user has something in the cart, just to be sure
    if (this.totalItemCost$.value !== 0) {
      // Check if the user has a purchase history in Firestore
      const firestoreExist = await doesFirestoreEntryExist();
      if (firestoreExist) {
        mergeVariable = true;
      } else if (!firestoreExist) {
        mergeVariable = false;
      } else {
        console.log('Error: Something went wrong');
      }
      // Add the purchase to the user's purchase history
      // If the user doesn't have a purchase history, create one
      setDoc(doc(getFirestore(), 'Purchase_History', userId), {}),
        {
          id: Math.random().toString(36).substring(2, 31),
          items: this.itemsInCart$.value,
          totalCost: this.totalItemCost$.value,
          date: new Date(),
        },
        { merge: mergeVariable };
    }
    // Send the user to the order confirmation page
    this.router.navigate(['/order-confirmation']);
  }
}
