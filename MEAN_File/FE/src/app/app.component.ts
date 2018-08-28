import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular 4';
  public signUp: FormGroup;
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
  }
  ngOnInit() {
	this.getUser();
    this.signUp = this.formBuilder.group({
        firstname: new FormControl("",[Validators.required, Validators.pattern('^[a-zA-Z ]{2,30}$')]),
        lastname: new FormControl("",[Validators.required, Validators.pattern('^[a-zA-Z ]{2,30}$')]),
        email: new FormControl("",[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
    });
	
  }

  saveUser(value) {
	if(this.signUp.valid){
		var body = "firstname=" + value.firstname + "&lastname=" + value.lastname + "&email=" + value.email;
		this.http.get("http://localhost:3000/users?"+body).subscribe((response: any) => {
			if(response.code===200){
				alert("Successfully Added");
			} else if(response.code===201){
				alert("Email Id already exist");
			} else{
				alert("Something went wrong. Please try again");
			}
		});
	}else{
		alert("Please enter valid input");
	}
  }
  
  UserDetails:any = [];
  getUser() {
	this.http.get("http://localhost:3000/").subscribe((response:any) => {
		if(response.code===200){
			this.UserDetails = response.data;
		} else if(response.code===201){
			alert("No record found");
		} else{
			alert("Something went wrong. Please try again");
		}
		
	}, error => {});
  }
}
