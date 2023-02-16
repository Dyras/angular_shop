import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductSaveService } from '../product-save/product-save.service';
import { IProduct } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.component.html',
  styleUrls: ['./singleproduct.component.scss'],
})
export class SingleProductComponent implements OnInit {
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
    publishedAt: new Date(),
  };

  product$: BehaviorSubject<IProduct | null> =
    new BehaviorSubject<IProduct | null>(this.defaultObject);

  constructor(
    private productService: ProductService,
    private productSaveService: ProductSaveService
  ) {
    this.fetchProducts();
  }

  async fetchProducts() {
    this.product$.next(
      await this.productService.getSingleProduct(
        new URL(window.location.href).pathname.split('/')[2]
      )
    );
  }

  addToCart(amount: number) {
    console.log(this.product$.value);
    if (this.product$.value !== null) {
      this.productSaveService.addToCart(this.product$.value, amount);
    }
    this.howManyInCartCheck();
  }
  howManyInCartCheck() {
    const product = new URL(window.location.href).pathname.split('/')[2];
    this.howManyInCart = this.productSaveService.localStorageChecker(product);
  }

  ngOnInit(): void {
    this.howManyInCartCheck();
  }
}
