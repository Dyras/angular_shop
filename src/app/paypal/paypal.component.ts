import { Component } from '@angular/core';
import { render } from 'creditcardpayments/creditCardPayments';
import { getAuth } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart-service/cart.service';
import { PayService } from '../pay-service/pay-service';
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
})
export class PaypalComponent {
  value: string = '0';
  purchaseValue: BehaviorSubject<string> = new BehaviorSubject<string>('0');

  constructor(
    private cartService: CartService,
    private payService: PayService
  ) {
    this.cartService.currentCartContents$.subscribe((data) => {
      let total = 0;
      for (let i = 0; i < data.length; i++) {
        total += data[i].amount * data[i].price;
        console.log(total);
      }
      this.value = total.toString();
      this.renderPayPalButton();
    });
    console.log('PaypalComponent constructor');
  }

  // For some reason, it asks you to pay in dollars if you don't log in. Unclear how to fix.
  renderPayPalButton() {
    setTimeout(() => {
      try {
        const buttonContainer = document.querySelector('#PayPal');
        while (buttonContainer?.firstChild) {
          buttonContainer.removeChild(buttonContainer.firstChild);
        }
        if (getAuth().currentUser)
          render({
            id: '#PayPal',
            currency: 'SEK',
            value: this.value,
            onApprove: (details) => {
              this.payService.pay();
              this.cartService.currentCartContents$.unsubscribe();
            },
          });
      } catch (e) {
        console.log(e);
      }
    });
  }
}
