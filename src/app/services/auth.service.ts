import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import {AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user:User;

  constructor(public afAuth: AngularFireAuth) { }


  async login(email:string, password:string){
    try{
      const result = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
        );
        return result;
      }catch (error) {
      console.log(error);
    }  
  }


  
    
    
  async logout(){
    try{
      await this.afAuth.auth.signOut();
    }catch(error){
      console.log(error);
    }
  }


  getCurrentUser(){
    return this.afAuth.authState.pipe(first()).toPromise();
  }
}
