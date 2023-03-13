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
    this.howManyInCartCheck(null);
  }

  addToCart(amount: number) {
    if (this.product$.value !== null) {
      this.productSaveService.updateCart(this.product$.value, amount);
    }
    console.log(this.product$.value);
    this.howManyInCart = amount;
  }
  async howManyInCartCheck(amount: number | null) {
    if (amount !== null) {
      this.howManyInCart = amount;
    } else {
      const product = new URL(window.location.href).pathname.split('/')[2];
      const auth = getAuth();
      const tempUser = localStorage.getItem('id') || '';
      let fetchedCartData: IProductSaved[] = [];

      if (auth.currentUser != null) {
        const currentUser = auth.currentUser.uid;
        const fetchedCart = await this.fetchCart(currentUser, 'Users');
        if (fetchedCart != null) {
          for (let i = 0; i < fetchedCart.length; i++) {
            if (fetchedCart[i].id === product) {
              this.howManyInCart = fetchedCart[i].amount;
            }
          }
        }
      } else {
        const currentUser = tempUser;
        const fetchedCart = await this.fetchCart(currentUser, 'Temp_Users');

        for (let i = 0; i < fetchedCart.length; i++) {
          if (fetchedCart[i].id === product) {
            this.howManyInCart = fetchedCart[i].amount;
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.howManyInCartCheck(null);
  }

  updateItem(id: IProduct, amount: number) {
    console.log('Data: ', id, amount);
    this.productSaveService.updateCart(id, amount);
    setTimeout(() => {
      this.howManyInCartCheck(null);
    }, 200);
  }

  async fetchCart(userId: string, userType: string): Promise<IProductSaved[]> {
    const firestore = getFirestore();
    const fetchedCart = await getDoc(doc(firestore, userType, userId));

    if (fetchedCart.exists()) {
      return fetchedCart.data()['cart'];
    } else {
      return [];
    }
  }
}
