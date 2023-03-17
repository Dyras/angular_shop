import { Component } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CartService } from '../cart-service/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  badgeNumber: number = 0;
  isUserLoggedIn: boolean | null = null;

  constructor(private cartService: CartService) {}

  async ngOnInit(): Promise<void> {
    this.cartService.currentCartTotalAmount$.subscribe((value) => {
      this.badgeNumber = value;
    });

    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.isUserLoggedIn = true;
        this.cartService.setCartLength(null);
      } else {
        this.isUserLoggedIn = false;
        this.cartService.setCartLength(null);
      }
    });
  }

  logOut() {
    const auth = getAuth();
    auth.signOut().then(() => {
      console.log('User logged out');
      this.isUserLoggedIn = false;
    });
    this.cartService.currentCartTotalAmount$.next(0);
    this.cartService.currentCartContents$.next([]);
    // Send users to the product page after logout
    window.location.href = '/products';
  }
}
