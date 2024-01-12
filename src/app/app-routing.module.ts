import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { AuthGuradService } from './auth/auth-gurad.service';
import { TodoListComponent } from './home/todo-list/todo-list.component';
import { InfomationComponent } from './home/infomation/infomation.component';

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
      {
        path: 'todo-list',
        component: TodoListComponent
      },
      {
        path: 'infomation',
        component: InfomationComponent
      }
    ],
    canActivate: [AuthGuradService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
