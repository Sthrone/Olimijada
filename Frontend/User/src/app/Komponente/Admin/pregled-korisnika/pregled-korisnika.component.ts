import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Korisnik } from '../../../Klase/korisnik';
import { ActivatedRoute } from '@angular/router';
import { KorisnickiProfilService } from '../../../Servisi/korisnicki-profil.service';
import { Router } from '@angular/router';
import { UserInfoService } from '../../../Servisi/user-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';


@Component({
  selector: 'app-pregled-korisnika',
  templateUrl: './pregled-korisnika.component.html',
  styleUrls: ['./pregled-korisnika.component.css']
})

export class PregledKorisnikaComponent implements OnInit 
{
  text:any;
  server:string;
  korisnik:Korisnik;
  fileToUpload:File=null;

  brojBotova:number;
  brojTurnira:number;

  drzavaPitanje=false;
  organizacijaPitanje=false;

  constructor
  (
    private route : ActivatedRoute,
    private router: Router,
    private korisnickiProfil: KorisnickiProfilService,
    private userInfo: UserInfoService,
    private langService: MultilanguageService,
    private storageService: StorageService
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
    this.DajKorisnika();
    this.server = environment.apiUrl;
  }

  DajKorisnika() : void
  {
    //let id = +this.route.snapshot.paramMap.get('id');
    //console.log("PREGLED: " +  id);
    this.userInfo.izabranKorisnik$.subscribe((x) =>
    { 
      this.korisnik = x;
      
      this.dajBrojBotova();
      this.dajBrojTurnira();
    });
  }



  dajBrojBotova()
  {
    const id = +this.route.snapshot.paramMap.get('id');
    this.korisnickiProfil.dajBrojBotova(id).subscribe
    (
        (resp: any) =>
        {
          this.brojBotova=resp[0].broj;
        }
    );
  }

  dajBrojTurnira()
  {
    const id = +this.route.snapshot.paramMap.get('id');
    this.korisnickiProfil.dajBrojTurnira(id).subscribe
    (
        (resp: any) =>
        {
          this.brojTurnira=resp[0].broj;
        }
    );
  }

}
