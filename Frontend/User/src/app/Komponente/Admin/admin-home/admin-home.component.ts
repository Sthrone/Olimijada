import { Component, OnInit, Input } from '@angular/core';
import { IgreInfoService } from '../../../Servisi/igre-info.service';
import { Igra } from '../../../Klase/igra';
import { environment } from '../../../../environments/environment'
import { TurnirInfoService } from '../../../Servisi/turnir-info.service';
import { UserInfoService } from '../../../Servisi/user-info.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';
import { StorageService } from '../../../Servisi/storage.service';
import { Router } from '@angular/router';
import { Turnir } from '../../../Klase/turnir';
import { Chart } from 'angular-highcharts';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit 
{
  @Input('matTooltipPosition')
  position: TooltipPosition = "left";
  public server: string;
  public text: any;
  public niz1: any[] = []; //turniri bez dovoljnog br korisnika
  public niz2: any[] = []; //zadnjih 10 korisnika (vreme kreiranja mora da se stavi!) (videti sta pisati ako nista nema od navedenog!)
  public niz3: any[] = []; //zadnjih 10 turnira
  public niz10NajigranijihIgaraSaTurnirima: any[]= []; //10 Najigranijih Igara Sa Turnirima
  public chartIgre:any;


  constructor
  (
    private igreInfo: IgreInfoService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private turnirInfo: TurnirInfoService,
    private userInfo: UserInfoService,
    private router: Router
  )
  { 
    this.server = environment.apiUrl;

    this.storageService.selectedLanguage.subscribe((val) => 
    {
        this.langService.getJSON(val).subscribe((data) => 
        {
          this.text = data;

          //TURNIRI BEZ DOVOLJNOG BROJA KORISNIKA
          this.turnirInfo.VratiTurnireNedovoljno()
          .subscribe((resp: any) =>
          { 
            this.niz1 = resp;
          });

          //ZADNJIH 10 KORISNIKA
          this.userInfo.izlistajZadnjih10Korisnika()
          .subscribe((resp: any) =>
          { 
            this.niz2 = resp;

            if (this.niz2.length == 10)
            {
              this.niz2.splice(8, 2);
            }
            else if (this.niz2.length == 9)
            {
              this.niz2.splice(8, 1);
            }

          });

          //ZADNJIH 10 TURNIRA
          this.turnirInfo.VratiZadnjih10TurniraOdigranih()
          .subscribe((resp: any) =>
          { 
            this.niz3 = resp;
          });
          
          this.Daj10IgaraSaTurnirima();
        });
    });
  }

  ngOnInit()
  {
    
  }

  proslediDoKorisnika(id: number)
  {
    this.router.navigate(['/admin/pregledKorisnika/' + id]);
  }

  public turnir: Turnir;
  manageTurnir(obj: Object)
  {
    let id = obj['id_igre'];
    this.turnir = Turnir.FromJson(obj);
    this.turnirInfo.obradaPrijaveAdmin = true;
    this.turnirInfo.pregledLige = false;
    this.turnirInfo.gledanjeOtvoreno = false;
    this.turnirInfo.IzaberiTurnir(this.turnir);
    this.router.navigate(['/admin/igra/' + id + '/obradaPrijava']);
  }

  ManageFinished(obj: Object)
  {
    this.turnir = null;
    let id = obj['id_igre'];
    this.turnir = Turnir.FromJson(obj);

    if(this.turnir.naziv_tipa_turnira == "Cup")
    {
      this.turnirInfo.gledanjeOtvoreno = true;
      this.turnirInfo.pregledLige=false;
      this.turnirInfo.IzaberiTurnir(this.turnir);
      this.router.navigate(['/admin/igra/' + id + '/pregledKupa']);
    }
    else if(this.turnir.naziv_tipa_turnira== "League")
    {
      this.turnirInfo.pregledLige=true;
      this.turnirInfo.gledanjeOtvoreno=false;
      this.turnirInfo.IzaberiTurnir(this.turnir);
      this.router.navigate(['/admin/igra/' + id + '/pregledLige']);
    }
  }

  Daj10IgaraSaTurnirima()
  {
    this.igreInfo.Daj10NajigranijihIgaraSaTurnira()
    .subscribe((resp: any) =>
    { 
      this.niz10NajigranijihIgaraSaTurnirima = resp;
      //console.log(this.niz10NajigranijihIgaraSaTurnirima);
      
      this.SortirajNajigranije();
      this.NapraviChartZaIgreSaTurnririma();
    });
  }

  SortirajNajigranije()
  {
    this.niz10NajigranijihIgaraSaTurnirima.sort(function(a,b) 
    {
      return b.broj_turnira - a.broj_turnira;
    });
  }

  NapraviChartZaIgreSaTurnririma()
  {
    let nizImena =[];
    let nizVrednosti = [];
    let nizIdJeva = [];

    for(let i of this.niz10NajigranijihIgaraSaTurnirima)
    {
      nizImena.push(i.naziv_igre);
      nizVrednosti.push(i.broj_turnira);
      nizIdJeva.push(i.id_igre);
    }
  
    this.chartIgre = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: this.text._567
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: this.text._568
        }
    
      },
    
      
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },
    
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> <br/>'
      },
    
      "series": [
        {
          "name": this.text._566,
          
          "data": 
          [
            {
              "name": nizImena[0],
              "y": nizVrednosti[0]
            },
            {
              "name": nizImena[1],
              "y": nizVrednosti[1]
            },
            {
              "name": nizImena[2],
              "y": nizVrednosti[2]
            },
            {
              "name": nizImena[3],
              "y": nizVrednosti[3]
            },
            {
              "name": nizImena[4],
              "y": nizVrednosti[4]
            },
            {
              "name": nizImena[5],
              "y": nizVrednosti[5]
            },
            {
              "name": nizImena[6],
              "y": nizVrednosti[6]
            },
            {
              "name": nizImena[7],
              "y": nizVrednosti[7]
            },
            {
              "name":  nizImena[8],
              "y": nizVrednosti[8]
            },
            {
              "name": nizImena[9],
              "y": nizVrednosti[9]
            },
          ]
        }
      ],
    });


  }
}
