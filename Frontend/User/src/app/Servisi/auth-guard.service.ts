import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import 
{ 
  Router, 
  CanActivate, 
  CanActivateChild, 
  ActivatedRouteSnapshot,
  RouterStateSnapshot 
} 
from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';

import { AuthService } from './auth.service';
import { NavbarService } from './navbar.service';
import { UserInfoService } from './user-info.service';

import { StorageService } from '../Servisi/storage.service';
import { MultilanguageService } from '../Servisi/multilanguage.service';


@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild
{

  text:any;

  constructor
  (
    private authService: AuthService,
    private navService: NavbarService,
    private router: Router,
    private toastr: ToastrService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private userInfo: UserInfoService,
    private location: Location
  ) 
  {
    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        this.langService.getJSON(val).subscribe
        (
          (data) =>
          {
            this.text = data;
          }
        );
      }
    );
  }

  
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean
  {
    if ((!this.authService.IsAuthenticated()) || (localStorage['user'] == null))
    {
      // Cistim ostatke ako se neko 'igrao' sa local storage-om.
      if (localStorage['user'] != null)
      {
        localStorage.removeItem('user');
        this.authService.LoginState(false);
      }

      if (this.authService.IsAuthenticated())
      {
        this.authService.DestroyToken();
        this.authService.LoginState(false);
      }

      // Saljem na pocetnu.
      this.navService.OnCreate();

      this.router.navigate(['/home']);

      let tekst = "Access denied. You must log in first!";
      if (localStorage['lang'] != null && localStorage['lang'] == 'srb')
        tekst = "Pristup odbijen. Prvo se morate ulogovati!";

      this.toastr.error(tekst);

      return false;
    } 
    
    // Korisnik je ulogovan ili se predstavio kao takav.
    // Provera identiteta.
    return this.authService.Check(localStorage['user']).map((x) => 
    {
      // Identitet je ispravan.
      if (x.success == true)  
      {
        // Da li se pristupa admin strani?
        if (this.location.path().includes('admin'))
        {
          let userType: number = JSON.parse(localStorage['user']).id_tipa_korisnika;
          if (userType != 1)  // Svako ko nije admin ne sme da pristupa admin delu.
          {
            this.router.navigate(['/index/home']);

            let tekst = "Access denied. Admin rights required!";
            if (localStorage['lang'] != null && localStorage['lang'] == 'srb')
              tekst = "Pristup odbijen. Potrebna su admin prava!";
      
            this.toastr.error(tekst);

            return false;
          }
        }
        
        return true;
      }
      // Identitet nije ispravan.
      else
      {
        this.userInfo.IzbaciKorisnika();
        this.navService.AfterLogOut(); 

        this.router.navigate(['/home']);

        let tekst = "Access denied!";
        if (localStorage['lang'] != null && localStorage['lang'] == 'srb')
          tekst = "Pristup odbijen!";

        this.toastr.error(tekst);

        return false;
      }
    });
  }


  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean 
  {
    return this.canActivate(route, state);
  }


}
