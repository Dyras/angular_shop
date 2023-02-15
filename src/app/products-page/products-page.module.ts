import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductsPageComponent } from './products-page.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterLink } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [CommonModule, MatButtonToggleModule, RouterLink, MatGridListModule],
  exports: [ProductsPageComponent],
  declarations: [ProductsPageComponent],
})
export class ProductsPageModule {}
