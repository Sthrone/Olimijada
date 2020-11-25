import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

import { UserInfoService } from '../../../Servisi/user-info.service';
import { NavbarService } from '../../../Servisi/navbar.service';
import { IgreInfoService } from '../../../Servisi/igre-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit 
{
  text: any;
  server: string;
  slika: string;

  constructor
  (
    public igreInfo: IgreInfoService,
    public userInfo: UserInfoService,
    public nav: NavbarService,
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
    );
  }

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
  }

  IzvrsiOdjavu(): void
  {
    this.nav.AdminLogOut();
    this.userInfo.OdjaviKorisnika();
  }
  
  OtvoriTab(): void
  {
    window.open('/index/home');
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
      this.router.navigate(['/admin/igra/' + x.id_igre + '/detalji']);
    });
  }
 
}
