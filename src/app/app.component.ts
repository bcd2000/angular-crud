import { Component, OnInit } from '@angular/core';
import { redirectToNativeBrowser } from './utils/in-app-browser-redirect.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-crud';

  ngOnInit(): void {
    redirectToNativeBrowser();
  }
}
