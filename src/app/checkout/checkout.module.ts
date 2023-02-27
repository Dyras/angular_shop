import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CheckoutComponent } from './checkout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, AppRoutingModule, MatIconModule, MatButtonModule],
  exports: [CheckoutComponent],
  declarations: [CheckoutComponent],
})
export class CheckoutModule {}
