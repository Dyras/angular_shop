import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartService } from '../cart-service/cart.service';
import { ProductSaveService } from '../product-save/product-save.service';
import { IProduct, IProductSaved } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.component.html',
  styleUrls: ['./singleproduct.component.scss'],
})
export class SingleProductComponent implements OnInit {
  amountList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  howManyInCart: number = 0;
  defaultObject: IProduct = {
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
  };

  product$: BehaviorSubject<IProduct | null> =
    new BehaviorSubject<IProduct | null>(this.defaultObject);

  constructor(
    private productService: ProductService,
    private productSaveService: ProductSaveService,
    private cartService: CartService
  ) {
    this.fetchProducts();
  }

  async fetchProducts() {
    this.product$.next(
      await this.productService.getSingleProduct(
        new URL(window.location.href).pathname.split('/')[2]
      )
    );
    document.title = this.product$.value?.name || 'Produktsida';
  }

  addToCart(amount: number) {
    if (this.product$.value !== null) {
      console.log('Den här delen körs');
      this.productSaveService.updateCart(this.product$.value, amount);
    }
    console.log(this.product$.value);
    this.howManyInCart = amount;
    setTimeout(() => {
      this.fetchCart(this.productSaveService.checkUser());
    });
  }

  async howManyInCartCheck(amount: number | null) {
    this.cartService.currentCartContents$.subscribe((value) => {
      for (let i = 0; i < value?.length; i++) {
        if (value[i].id === this.product$.value?.id) {
          this.howManyInCart = value[i].amount;
        }
      }
    });
    if (amount === null) {
      amount = 0;
    }
    this.howManyInCart = amount;
    const product = new URL(window.location.href).pathname.split('/')[2];
    const auth = getAuth();

    if (auth.currentUser != null) {
      let workingName = this.cartService.currentCartContents$.value;
      if (workingName != null) {
        for (let i = 0; i < workingName.length; i++) {
          if (workingName[i].id === product) {
            this.howManyInCart = workingName[i].amount;
          }
        }
      }
    } else {
      let workingName = this.cartService.currentCartContents$.value;
      if (workingName != null) {
        for (let i = 0; i < workingName.length; i++) {
          if (workingName[i].id === product) {
            this.howManyInCart = workingName[i].amount;
          }
        }
      }
    }
  }

  ngOnInit(): void {
    // If this is the first page you visit, Firestore will not have loaded yet.
    // This fixes that by waiting 100ms before checking how many items are in the cart.
    setTimeout(() => {
      this.howManyInCartCheck(null);
    }, 100);
  }

  addNewProduct(product: IProduct, amount: number) {
    this.productSaveService.updateCart(product, amount);
    this.howManyInCart = amount;
    this.cartService.setCartLength({ ...product, amount: amount });
  }

  async fetchCart(currentUser: {
    uid: string;
    type: string;
  }): Promise<IProductSaved[]> {
    const firestore = getFirestore();
    const fetchedCart = await getDoc(
      doc(firestore, currentUser.type, currentUser.uid)
    );

    if (fetchedCart.exists()) {
      console.log('FetchedCart: ', fetchedCart.data()['cart']);
      return fetchedCart.data()['cart'];
    } else {
      console.log('No such document!');
      return [];
    }
  }

  updateTotal(cartData: IProductSaved[]) {
    console.log('Nu kör vi boys!');
    let total = 0;
    for (let i = 0; i < cartData.length; i++) {
      total += cartData[i].amount;
    }
    console.log('Total: ', total);
    this.cartService.currentCartTotalAmount$.next(total);
  }
}
