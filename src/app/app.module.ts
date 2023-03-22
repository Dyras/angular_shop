import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ProductsPageModule } from './products-page/products-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { SingleProductModule } from './singleproduct/singleproduct.module';
import { NavbarModule } from './navbar/navbar.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PrivacyPageModule } from './bottom-bar/privacy-page/privacy-page.module';
import { BottomBarModule } from './bottom-bar/bottom-bar.module';
import { ContactModule } from './bottom-bar/contact/contact.module';
import { AboutModule } from './bottom-bar/about/about.module';
import { RegisterModule } from './user-handling/register/register.module';
import { LoginModule } from './user-handling/login/login.module';
import { OrderConfirmationModule } from './order-confirmation/order-confirmation.module';
import { HistoryPageModule } from './history-page/history-page.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ProductsPageModule,
    HomeModule,
    BrowserAnimationsModule,
    SingleProductModule,
    NavbarModule,
    CheckoutModule,
    PrivacyPageModule,
    BottomBarModule,
    ContactModule,
    AboutModule,
    RegisterModule,
    LoginModule,
    OrderConfirmationModule,
    HistoryPageModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
