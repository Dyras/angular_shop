import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SingleProductComponent } from './singleproduct.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatCardModule],
  exports: [SingleProductComponent],
  declarations: [SingleProductComponent],
})
export class SingleProductModule {}
