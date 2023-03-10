import { Component, Input } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart-service/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  badgeNumber: number | undefined;
  isUserLoggedIn: boolean | null = null;

  constructor(private cartService: CartService) {}

  async ngOnInit(): Promise<void> {
    this.cartService.currentCart$.subscribe((value) => {
      this.badgeNumber = value;
    });

    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.isUserLoggedIn = true;
        this.cartService.currentCart$.next(
          await this.cartService.getCartLength(user)
        );
      } else {
        this.isUserLoggedIn = false;
        this.cartService.currentCart$.next(
          await this.cartService.getCartLength(null)
        );
      }
    });
  }

  logOut() {
    const auth = getAuth();
    auth.signOut().then(() => {
      console.log('User logged out');
      this.isUserLoggedIn = false;
    });
  }
}
