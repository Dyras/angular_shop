import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../products/product';
import { ProductService } from '../products/products.service';

@Component({
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
})
export class ProductsPageComponent {
  products$: BehaviorSubject<IProduct[]> = new BehaviorSubject<IProduct[]>([]);

  constructor(
    private productService: ProductService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    let whichWine;
    this._route.queryParams.subscribe((params) => {
      if (params['type']) {
        whichWine = params['type'];
      }
    });
    console.log(whichWine);
    if (whichWine != undefined) {
      this.fetchProducts(whichWine);
    } else {
      this.fetchProducts('all');
    }
  }

  async fetchProducts(filter: string) {
    this.products$.next(await this.productService.getProductsByType(filter));
    console.log(filter);
    this._router.navigate(['/products'], {
      queryParamsHandling: 'merge',
      queryParams: { type: filter },
    });
  }
}
