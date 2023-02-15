import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.component.html',
  styleUrls: ['./singleproduct.component.scss'],
})
export class SingleProductComponent implements OnInit {
  product: IProduct | void;

  constructor(productService: ProductService) {
    this.product = productService.getSingleProduct(
      parseInt(new URL(window.location.href).pathname.split('/')[2])
    );
  }

  ngOnInit(): void {}
}
