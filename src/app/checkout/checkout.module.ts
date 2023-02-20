import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CheckoutComponent } from './checkout.component';

@NgModule({
  imports: [CommonModule, AppRoutingModule],
  exports: [CheckoutComponent],
  declarations: [CheckoutComponent],
})
export class CheckoutModule {}
