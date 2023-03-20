import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { PrivacyPageComponent } from './bottom-bar/privacy-page/privacy-page.component';
import { ProductsPageComponent } from './products-page/products-page.component';
import { SingleProductComponent } from './singleproduct/singleproduct.component';
import { ContactComponent } from './bottom-bar/contact/contact.component';
import { AboutComponent } from './bottom-bar/about/about.component';
import { RegisterComponent } from './user-handling/register/register.component';
import { LoginComponent } from './user-handling/login/login.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';

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
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent,
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
