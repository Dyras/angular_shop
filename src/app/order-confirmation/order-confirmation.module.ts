import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderConfirmationComponent } from './order-confirmation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [OrderConfirmationComponent],
  exports: [OrderConfirmationComponent],
})
export class OrderConfirmationModule {}
