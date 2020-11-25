import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import { UserInfoService } from '../../Servisi/user-info.service';
import { AuthService } from '../../Servisi/auth.service';
import { NavbarService } from '../../Servisi/navbar.service';
import { IgreInfoService } from '../../Servisi/igre-info.service';

import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent implements OnInit 
{
  text:any;
  isAdmin: boolean;
  server: string;
  slika: string;

  constructor
  (
    public nav: NavbarService,
    public userInfo: UserInfoService,
    public igreInfo: IgreInfoService,
    public authService: AuthService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private router: Router
  ) 
  {
    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        this.selectedLanguage = val == null ? 'en' : val;
        this.SetLanguageNames();
      }
    );

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
    );}

  ngOnInit() 
  {
    this.server = environment.apiUrl;
  }

  ngDoCheck()
  {
    let user = localStorage['user'];
    if (user != null)
    {
      this.slika = JSON.parse(user).avatar;
    }

    if ((user) && (JSON.parse(user).id_tipa_korisnika == 1))
      this.isAdmin = true;
    else
      this.isAdmin = false;
  }

  IzvrsiOdjavu(): void
  {
    this.nav.AfterLogOut();    
    this.userInfo.OdjaviKorisnika();
  }
  
  /*     JEZICI     */
  selectedLanguage: string;
  en: string;
  srb: string;

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

  //--- --- --- --- --- --- --- --- --- --- --- --- 

  PosaljiNaIgre()
  {
    // Treba da pokupim id igre koja je prva po alfabetnom poretku.
    this.igreInfo.PrvaIgraAlfabeta().subscribe((x) => 
    {
      this.router.navigate(['/index/igra/' + x.id_igre + '/detalji']);
    });
  }

}
