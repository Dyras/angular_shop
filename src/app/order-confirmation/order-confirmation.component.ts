import { Component } from '@angular/core';
import { CartService } from '../cart-service/cart.service';

@Component({
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent {
  properReferer = false;
  // Prints out the current referer

  constructor(cartService: CartService) {
    console.log(document.referrer);

    // Checks the referer
    if (document.referrer.includes('checkout')) {
      // If the referer is checkout, the order is confirmed
      console.log('Order confirmed!');
      this.properReferer = true;
      cartService.emptyCart();
    } else {
      // If the referer is not checkout, the order is not confirmed
      console.log('Order not confirmed!');
    }
  }
}
