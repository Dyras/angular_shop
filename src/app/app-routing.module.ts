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
import { HistoryPageComponent } from './history-page/history-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Johans webshop',
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
    title: 'Johans webshop - Kassa',
  },
  {
    path: 'privacy',
    component: PrivacyPageComponent,
    title: 'Johans webshop - Sekretess',
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Johans webshop - Kontakt',
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'Johans webshop - Om oss',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Johans webshop - Registrering',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Johans webshop - Logga in',
  },
  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent,
    title: 'Johans webshop - Orderbekräftelse',
  },
  {
    path: 'history',
    component: HistoryPageComponent,
    title: 'Johans webshop - Historik',
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
