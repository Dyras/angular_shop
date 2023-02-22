import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart-service/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  badgeNumber: number | undefined;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.currentCart$.subscribe((value) => {
      this.badgeNumber = value;
    });
    this.cartService.currentCart$.next(this.cartService.getCartLength());
  }
}
