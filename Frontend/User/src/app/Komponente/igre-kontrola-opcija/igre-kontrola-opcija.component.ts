import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

import { Igra } from '../../Klase/igra';
import { IgreInfoService } from '../../Servisi/igre-info.service';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-igre-kontrola-opcija',
  templateUrl: './igre-kontrola-opcija.component.html',
  styleUrls: ['./igre-kontrola-opcija.component.css']
})
export class IgreKontrolaOpcijaComponent implements OnInit 
{
  text: any;
  igra: Igra;
  server: string;

  constructor
  (
    private route : ActivatedRoute,
    private igreService: IgreInfoService,
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

  ngOnInit() 
  {
    this.DajIgru();
    this.server = environment.apiUrl;
  }
  
  DajIgru() : void
  {
    const id = +this.route.snapshot.paramMap.get('id');
    this.igreService.DajIgru(id).subscribe
    (
      (resp: any) =>
      { 
        this.igra = Igra.FromJsonOne(resp);
        this.igreService.IzaberiIgru(this.igra);
      },
      (errResp: any) =>
      {
        console.log(errResp);
      }
    );
  }

}
