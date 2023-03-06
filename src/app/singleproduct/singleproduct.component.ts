import { Component, OnInit } from '@angular/core';
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
      this.productSaveService.updateCart(this.product$.value, amount);
    }

    this.howManyInCartCheck();
  }
  howManyInCartCheck() {
    const product = new URL(window.location.href).pathname.split('/')[2];
    this.howManyInCart = this.productSaveService.localStorageChecker(product);
    this.cartService.currentCart$.next(this.cartService.getCartLength());
  }

  ngOnInit(): void {
    this.howManyInCartCheck();
  }

  updateItem(id: IProduct, amount: number) {
    this.productSaveService.updateCart(id, amount);
    this.howManyInCartCheck();
    this.cartService.currentCart$.next(this.cartService.getCartLength());
  }
}
