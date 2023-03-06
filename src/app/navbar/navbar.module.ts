import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [CommonModule, RouterModule, MatBadgeModule, MatSelectModule],
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
})
export class NavbarModule {}
