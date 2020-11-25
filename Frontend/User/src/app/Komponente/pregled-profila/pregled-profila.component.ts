import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KorisnickiProfilService } from '../../Servisi/korisnicki-profil.service';
import { Korisnik } from '../../Klase/korisnik';
import { environment } from '../../../environments/environment';

import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-pregled-profila',
  templateUrl: './pregled-profila.component.html',
  styleUrls: ['./pregled-profila.component.css']
})
export class PregledProfilaComponent implements OnInit {

  text:any;
  korisnik: Korisnik;
  server:String;

  constructor
  (
    private route : ActivatedRoute,
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
                    }
                  );
                }
              );}

  ngOnInit() {
    this.DajKorisnika();
    this.server=environment.apiUrl;
  }

  DajKorisnika() : void
  {
    let k = JSON.parse(localStorage.getItem('user'));
    this.korisnik=Korisnik.FromJson(k);
  }
}
