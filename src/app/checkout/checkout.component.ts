import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  itemsInCart$: BehaviorSubject<IProduct[] | null> = new BehaviorSubject<
    IProduct[] | null
  >(null);
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (localStorage.getItem('cart') !== null) {
      this.itemsInCart$.next(JSON.parse(localStorage.getItem('cart') || '[]'));
      console.log(this.itemsInCart$);
      console.log(localStorage.getItem('cart'));
    }
  }
}
