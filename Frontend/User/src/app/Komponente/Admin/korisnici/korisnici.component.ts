import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../../../Klase/korisnik';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserInfoService } from '../../../Servisi/user-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrls: ['./korisnici.component.css']
})
export class KorisniciComponent implements OnInit {
  
  text:any;
  
   constructor
  (
    private route : ActivatedRoute,
    private userService: UserInfoService,
    private location : Location,
    private langService: MultilanguageService,
    private storageService: StorageService
  ) { 
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

  korisnik: Korisnik;

  ngOnInit() {
    this.vratiKorisnika();
  }

  vratiKorisnika():void
  {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.VratiKorisnika(id).subscribe((resp: any) =>
    { 
      
      this.korisnik = Korisnik.FromJsonOne(resp);
      
    });
  }

}
