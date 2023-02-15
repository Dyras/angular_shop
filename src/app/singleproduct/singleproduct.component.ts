import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IProduct } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.component.html',
  styleUrls: ['./singleproduct.component.scss'],
})
export class SingleProductComponent implements OnInit {
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

  constructor(private productService: ProductService) {
    this.fetchProducts();
  }

  async fetchProducts() {
    this.product$.next(
      await this.productService.getSingleProduct(
        new URL(window.location.href).pathname.split('/')[2]
      )
    );
  }

  ngOnInit(): void {}
}
