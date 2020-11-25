import { Component, OnInit, Input } from '@angular/core';
import { IgreInfoService } from '../../Servisi/igre-info.service';
import { Igra } from '../../Klase/igra';
import { environment } from '../../../environments/environment'
import { TurnirInfoService } from '../../Servisi/turnir-info.service';
import { Turnir } from '../../Klase/turnir';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { StorageService } from '../../Servisi/storage.service';
import { NavbarService } from '../../Servisi/navbar.service';
import { Router } from '@angular/router';
import { UserInfoService } from '../../Servisi/user-info.service';
import { DatumRejting } from '../../Klase/datumRejting';
import { Korisnik } from '../../Klase/korisnik';
import { DatePipe } from '@angular/common';
import { Chart } from 'angular-highcharts';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  @Input('matTooltipPosition')
  position: TooltipPosition = "left";
  public server: string;
  public najpopularnijeIgre: Igra[] = [];
  public najpopularnijeIgreKorisnika: Igra[] = [];
  public text: any;
  public id_korisnika: number;
  public niz: any[] = [];
  public niz1: any[] = [];
  public niz2: any[] = [];
  public korisnik: Korisnik;

  chartS1 : string ="";
  chartS2 : string ="";
  

  nizDatuma:Date[]=[];
  danas:any;
  mesecPre:Date;
  rejtinzi:number[]=[];
  rejting:number;

  datumRejting:DatumRejting[]=[];
  chartRejting:any;


  aori: string;

  constructor
  (
    private igreInfo: IgreInfoService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private turnirInfo: TurnirInfoService,
    private nav: NavbarService,
    private userService: UserInfoService,
    private router: Router,
    private dataPipe: DatePipe
  ) 
  {
    this.server = environment.apiUrl;

    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        this.langService.getJSON(val).subscribe
        (
          (data) => 
          {
            this.text = data;
            this.chartS1=this.text._537;
            this.chartS2=this.text._30;

            

            
          }
        );
    });

    
  }

  ngOnInit() 
  {

    if(localStorage.getItem('user') != null)
            {
              this.id_korisnika = JSON.parse(localStorage.getItem('user')).id_korisnika;
              this.userService.VratiKorisnika(this.id_korisnika)
              .subscribe((resp: any) =>
              { 
                this.korisnik = Korisnik.FromJsonOne(resp);
                this.DajRejtingZaMesecDana();
              });
            }

    let url: string = this.router.url;
    if (url.includes('admin'))
    {
      this.aori = "/admin";
    }
    else
    {
      this.aori = "/index";
    }

    
   
   
    //IGRE NAJIGRANIJE
    this.igreInfo.VratiNajigranijeIgre()
    .subscribe((resp: any) =>
    { 
      this.najpopularnijeIgre = Igra.FromJsonToArray(resp);
    });
    
    //NAJIGRANIJE IGRE KORISNIKA
    this.igreInfo.VratiIgreKorisnika(this.id_korisnika)
    .subscribe((resp: any) =>
    { 
      this.najpopularnijeIgreKorisnika = Igra.FromJsonToArray(resp);
      this.VratiTurnire();
    });

    //TURNIRI NA KOJE JE KORISNIK PRIJAVLJEN
    this.turnirInfo.VratiPrijavljeneTurnireKorisnika(this.id_korisnika)
    .subscribe((resp: any) =>
    { 
      this.niz = resp;
    });
   
    //Zadnjih 5 mecheva
    this.turnirInfo.VratiZadnjih10MecevaOdigranihZaKorisnika(this.id_korisnika)
    .subscribe((resp: any) =>
    { 
      this.niz2 = resp;
    });
   
    
  }

  VratiTurnire()
  {
    this.turnirInfo.VratiTurnireZaKorisnika(this.najpopularnijeIgreKorisnika)
    .subscribe((resp: any) =>
    { 
      this.niz1 = resp;
    });
  }

  proslediDoIgre(id: number)
  {
    this.router.navigate(['/index/igra/' + id]);
  }

  public turnir: Turnir = null;
  prijavljeniTurnir(obj: Object)
  {
    let id = obj['id_igre']
    this.turnir = Turnir.FromJson(obj);
    this.turnirInfo.IzaberiTurnir(this.turnir);
    this.router.navigate(['/index/igra/' + id + '/prijavaZaTurnir']);
    this.turnirInfo.prijavljivanjeNaTurnir=true;
  
  }

 

  DajRejtingZaMesecDana()
  {
    this.danas=new Date();
    this.mesecPre=new Date(this.danas.getFullYear(),this.danas.getMonth()-1,this.danas.getDate());

    while(this.mesecPre <= this.danas)
    {
      this.nizDatuma.push(new Date(this.mesecPre.getFullYear(),this.mesecPre.getMonth(),this.mesecPre.getDate()));
      this.mesecPre.setDate(this.mesecPre.getDate()+1);
    }

    //console.log(this.nizDatuma);
    let pom:any;
    let pom2:any;
    let j:number=0;
//    this.nizDatuma=getDateArray(new Date(), )
    this.userService.DajRejtingZaMesecDana(this.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          
          this.datumRejting=DatumRejting.FromJsonToArray(resp);
          //console.log(this.datumRejting);
          //napravio rejting za taj datum
          if(this.datumRejting==null || this.datumRejting==undefined || this.datumRejting.length == 0)
            for(let i=0;i<this.nizDatuma.length;i++)
            {
              this.rejtinzi.push(0);
            }
          else
          {
            for(let i=0;i<this.nizDatuma.length;i++)
            {
              /*pom2 = this.datumRejting.find(x => x.datum_odigravanja.getTime==this.nizDatuma[i].getTime).rejting;
              console.log(i);
              console.log(pom2);
              if(pom2 != null)
              {
                
                this.rejtinzi.push(pom2);
              }  
              else
                this.rejtinzi.push(0);
              
              
              //console.log(this.nizDatuma[i] + " -- " + this.datumRejting[0].datum_odigravanja);*/
              if(this.datumRejting==null || this.datumRejting==undefined)
                this.rejtinzi.push(0);
              else
              {
                if(this.datumRejting!=undefined && this.nizDatuma[i].getFullYear() == this.datumRejting[j].datum_odigravanja.getFullYear() && this.nizDatuma[i].getMonth()==this.datumRejting[j].datum_odigravanja.getMonth() && this.nizDatuma[i].getDate()==this.datumRejting[j].datum_odigravanja.getDate())
                {
                  //console.log(this.datumRejting[j].rejting);
                  this.rejtinzi.push(this.datumRejting[j].rejting);
                  if(j<this.datumRejting.length-1)
                    j++;
                  
                } 
                else
                  this.rejtinzi.push(0);
              }
            }

          


          }
          //console.log(this.rejtinzi);
          this.rejting=this.korisnik.rejting;


          //napravio validan niz rejtinga
          for(let i=this.rejtinzi.length-1;i>=0;i--)
          {
            if(this.rejtinzi[i]==0)
              this.rejtinzi[i]=this.rejting;
            else
            {
              pom=this.rejtinzi[i];
              this.rejtinzi[i]=this.rejting;
              this.rejting-=pom;
            }
          }

          //console.log(this.rejtinzi);
          //console.log(this.nizDatuma);

          this.NapraviChartRejting();
        }

      
    );


  }

  NapraviChartRejting()
  {
    let pom:string[]=[];

    for(let i=0;i<this.nizDatuma.length;i++)
      pom.push(this.dataPipe.transform(this.nizDatuma[i],'yyyy-MM-dd'));
    this.chartRejting = new Chart({
      chart: {
        type: 'spline'
      },
      xAxis:{
        categories: pom
      },
      title: {
        text: ""
      },
      credits: {
        enabled: false
      },
      series: [{
        name: this.chartS2,
        data: this.rejtinzi
      }]
    });
   
  }
  
  ZapocniMec(id_mecha: number)
  {
    this.igreInfo.StartMatch(this.aori, id_mecha);
  }

}
