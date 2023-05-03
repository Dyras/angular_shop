import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
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

  ngOnInit(): void {
    // If this is the first page you visit, Firestore will not have loaded yet.
    // This fixes that by waiting 100ms before checking how many items are in the cart.
    setTimeout(() => {
      this.howManyInCartCheck(null);
    }, 100);
  }

  async fetchProducts() {
    this.product$.next(
      await this.productService.getSingleProduct(
        new URL(window.location.href).pathname.split('/')[2]
      )
    );
    document.title = this.product$.value?.name || 'Produktsida';
  }

  // This function is called when the user clicks the "Add to cart" button.
  async addToCart(amount: number) {
    if (this.product$.value !== null) {
      this.productSaveService.updateCart(this.product$.value, amount);
    }
    this.howManyInCart = amount;

    if (this.product$.value !== null) {
      this.cartService.setCartLength({
        ...this.product$.value,
        amount: amount,
      });
    }
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

  changeProductAmount(product: IProduct, amount: number) {
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
      return fetchedCart.data()['cart'];
    } else {
      console.log('No such document!');
      return [];
    }
  }

  updateTotal(cartData: IProductSaved[]) {
    let total = 0;
    for (let i = 0; i < cartData.length; i++) {
      total += cartData[i].amount;
    }
    this.cartService.currentCartTotalAmount$.next(total);
  }

  removeFromCart(product: IProduct) {
    this.productSaveService.removeFromCart(product);
    this.howManyInCart = 0;

    if (this.product$.value !== null)
      this.cartService.setCartLength({ ...product, amount: -1 });
  }
}
