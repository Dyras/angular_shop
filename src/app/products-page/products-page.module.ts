import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductsPageComponent } from './products-page.component';

@NgModule({
  imports: [CommonModule],
  exports: [ProductsPageComponent],
  declarations: [ProductsPageComponent],
})
export class ProductsPageModule {}
