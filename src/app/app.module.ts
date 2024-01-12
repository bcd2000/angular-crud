import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './home/nav/nav.component';
import { TodoListComponent } from './home/todo-list/todo-list.component';
import { InfomationComponent } from './home/infomation/infomation.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    HomeComponent,
    NavComponent,
    TodoListComponent,
    InfomationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
