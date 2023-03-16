import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SingleProductComponent } from './singleproduct.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBadgeModule,
  ],
  exports: [SingleProductComponent],
  declarations: [SingleProductComponent],
})
export class SingleProductModule {}
