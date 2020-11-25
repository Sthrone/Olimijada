import { Korisnik } from '../../Klase/korisnik';
import { Component, OnInit, Inject , ViewChild , Input , Output, EventEmitter , AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TooltipPosition } from '@angular/material/tooltip';
import {MAT_DIALOG_DATA} from '@angular/material'
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { AuthService } from '../../Servisi/auth.service';
import { UserInfoService } from '../../Servisi/user-info.service';
 
@Component({
  selector: 'app-prijava-korisnika',
  templateUrl: './prijava-korisnika.component.html',
  styleUrls: ['./prijava-korisnika.component.css']
})
export class PrijavaKorisnikaComponent implements OnInit 
{
  text : any;
  k = new Korisnik();
  identifikator: string;

  public loading = false;

  constructor
  (
    @Inject(MAT_DIALOG_DATA) public data: number,
    private userInfo: UserInfoService,
    private dialogRef: MatDialogRef<PrijavaKorisnikaComponent>,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private authService: AuthService
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

  ngOnInit() 
  {
    
  }

  //--- --- --- --- --- --- --- --- --- --- --- 
  
  IzvrsiPrijavu()
  {
    // Da li je korisnik ukucao mail ili username?
    this.ProveraEmail();
    this.userInfo.PrijaviKorisnika(this.k);

    this.authService.loggedIn.subscribe((x) =>
    { 
      if(x)
      {
        this.dialogRef.close(true);
      } 
    });
  }

  ProveraEmail()
  {
    this.k.korisnicko_ime = "";
    this.k.email = "";

    var re = /[čćđšža-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[čćđšža-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[čćđšža-z0-9](?:[čćđšža-z0-9-]*[čćđšža-z0-9])?\.)+[čćđšža-z0-9](?:[čćđšža-z0-9-]*[čćđšža-z0-9])?/;
    var odgovorRe = re.test(String(this.identifikator).toLowerCase());
    if(odgovorRe == false)    // Nije email
      this.k.korisnicko_ime = this.identifikator;
    else
      this.k.email = this.identifikator;
  }


}
