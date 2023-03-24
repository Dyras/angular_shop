import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaypalComponent } from './paypal.component';

@NgModule({
  imports: [CommonModule],
  exports: [PaypalComponent],
  declarations: [PaypalComponent],
})
export class PaypalModule {}
