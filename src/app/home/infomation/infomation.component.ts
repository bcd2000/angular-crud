import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/auth/helper.service';

@Component({
  selector: 'app-infomation',
  templateUrl: './infomation.component.html',
  styleUrls: ['./infomation.component.css']
})
export class InfomationComponent implements OnInit {
  userName: string = ''
  constructor(private helperService: HelperService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.helperService.removeCurrentUserLocalStorage()
    this.router.navigate([''])
  }
}
