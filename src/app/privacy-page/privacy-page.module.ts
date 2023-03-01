import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PrivacyPageComponent } from './privacy-page.component';

@NgModule({
  imports: [CommonModule, MatCardModule],
  exports: [PrivacyPageComponent],
  declarations: [PrivacyPageComponent],
})
export class PrivacyPageModule {}
