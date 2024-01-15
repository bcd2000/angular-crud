import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { AuthGuradService } from './auth/auth-gurad.service';
import { InfomationComponent } from './home/infomation/infomation.component';
import { ProductListComponent } from './home/product-list/product-list.component';
import { CartComponent } from './home/cart/cart.component';
import { CreateEditProductComponent } from './home/create-edit-product/create-edit-product.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LogInComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'product-list',  pathMatch:'full' },
      {
        path: 'product-list',
        component: ProductListComponent
      },
      {
        path: 'cart',
        component: CartComponent
      },
      {
        path: 'infomation',
        component: InfomationComponent
      },
      {
        path: 'create-product',
        component: CreateEditProductComponent
      },
    ],
    canActivate: [AuthGuradService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
