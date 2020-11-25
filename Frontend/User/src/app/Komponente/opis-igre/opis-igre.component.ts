import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

import { Igra } from '../../Klase/igra';
import { IgreInfoService } from '../../Servisi/igre-info.service';

import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-opis-igre',
  templateUrl: './opis-igre.component.html',
  styleUrls: ['./opis-igre.component.css']
})
export class OpisIgreComponent implements OnInit 
{
  text: any;
  igra: Igra;
  server: string;
  loggedIn: boolean = false;

  izabraniJezik: string = "en";

  constructor
  (
    private igreService: IgreInfoService,
    private router: Router,
    private route: ActivatedRoute,
    private langService: MultilanguageService,
    private storageService: StorageService
  ) 
  {
    let url: string = this.router.url;
    if (url.includes('index'))  // Ulogovan korisnik
    {
      igreService.izabranaIgra$.subscribe
      (
        (x) =>
        {
          this.igra = x;
          this.loggedIn = true;
        }
      );
    }
    else                       // Treba pokupiti
    {
      let id = +this.route.snapshot.paramMap.get('id');
      this.igreService.DajIgru(id).subscribe((resp: any) =>
      { 
        this.igra = Igra.FromJsonOne(resp);
        this.loggedIn = false;
      });

    }

    this.server = environment.apiUrl;

    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        this.izabraniJezik = val;
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

  VratiNazad()
  {
    this.router.navigate(['/igre']);
  }

}
