import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  providers:[AuthService]
})
export class SidenavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    public user$: Observable<any> = this.authSvc.afAuth.user;
    

  constructor(private breakpointObserver: BreakpointObserver, private authSvc: AuthService,
    private router: Router,) { }

    public isLogged: boolean= false;

  async onLogout(){
    try{
      await this.authSvc.logout();
      this.router.navigate(['/login']);
    }
    catch(error){console.log(error)}
  
  
  }

  onCheckUser():void {
    if (this.authSvc.getCurrentUser()==null) {
      this.isLogged=false;
    } else {
      this.isLogged=true;
    }
  }

}
