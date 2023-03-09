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

  ngOnInit(): void {
    this.cartService.currentCart$.subscribe((value) => {
      this.badgeNumber = value;
    });
    this.cartService.currentCart$.next(this.cartService.getCartLength());

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
      }
    });
  }

  logOut() {
    const auth = getAuth();
    auth.signOut().then(() => {
      console.log('User is logged out');
      this.isUserLoggedIn = false;
    });
  }
}
