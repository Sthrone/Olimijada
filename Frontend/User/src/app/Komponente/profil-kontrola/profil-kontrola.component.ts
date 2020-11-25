import { Component, OnInit } from '@angular/core';
import { KorisnickiProfilService } from '../../Servisi/korisnicki-profil.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Korisnik } from '../../Klase/korisnik';
import { Bot } from '../../Klase/bot';
import { Turnir } from '../../Klase/turnir';
import { Router } from '@angular/router';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-profil-kontrola',
  templateUrl: './profil-kontrola.component.html',
  styleUrls: ['./profil-kontrola.component.css']
})
export class ProfilKontrolaComponent implements OnInit
{
  text:any;
  server:string;
  korisnik:Korisnik;
  fileToUpload:File=null;
  aori: string;

  brojBotova:number;
  brojTurnira:number;

  drzavaPitanje=false;
  organizacijaPitanje=false;

  constructor
  (
    private route : ActivatedRoute,
    private router: Router,
    private korisnickiProfil: KorisnickiProfilService,
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
    this.dajBrojBotova();
    this.dajBrojTurnira();
    if(this.korisnik.drzava!=null)
      this.drzavaPitanje=true;
    if(this.korisnik.organizacija!=null)
      this.organizacijaPitanje=true;
  }

  DajKorisnika() : void
  {
    let k = JSON.parse(localStorage.getItem('user'));
    this.korisnik=Korisnik.FromJson(k);
    //console.log(this.korisnik);


  }

  onFileSelected(files: FileList)
  {
    this.fileToUpload = files.item(0);
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

  


}
