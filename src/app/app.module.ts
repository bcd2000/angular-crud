import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './home/nav/nav.component';
import { InfomationComponent } from './home/infomation/infomation.component';
import { ProductListComponent } from './home/product-list/product-list.component';
import { CartComponent } from './home/cart/cart.component';
import { CreateEditProductComponent } from './home/create-edit-product/create-edit-product.component';
import { HttpClientModule } from '@angular/common/http';
import { StarComponent } from './home/product-list/star/star.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    HomeComponent,
    NavComponent,
    InfomationComponent,
    ProductListComponent,
    CartComponent,
    CreateEditProductComponent,
    StarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
