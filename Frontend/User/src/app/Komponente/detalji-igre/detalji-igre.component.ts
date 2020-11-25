import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { Igra } from '../../Klase/igra';
import { IgreInfoService } from '../../Servisi/igre-info.service';

import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-detalji-igre',
  templateUrl: './detalji-igre.component.html',
  styleUrls: ['./detalji-igre.component.css']
})
export class DetaljiIgreComponent implements OnInit 
{
  text: any;
  igra: Igra;
  server: string;
  aori: string;

  izabraniJezik: string = "en";

  constructor
  (
    private igreService: IgreInfoService,
    private router: Router,
    private langService: MultilanguageService,
    private storageService: StorageService
  ) 
  { 
    igreService.izabranaIgra$.subscribe(x =>
    {
      this.igra = x;
      this.server = environment.apiUrl;

      let url: string = this.router.url;
      if (url.includes('admin'))
      {
        this.aori = "admin";
      }
      else
      {
        this.aori = "index";
      }
    });

    

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

}
