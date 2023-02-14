import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductsPageComponent } from './products-page.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [CommonModule, MatButtonToggleModule, RouterLink],
  exports: [ProductsPageComponent],
  declarations: [ProductsPageComponent],
})
export class ProductsPageModule {}
