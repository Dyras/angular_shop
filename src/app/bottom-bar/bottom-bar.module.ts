import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BottomBarComponent } from './bottom-bar.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [BottomBarComponent],
  declarations: [BottomBarComponent],
  providers: [],
})
export class BottomBarModule {}
