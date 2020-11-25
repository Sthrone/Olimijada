import { Component, OnInit, AfterViewInit , ElementRef, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Korisnik } from '../../Klase/korisnik';
import { ActivatedRoute } from '@angular/router';
import { KorisnickiProfilService } from '../../Servisi/korisnicki-profil.service';
import { Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';


import { UserInfoService } from '../../Servisi/user-info.service';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
//import { Chart } from 'chart.js';
//import * as Chart from 'chart.js';

import { DatePipe } from '@angular/common';
import { Chart } from 'angular-highcharts';
import { PobedeKorisnika } from '../../Klase/pobedeKorisnika';
import { PoraziKorisnika } from '../../Klase/poraziKorisnika';
import { DatumRejting } from '../../Klase/datumRejting';


@Component({
  selector: 'app-analiza-profila',
  templateUrl: './analiza-profila.component.html',
  styleUrls: ['./analiza-profila.component.css']
})
export class AnalizaProfilaComponent implements OnInit, AfterViewInit  
{

  text: any;
  server:string;
  korisnik:Korisnik;
  fileToUpload:File=null;
  barChart: Chart;

  brojBotova:number;
  brojTurnira:number;

  drzavaPitanje=false;
  organizacijaPitanje=false;
  chartPobede:any;
  chartPorazi:any;
  pobedeKorisnika:PobedeKorisnika[]=[];
  poraziKorisnika:PoraziKorisnika[]=[];
  pobedeKorisnikaUlaz:PobedeKorisnika[]=[];
  poraziKorisnikaUlaz:PoraziKorisnika[]=[];

  chart:any;
  chartSve:any;
  pobedePoraziNereseno:any; 
  nizDatuma:Date[]=[];
  danas:any;
  mesecPre:Date;
  rejtinzi:number[]=[];
  rejting:number;

  datumRejting:DatumRejting[]=[];
  chartRejting:any;

  @Input('matTooltipPosition')
  position: TooltipPosition = "above";

  aori: string;

  constructor
  (
    private route : ActivatedRoute,
    private router: Router,
    private korisnickiProfil: KorisnickiProfilService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private elementRef: ElementRef,
    private userService: UserInfoService,
    private dataPipe: DatePipe
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
    /*this.danas = new Date();
    console.log(this.danas + " ----------");
    //this.danas = new Date(this.danas.getYear(), this.danas.getMonth(), this.danas.getDate());
    //console.log(this.danas + " +++++++++++++++++ ");
    console.log(this.danas.getYear() + " --- " + this.danas.getMonth() + " --- " + this.danas.getDate());
    this.danas.setDate(this.danas.getDate() - 30);
    //console.log(this.danas.getFullYear() + " --- " + (this.danas.getMonth()-12) + " --- " + this.danas.getDate());
    //this.danas=new Date(Date.now(),shortDate);
    console.log(this.danas);
    this.danas = new Date(this.danas.getFullYear(), this.danas.getMonth(), this.danas.getDate());
    console.log(this.danas);
    */
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
    
    //this.DajPobede();
    //this.DajPoraze();
    
    //this.NapraviNizPobedaiPoraza();
    //this.Pomocna();
    this.DajPobedePorazeNeresenoZaKorisnika();
    this.DajRejtingZaMesecDana();
    //this.NapraviChartZaPobede();

    let url: string = this.router.url;
    if (url.includes('admin'))
      this.aori = '/admin';
    else
      this.aori = '/index';
  }

  

  /*Pomocna()
  {
    this.DajPobede();
    this.DajPoraze();
    this.NapraviNizPobedaiPoraza();
  }
*/
  DajKorisnika() : void
  {
    let k = JSON.parse(localStorage.getItem('user'));
    this.korisnik=Korisnik.FromJson(k);
    this.DajPobede();
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


  
  DajPobede()
  {
    this.userService.VratiKorisnikeProtivKojihImaNajvisePobeda(this.korisnik.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          this.pobedeKorisnikaUlaz=PobedeKorisnika.FromJsonToArray(resp);
          //console.log(this.pobedeKorisnikaUlaz);
          this.DajPoraze();
        }
    );
  }

  DajPoraze()
  {
    this.userService.VratiKorisnikeProtivKojihImaNajvisePoraza(this.korisnik.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          this.poraziKorisnikaUlaz=PoraziKorisnika.FromJsonToArray(resp);
          //console.log(this.pobedeKorisnikaUlaz);
          //console.log(resp);
          //console.log(this.poraziKorisnikaUlaz);
          this.NapraviNizPobedaiPoraza();
        }
    );
  }

  NapraviNizPobedaiPoraza()
  {

    
    let pom;
    //------------------ 5 pobede ------------------
    let duzinaPobeda;
    if(this.pobedeKorisnikaUlaz.length<5)
      duzinaPobeda=this.pobedeKorisnikaUlaz.length;
    else
      duzinaPobeda=5;

    //console.log(duzinaPobeda);
    for(let i=0;i<duzinaPobeda;i++)
    {
      
      this.pobedeKorisnika.push(this.pobedeKorisnikaUlaz[i]);
      if(this.poraziKorisnikaUlaz.length>0)
      {
        pom=this.poraziKorisnikaUlaz.find(x=>x.id_korisnika==this.pobedeKorisnika[i].id_korisnika);
        
        if(pom!=null || pom!=undefined)
          this.pobedeKorisnika[i].broj_poraza = pom.broj_poraza;
      }
      
    }

    //console.log(this.poraziKorisnikaUlaz);
    //------------------- 5 poraza -----------------
    let duzinaPoraza;
    if(this.poraziKorisnikaUlaz.length<5)
      duzinaPoraza=this.poraziKorisnikaUlaz.length;
    else
      duzinaPoraza=5;

    for(let i=0;i<duzinaPoraza;i++)
    {
      this.poraziKorisnika.push(this.poraziKorisnikaUlaz[i]);
      if(this.pobedeKorisnikaUlaz.length>0)
      { 
        pom=this.pobedeKorisnikaUlaz.find(x=>x.id_korisnika==this.poraziKorisnika[i].id_korisnika);
        if(pom!=null || pom!=undefined)
          this.poraziKorisnika[i].broj_pobeda=pom.broj_pobeda;
      }
    }
    //console.log('----------------------');
    //console.log(this.poraziKorisnika);
    
    
  }


 

 

  
  DajPobedePorazeNeresenoZaKorisnika()
  {
    this.userService.DajPobedePorazeNeresenoZaKorisnika(this.korisnik.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          
          this.pobedePoraziNereseno=resp;
          if(this.pobedePoraziNereseno.length!=0)
            this.NapraviChartPobedePoraziNereseno();
        }
    );
  }

  
  ngAfterViewInit() 
  {
   /* this.canvas = this.elementRef.nativeElement.querySelector(`#barChart`);
    //this.ctx = this.canvas.getContext('2d');
    this.barChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
          labels: ["New", "In Progress", "On Hold"],
          datasets: [{
              label: '# of Votes',
              data: [1,2,3],
              backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
        display:true
      }
    });*/ 
  }

  NapraviChartZaPobede()
  {
    var podaci:number[]=[];
    var imena:string[]=[];
    
    for(let i of this.pobedeKorisnika)
    {
      podaci.push(i.broj_pobeda);
      imena.push(i.korisnicko_ime);
    }
      

    this.chartPobede = new Chart({
      chart: {
        type: 'column'
      },
      xAxis:{
        categories: imena
      },
      title: {
        text: this.text._533
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "",
        data: podaci
      }]
    });
  }  



  NapraviChartZaPoraze()
  {
    var podaci:number[]=[];
    var imena:string[]=[];
    
    for(let i of this.poraziKorisnika)
    {
      podaci.push(i.broj_poraza);
      imena.push(i.korisnicko_ime);
    }
      

    this.chartPorazi = new Chart({
      chart: {
        type: 'column'
      },
      xAxis:{
        categories: imena
      },
      title: {
        text: this.text._534
      },
      credits: {
        enabled: false
      },
      series: [{
        //name: 'Line 1',
        data: podaci
      }]
    });
  }
 

  NapraviChartPobedePoraziNereseno()
  {

    //console.log(this.pobedePoraziNereseno[0].broj_pobeda);

    //this.pobedePoraziNereseno[0].broj_poraza=2;
    //this.pobedePoraziNereseno[0].broj_neresenih=1

    this.chartSve = new Chart({
      chart: {
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: this.text._536
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        //name: this.text._535,
        
        data: [{
          name: this.text._522,
          y: this.pobedePoraziNereseno[0].broj_pobeda,
          sliced: true,
          selected: true
        }, {
          name: this.text._523,
          y: this.pobedePoraziNereseno[0].broj_poraza
        }, {
          name: this.text._524,
          y: this.pobedePoraziNereseno[0].broj_neresenih
        }]
      }]
      
    });
    
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
    this.userService.DajRejtingZaMesecDana(this.korisnik.id_korisnika).subscribe
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
        text: this.text._537
      },
      credits: {
        enabled: false
      },
      series: [{
        name: this.text._30,
        data: this.rejtinzi
      }]
    });
   
  }


  PogledajKorisnika(idKorisnika:number)
  {
    this.router.navigate([this.aori + "/pregledKorisnika/" + idKorisnika + '/informacijeKorisnika']);
  }


}
