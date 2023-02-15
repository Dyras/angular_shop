import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
})
export class ProductsPageComponent {
  products$: BehaviorSubject<IProduct[]> = new BehaviorSubject<IProduct[]>([]);

  constructor(private productService: ProductService) {
    this.fetchProducts();
  }

  async fetchProducts() {
    this.products$.next(await this.productService.getProducts());
  }
}
