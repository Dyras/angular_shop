import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  imports: [CommonModule, RouterModule, MatBadgeModule],
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
})
export class NavbarModule {}
