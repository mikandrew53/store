import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth.service';
import { Item } from '../store/item';


@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent {
  form: FormGroup;
  fileName: string;
  file: any;
  item: Item;
  editing: boolean;
  formSubmited: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CreateItemComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Item ) {

    this.form = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, this.priceValidator]],
      content: ['', Validators.required],
      image: [null, Validators.required]
    });

    this.item = data;
    this.editing = data._id.length > 0;
    console.log(this.editing);

  }

  priceValidator(control: AbstractControl): ValidationErrors | null {
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const isValid = pricePattern.test(control.value);
    return isValid ? null : { invalidPrice: true };
  }

  onSubmit(deleteItem?: boolean) {
    console.log(this.formSubmited);

    if (deleteItem){
      this.deleteItem();
      console.log('not submitting');
      return
    }
    if ((!this.form.valid) && !this.editing){
      this.formSubmited = true;
      console.log('invalid');
      console.log('Editing: ' + this.form.valid);

      return;
    }


    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('price', this.form.get('price')?.value);
    formData.append('content', this.form.get('content')?.value);
    if (!this.editing)
      formData.append('image', this.file, this.fileName);
    else
      formData.append('image', this.item.imageUrl);

    if (!this.editing){
      console.log('post');
      this.http.post('http://localhost:8080/feed/item', formData, {
        headers: {
          Authorization: 'Bearer ' + this.auth.getToken()
        }}).subscribe((response: any) => {
          this.dialogRef.close();
          console.log('successful:', response);
          this.formSubmited = false;
      }, error => {
        console.error('failed:', error);
        this._snackBar.open('Failed to create Item', 'Okay');
        this.formSubmited = false;
      });
    }else {
      console.log('put');

      this.http.put('http://localhost:8080/feed/item/' + this.item._id, formData, {
        headers: {
          Authorization: 'Bearer ' + this.auth.getToken()
        }}).subscribe((response: any) => {
          this.dialogRef.close();
          console.log('successful:', response);
          this.formSubmited = false;
      }, error => {
        console.error('failed:', error);
        this._snackBar.open('Failed to edit item', 'Okay');
        this.formSubmited = false;
      });
    }
  }

  deleteItem() {
    console.log('DELETING');

    this.http.delete('http://localhost:8080/feed/item/' + this.item._id, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken()
      }
    }).subscribe((response: any) => {
      this.dialogRef.close();
      console.log('successful:', response);
      this.formSubmited = false;
  }, error => {
    console.error('failed:', error);
    this._snackBar.open('Failed to edit item', 'Okay');
    this.formSubmited = false;
  });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.file = file;
    this.fileName = file.name
  }
}

