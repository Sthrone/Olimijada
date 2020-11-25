import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { Igra } from '../../../Klase/igra';
import { IgreInfoService } from '../../../Servisi/igre-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-game-sidebar',
  templateUrl: './game-sidebar.component.html',
  styleUrls: ['./game-sidebar.component.css']
})
export class GameSidebarComponent implements OnInit 
{
  text: any;
  igre: Igra[] = [];
  prikazaneIgre: Igra[] = [];
  server: string;
  izabranaIgra: Igra;
  admin: boolean = false;

  term: string;

  constructor
  (
    private igreInfo : IgreInfoService,
    private router: Router,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private route : ActivatedRoute
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
    this.igreInfo.PokupiIgre()
    .subscribe((resp: any) =>
    { 
      this.igre = Igra.FromJsonToArray(resp);
      this.server = environment.apiUrl;

      let id = +this.route.snapshot.paramMap.get('id');
      /*
      if (id != -1)
      {
        let index = this.igre.findIndex(x => x.id_igre == id);
        this.SortirajPremaIzboru(index);
      }
      else
      {
        this.SortirajIgre();
        this.IzaberiIgru(this.igre[0]);
      }
      */

      let index = this.igre.findIndex(x => x.id_igre == id);
      this.SortirajPremaIzboru(index);

      this.UnesiZaPrikaz();

    });

    /*
    $('#ert').hover
    (
      function()
      {
        alert("asdad");
        $('#ert').removeClass('border-secondary');
        $('#ert').addClass('border-info'); 
      },
      function()
      { 
        $('#ert').removeClass('border-info');
        $('#ert').addClass('border-secondary'); 
      }
    );
    */
  }

  ngDoCheck()
  {
    let url: string = this.router.url;
    if (url.includes('admin'))
      this.admin = true;
    else
      this.admin = false;
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

  SortirajPremaIzboru(index: number)
  {
    let igra: Igra = this.igre[index];
    this.igre = this.igre.filter(x => x.id_igre != igra.id_igre);

    this.SortirajIgre();
    this.igre.unshift(igra);

    this.IzaberiIgru(this.igre[0]);
  }

  public IzaberiIgru(igra: Igra)
  {
    this.izabranaIgra = igra;
    this.igreInfo.IzaberiIgru(igra);

    let url: string = this.router.url;
    let arr = url.split('/');
    let lastUsed: string;
    for (let i=0 ; i<=arr.length ; i++)
      if (arr[i] == 'igra')
      {
        lastUsed = "/" + arr[i+2];
        break;
      }
      
    let place = this.admin == true ? '/admin' : '/index';
    
    if 
    (
      lastUsed == "/obradaPrijava" ||
      lastUsed == "/pregledKupa" ||
      lastUsed == "/pregledLige" ||
      lastUsed == "/pregledNovogTurnira" ||
      lastUsed == "/prijavaZaTurnir"
    )
    {
      this.router.navigate([place + '/igra/' + this.izabranaIgra.id_igre + lastUsed]);
    }
    else
    {
      this.router.navigate([place + '/igra/' + this.izabranaIgra.id_igre + '/detalji']);
    }

  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- 

  private UnesiZaPrikaz()
  {
    for (let i=0 ; i<this.igre.length ; i++)
      this.prikazaneIgre.push(this.igre[i]);
  }

  private Filtriraj()
  {
    this.prikazaneIgre = [];
    var rx = new RegExp(this.term, "i");

    for (let i=0 ; i<this.igre.length ; i++)
      if (rx.test(this.igre[i].naziv_igre))
        this.prikazaneIgre.push(this.igre[i]);
  }

}
