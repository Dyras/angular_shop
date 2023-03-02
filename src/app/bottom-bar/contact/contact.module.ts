import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ContactComponent } from './contact.component';

@NgModule({
  imports: [CommonModule, MatCardModule],
  exports: [ContactComponent],
  declarations: [ContactComponent],
  providers: [],
})
export class ContactModule {}
