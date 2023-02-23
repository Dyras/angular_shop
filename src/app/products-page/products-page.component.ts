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
  lastChosenFilter: string | null = null;
  constructor(
    private productService: ProductService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    let whichWine;
    this._route.queryParams.subscribe((params) => {
      if (params['type']) {
        whichWine = params['type'];
        this.fetchProducts(whichWine);
      } else {
        whichWine = 'all';
        this._router.navigate(['/products'], {
          queryParamsHandling: 'merge',
          queryParams: { type: 'all' },
        });
      }
    });
  }

  async fetchProducts(filter: string) {
    if (filter != this.lastChosenFilter) {
      this._router.navigate(['/products'], {
        queryParamsHandling: 'merge',
        queryParams: { type: filter },
      });
      this.lastChosenFilter = filter;
      this.products$.next(await this.productService.getProductsByType(filter));
    }
  }
}
