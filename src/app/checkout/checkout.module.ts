import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CheckoutComponent } from './checkout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PaypalModule } from '../paypal/paypal.module';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    PaypalModule,
  ],
  exports: [CheckoutComponent],
  declarations: [CheckoutComponent],
})
export class CheckoutModule {}
