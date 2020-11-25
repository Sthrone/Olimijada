import { Component, OnInit, DoCheck } from '@angular/core';
import { KorisnickiProfilService } from '../../../Servisi/korisnicki-profil.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Korisnik } from '../../../Klase/korisnik';
import { Bot } from '../../../Klase/bot';
import { Turnir } from '../../../Klase/turnir';
import { Router } from '@angular/router';
import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';
import { UserInfoService } from '../../../Servisi/user-info.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-korisnik-kontrola',
  templateUrl: './korisnik-kontrola.component.html',
  styleUrls: ['./korisnik-kontrola.component.css']
})
export class KorisnikKontrolaComponent implements OnInit 
{
  text:any;
  server:string;
  korisnik:Korisnik;
  aori: string;

  brojBotova:number;
  brojTurnira:number;

  drzavaPitanje=false;
  organizacijaPitanje=false;

  tab: number = 1;

  constructor
  (
    private route : ActivatedRoute,
    private router: Router,
    private korisnickiProfil: KorisnickiProfilService,
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

            let url: string = this.router.url;
            if (url.includes('admin'))
            {
              this.aori = "/admin";
            }
            else
            {
              this.aori = "/index";
            }
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

  
  ngDoCheck()
  {
    let id = +this.route.snapshot.paramMap.get('id'); 

    if ((this.korisnik) && (id != this.korisnik.id_korisnika))
    {
      this.DajKorisnika();
    }

    if (this.location.path().includes('informacijeKorisnika'))
      this.tab = 1;
    else
      this.tab = 2;
  }


  DajKorisnika() : void
  {
    let id = +this.route.snapshot.paramMap.get('id');
    //console.log("KONTROLA: " +  id);
    this.userInfo.VratiKorisnika(id).subscribe((x) => 
    {
      this.korisnik = Korisnik.FromJson(x[0]);

      this.dajBrojBotova();
      this.dajBrojTurnira();
      if(this.korisnik.drzava!=null)
        this.drzavaPitanje=true;
      if(this.korisnik.organizacija!=null)
        this.organizacijaPitanje=true;
      
        //console.log(this.korisnik);
      this.userInfo.IzaberiKorisnika(this.korisnik);
      
    });
  }

  dajBrojBotova()
  {
    this.korisnickiProfil.dajBrojBotova(this.korisnik.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          this.brojBotova=resp[0].broj;
        }
    );
  }

  dajBrojTurnira()
  {
    this.korisnickiProfil.dajBrojTurnira(this.korisnik.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          this.brojTurnira=resp[0].broj;
        }
    );
  }

  NaInformacije()
  {
    this.tab = 1;
    this.router.navigate([this.aori + '/pregledKorisnika/' + this.korisnik.id_korisnika + '/informacijeKorisnika']);
  }

  NaAnalizu()
  {
    this.tab = 2;
    this.router.navigate([this.aori + '/pregledKorisnika/' + this.korisnik.id_korisnika + '/analizaKorisnika']);
  }

}
