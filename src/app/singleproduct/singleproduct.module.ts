import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SingleProductComponent } from './singleproduct.component';

@NgModule({
  imports: [CommonModule, MatButtonToggleModule],
  exports: [SingleProductComponent],
  declarations: [SingleProductComponent],
})
export class SingleProductModule {}
