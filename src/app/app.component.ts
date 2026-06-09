import { Component, OnInit } from '@angular/core';
import { isAndroid, isInAppBrowser, showInAppBrowserPopup } from './utils/in-app-browser-redirect.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-crud';

  ngOnInit(): void {
    if (isInAppBrowser()) {
      if (isAndroid()) {
        document.documentElement.classList.add('android');
      }
      showInAppBrowserPopup();
    }
  }
}
