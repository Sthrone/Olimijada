import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort} from '@angular/material';
import { UserInfoService } from '../../Servisi/user-info.service';
import { NavbarService } from '../../Servisi/navbar.service';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { PrijavaKorisnikaComponent } from '../prijava-korisnika/prijava-korisnika.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit 
{
  text: any;

  prijavaKorisnika: MatDialogRef<PrijavaKorisnikaComponent>;

  mozeLiKliknuti: string = "";

  constructor
  (
    public nav: NavbarService,
    public userInfo: UserInfoService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private router:Router,
    private toastr: ToastrService,
    private dialog: MatDialog
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

  }

  otvoriPrijavu()
  {
    this.prijavaKorisnika = this.dialog.open(PrijavaKorisnikaComponent, {});
    this.mozeLiKliknuti = "onemoguci";
    this.prijavaKorisnika.afterClosed().subscribe(result => 
    {
      if(result === true)
      {
        this.mozeLiKliknuti = "";
      }
      else
      {
        this.mozeLiKliknuti = "";
      } 
    });
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

}
