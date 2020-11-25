import { Component, OnInit, Input } from '@angular/core';
import { Mec } from '../../Klase/mec';
import { Turnir } from '../../Klase/turnir';
import { TurnirInfoService } from '../../Servisi/turnir-info.service';
import { IgreInfoService } from '../../Servisi/igre-info.service';
import { Igra } from '../../Klase/igra';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment'
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { StorageService } from '../../Servisi/storage.service';
import { mecSaRezultatima } from '../../Klase/mecSaRezultatima';
import { Tabela } from '../../Klase/tabela';
import { TooltipPosition } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { BotInfoService } from '../../Servisi/bot-info.service';
import { Bot } from '../../Klase/bot';
import { Igrac } from '../../Klase/igrac';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pregled-lige',
  templateUrl: './pregled-lige.component.html',
  styleUrls: ['./pregled-lige.component.css']
})
export class PregledLigeComponent implements OnInit 
{
  igra: Igra;
  turnir:Turnir;
  server:string;
  nizMeceva:Mec[]=[];
  text:any;
  mecevi:mecSaRezultatima[]=[];
  tabela:Tabela[]=[];
  brojPaginacije=1;
  kola:number[]=[];
  page:any;
  pokaziDivMeca:number=0;
  mec:mecSaRezultatima;
  igraci1:Igrac[]=[];
  igraci2:Igrac[]=[];
  selektovanMec: number;

  @Input('matTooltipPosition')
  position: TooltipPosition = "above";
  public ttp: string;

  aori: string;

  constructor
  (
    private turnirService: TurnirInfoService, 
    private igreService: IgreInfoService,
    private router: Router,
    private toastr: ToastrService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private botService: BotInfoService,
    private _scrollToService: ScrollToService,
    private route : ActivatedRoute
  ) 
  { 
    this.igreService.izabranaIgra$.subscribe((x) => 
    {
      if (x != null)
      {
        this.igra = x;
      }
      else  // Napravi zahtev za igrom.
      {
        let id = +this.route.snapshot.paramMap.get('id');
        this.igreService.DajIgru(id).subscribe((x) =>
        {
          this.igreService.IzaberiIgru(x);
        });
      }
    });

    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        this.langService.getJSON(val).subscribe
        (
          (data) =>
          {
            this.text = data;

            this.ttp = this.text._1009;
          }
        );
      }
    );
  }

  ngOnInit() 
  {
    this.turnirService.izabranTurnir$.subscribe((x) =>
    {
      if(x == null)
      {
        this.router.navigate(['index/igra/' + this.igra.id_igre + '/turniri']);
      }
      else
      {
        this.turnir = x;

        this.DajMeceveSaRezultatima();
        this.DajTabelu();
      }
    });

    let url: string = this.router.url;
    if (url.includes('admin'))
    {
      this.aori = "/admin";
    }
    else
    {
      this.aori = "/index";
    }

    this.server = environment.apiUrl;
  }


  SortirajKorisnikeUTabeli()
  {
    this.tabela.sort((x, y) =>
    {
      if (x.broj_bodova < y.broj_bodova)
        return 1;
      
      if (x.broj_bodova > y.broj_bodova)
        return -1;

      return 0;
    });
  }


  SortirajMecevePoRundi()
  {
    this.mecevi.sort((x, y) =>
    {
      if (x.runda < y.runda)
        return -1;
      
      if (x.runda > y.runda)
        return 1;

      return 0;
    });
  }

  DajMeceveSaRezultatima()
  {
    this.turnirService.DajMeceveSaRezultatima(this.turnir.id_turnira).subscribe
    (
      (resp: any) =>
      { 
        this.mecevi = resp;
        //for(let _i = 1; _i<=this.mecevi.length;_i++)
          //this.kola.push(_i);
        //console.log(this.mecevi);
        //this.SortirajKorisnike();
      },
      (errorResp: any) =>
      {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
    );
  }
  

  DajTabelu()
  {
    this.turnirService.DajTabelu(this.turnir.id_turnira).subscribe
    (
      (resp: any) =>
      { 
        this.tabela = Tabela.FromJsonToArray(resp);
        //console.log(resp);
        for(let i of this.tabela)
          i.broj_bodova=i.broj_pobeda*3+i.broj_neresenih;
 
        this.SortirajKorisnikeUTabeli();
      },
      (errorResp: any) =>
      {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
    );
  }

  PostaviPaginaciju(broj:number)
  {
    this.brojPaginacije=broj;
  }


  PrikaziMec(id:number)
  {
    //novi.naziv_tipa_bota = this.tipoviBotova.find(x => x.id_tipa_bota == novi.id_tipa_bota).naziv_tipa_bota;
    this.selektovanMec = id;

    for(let i of this.mecevi)
      if(i.id_meca==id)
        {
          this.mec =mecSaRezultatima.FromJson(i);
          this.pokaziDivMeca=1;
          break;
        }
    
    
      this.turnirService.DajIgraceKorisnikaZaTurnir(this.mec.id_korisnika1, this.turnir.id_turnira).subscribe
      (
      (resp: any) => {
        //console.log(resp);
        this.igraci1 = Igrac.FromJsonToArray(resp);
      },
      (errorResp: any) => {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
      );

    this.turnirService.DajIgraceKorisnikaZaTurnir(this.mec.id_korisnika2, this.turnir.id_turnira).subscribe
      (
      (resp: any) => {
        this.igraci2 = Igrac.FromJsonToArray(resp);
      },
      (errorResp: any) => {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
      );
      /*if(this.pokaziDivMeca == 1)
      {
        const config: ScrollToConfigOptions = {
          target: 'destination'
        };
     
        this._scrollToService.scrollTo(config);
        
      }*/
         

  }

  ZapocniMec()
  {
    if (this.selektovanMec != null)
      this.igreService.StartMatch(this.aori, this.selektovanMec);
  }

}
