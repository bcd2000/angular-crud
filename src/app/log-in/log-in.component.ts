import { HelperService } from './../auth/helper.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  registerForm!: FormGroup;
  submited!: boolean;
  users: {
    id: string,
    email: string,
    password: string,
    name: string}[] = [
    {
      id: '1',
      email: 'dungbc@smartosc.com',
      password: '20112000',
      name: 'Bạch Công Dũng'
    },
    {
      id: '2',
      email: 'nhunghth1@smartosc.com',
      password: '17032001',
      name: 'Hoàng Thị Hồng Nhung'
    },
    {
      id: '3',
      email: 'admin@smartosc.com',
      password: '123456',
      name: 'Admin'
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.helperService.setUserListLocalStorage(this.users)
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submited = true
    if(!this.registerForm.valid) return
    
    const { email, password } = this.registerForm.value

    const user = this.users.find(u => u.email === email && u.password === password)

    if(user) {
      this.helperService.setCurrentUserLocalStorage({ email, password })
      this.router.navigate(['home']);
    }else {
      alert('Login fail')
    }
  }
}
