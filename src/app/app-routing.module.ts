import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { PrivacyPageComponent } from './privacy-page/privacy-page.component';
import { ProductsPageComponent } from './products-page/products-page.component';
import { SingleProductComponent } from './singleproduct/singleproduct.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products',
    component: ProductsPageComponent,
  },
  {
    path: 'product/:id/:slug',
    component: SingleProductComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'privacy',
    component: PrivacyPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
