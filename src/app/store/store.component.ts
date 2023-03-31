import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateItemComponent } from '../create-item/create-item.component';
import { Item } from './item';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})

export class StoreComponent implements OnInit {
  items: Array<Item> = []
  loggedIn: {loggedIn: boolean};
  constructor (
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog) {}

  ngOnInit() {
    // for (let i = 0; i < 7; i++)
    //   this.items.push( {
    //     _id: '1',
    //     title: 'Test',
    //     imageUrl: 'https://www.yorku.ca/foodservices/wp-content/uploads/sites/50/2022/08/Untitled-design3.png',
    //     content: 'This is a photo about food',
    //     price: '20.99',
    //     creator: ''
    //   })

    this.http.get('http://localhost:8080/feed/items', { headers: {
      Authorization: 'Bearer ' + this.auth.getToken()
    }}).subscribe((response: any) => {
      console.log(response);
      console.log(response.items);
      response.items.forEach((item:Item) => {
        console.log(item.imageUrl);
        this.items.push(item);
      });
  }, error => {
    console.error('failed:', error);
  });
    this.loggedIn = this.auth.getLoggedIn();
    if (!this.loggedIn.loggedIn){
      this.router.navigate(['/login'])
    }
  }

  logout() {
    this.auth.setToken('');
    this.router.navigate(['/login'])
  }

  openDialog(item: Item = {
    _id: '',
    title: '',
    price: '',
    content: '',
    imageUrl: '',
    creator: ''}) {

    const dialogRef = this.dialog.open(CreateItemComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
