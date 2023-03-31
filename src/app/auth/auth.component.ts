import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private auth: AuthService,
    private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.http.post('http://localhost:8080/auth/login', this.loginForm.value).subscribe((response: any) => {
      console.log('Login successful:', response);
      this.auth.setToken(response.token);
      this.router.navigate(['/store']);
      console.log(this.auth.getToken());
    }, error => {
      console.error('Registration failed:', error);
      this._snackBar.open('Login Failed', 'Okay');
    });

  }
}
