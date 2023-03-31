import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss']
})
export class AuthRegisterComponent {
  registerForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const formPassword = form.get('password');
    const formConfirmPassword = form.get('confirmPassword');
    if (formPassword && formConfirmPassword) {
      const password = formPassword.value;
      const confirmPassword = formConfirmPassword.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    console.log(this.registerForm.value);
    this.http.put('http://localhost:8080/auth/signup', this.registerForm.value).subscribe(response => {
      console.log('Registration successful:', response);
      this._snackBar.open('Registration Successful', 'Okay');
      this.router.navigate(['/login']);

    }, error => {
      console.error('Registration failed:', error);
      this._snackBar.open('Registration Failed', 'Okay');
    });
  }
}




