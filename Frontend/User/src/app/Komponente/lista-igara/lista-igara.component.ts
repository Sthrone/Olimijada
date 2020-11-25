import { Component, OnInit } from '@angular/core';
import { Igra } from '../../Klase/igra';
import { IgreInfoService } from '../../Servisi/igre-info.service';
import { environment } from '../../../environments/environment';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { StorageService } from '../../Servisi/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-igara',
  templateUrl: './lista-igara.component.html',
  styleUrls: ['./lista-igara.component.css']
})
export class ListaIgaraComponent implements OnInit 
{
  igre: Igra[] = [];
  server: string;
  text: any;

  izabraniJezik: string = "en";

  constructor
  (
    private igreInfo : IgreInfoService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private router: Router
  ) 
  { 
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
    this.igreInfo.PokupiIgre()
    .subscribe((resp: any) =>
    { 
      this.igre = Igra.FromJsonToArray(resp);
      this.SortirajIgre();
    });
    
    this.server=environment.apiUrl;
  }

  SortirajIgre()
  {
    this.igre.sort((x, y) =>
    {
      if (x.naziv_igre < y.naziv_igre)
        return -1;
      
      if (x.naziv_igre > y.naziv_igre)
        return 1;

      return 0;
    });
  }

  PogledajIgru(idIgre:number)
  {
    //alert(idIgre);
    this.router.navigate(['/igre/'+idIgre]);
  }

}
