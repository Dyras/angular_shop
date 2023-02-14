import { Component } from '@angular/core';
import { IProduct } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
})
export class ProductsPageComponent {
  products: IProduct[] = [];

  constructor(private productService: ProductService) {
    this.fetchProducts();
  }

  fetchProducts() {
    this.products = this.productService.getProducts();
  }
}
