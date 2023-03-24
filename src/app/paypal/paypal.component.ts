import { Component } from '@angular/core';
import { render } from 'creditcardpayments/creditCardPayments';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart-service/cart.service';
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
})
export class PaypalComponent {
  value: string = '0';
  purchaseValue: BehaviorSubject<string> = new BehaviorSubject<string>('0');

  constructor(private cartService: CartService) {
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

  renderPayPalButton() {
    setTimeout(() => {
      try {
        const buttonContainer = document.querySelector('#PayPal');
        while (buttonContainer?.firstChild) {
          buttonContainer.removeChild(buttonContainer.firstChild);
        }
        render({
          id: '#PayPal',
          currency: 'EUR',
          value: this.value,
          onApprove: (details) => {
            alert(
              'Transaction completed by ' + details.payer.name.given_name + '!'
            );
          },
        });
      } catch (e) {
        console.log(e);
      }
    });
  }
}
