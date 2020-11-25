import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Location } from '@angular/common';

import { NavbarService } from './Servisi/navbar.service';
import { StorageService } from './Servisi/storage.service';
import { MultilanguageService } from './Servisi/multilanguage.service';
import { UserInfoService } from './Servisi/user-info.service';
import { Korisnik } from './Klase/korisnik';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit
{
  public loading;
  selectedLanguage: string;
  en: string;
  srb: string;

  constructor
  (
    public nav: NavbarService,
    private storageService: StorageService,
    private langService: MultilanguageService,
    private userInfo: UserInfoService,
    private location: Location,
    private router: Router
  ) 
  {
    this.loading = false;
    
    this.storageService.loading$.subscribe((newState) =>
    {
      this.loading = newState;
    });

    /*
    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        this.selectedLanguage = val == null ? 'en' : val;
        this.SetLanguageNames();
      }
    );
    */
  }

  ngOnInit(): void 
  {
    // Proveriti da li je korisnik vec bio ulogovan.
    // Ako jeste, redirektovati ga na odgovarajucu pocetku stranu.
    let user = localStorage.getItem('user');
    let token = localStorage.getItem('jwtToken');
    if ((user != null) && (token != null))     // Vec je bio ulogovan
    {
      let ulogovaniKorisnik: Korisnik = Korisnik.FromJSON(JSON.parse(user));
      this.userInfo.PonovnaPrijava(ulogovaniKorisnik);
    }
    else if ((!this.location.path().includes('game')) && (!this.location.path().includes('test')))
      this.nav.OnCreate();

    // --- --- --- TO THE TOP --- --- --- 

    this.router.events.subscribe((evt) => 
    {
      if (!(evt instanceof NavigationEnd)) 
      {
          return;
      }
      
      window.scrollTo(0, 0)
    });
  }

  /*
  ngAfterViewInit() 
  {
    this.router.events.subscribe((event) => 
    {
      if(event instanceof NavigationStart) 
      {
        this.loading = true;
      }
      else if 
      (
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel
      ) 
      {
        setTimeout( () => { this.loading = false; }, 1000 );
      }
    });
  }
  */

/*
  onFileSelected(event)
  {
    console.log(event);
  }
*/

/*
  ChooseLanguage(chosen: string)
  {
    if (this.selectedLanguage != chosen)
    {
      this.storageService.SelectedLanguage = chosen;
      this.SetLanguageNames();
    }
  }

  SetLanguageNames()
  {
    if (this.selectedLanguage == "en")
    {
      this.en = "English";
      this.srb = "Srpski (Serbian)";
    }
    else
    {
      this.en = "English (Engleski)";
      this.srb = "Srpski";
    }
  }
*/

}
