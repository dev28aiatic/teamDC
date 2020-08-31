import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[AuthService],
})
export class LoginComponent implements OnInit {

 

  loginForm= new FormGroup({
    
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required])
    
  })

  constructor(private authSvc:AuthService, private router: Router) { }

  ngOnInit(): void {}

  async onLogin(){
    const { email,password } = this.loginForm.value;
    try{      
     const user= await this.authSvc.login(email,password);
     console.log(email,password);
     if (user) {
       //redirect to homePage
       this.router.navigate(['/home'])
     }

    }catch(error){console.log(error)};
    

    }
    
    get email(){ return this.loginForm.get('email');}
    
  }