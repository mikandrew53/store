import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';
  private loggedIn = {loggedIn: false};
  constructor() { }

  setToken (token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  getLoggedIn(): {loggedIn: boolean} {
    this.loggedIn.loggedIn = this.token.length > 0;
    return this.loggedIn;
  }
}
