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
    this.howManyInCartCheck();
  }

  addToCart(amount: number) {
    if (this.product$.value !== null) {
      this.productSaveService.updateCart(this.product$.value, amount);
    }
    console.log(this.product$.value);
    setTimeout(() => {
      this.howManyInCartCheck();
    }, 200);
  }
  async howManyInCartCheck() {
    const product = new URL(window.location.href).pathname.split('/')[2];
    const firestore = getFirestore();
    const auth = getAuth();
    let fetchedCartData: IProductSaved[] = [];
    console.log('Testing');
    console.log(auth.currentUser);
    if (auth.currentUser != null) {
      console.log('Testing 1');
      const fetchedCart = await getDoc(
        doc(firestore, 'Users', auth.currentUser?.uid)
      );
      console.log('Does the cart exist?', fetchedCart.exists());
      if (fetchedCart.exists()) {
        console.log('Testing 2');
        fetchedCartData = fetchedCart.data()['cart'] || [];
      }

      for (let i = 0; i < fetchedCartData.length; i++) {
        console.log('Product id:', fetchedCartData[i].id);
        if (fetchedCartData[i].id === product) {
          this.howManyInCart = fetchedCartData[i].amount;
          console.log('How many in cart:', this.howManyInCart);
          console.log('How many in firestore:', fetchedCartData[i].amount);
          console.log('Testing 3');

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
    } else {
      const tempUser = localStorage.getItem('id');
      const fetchedCart = await getDoc(
        doc(firestore, 'Temp_Users', tempUser || '0')
      );
    }
  }

  ngOnInit(): void {
    this.howManyInCartCheck();
  }

  updateItem(id: IProduct, amount: number) {
    console.log('Data: ', id, amount);
    this.productSaveService.updateCart(id, amount);
    setTimeout(() => {
      this.howManyInCartCheck();
    }, 200);
  }
}
