import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';

import { Igra } from '../../../Klase/igra';
import { IgreInfoService } from '../../../Servisi/igre-info.service';
import { Turnir } from '../../../Klase/turnir';
import { TurnirInfoService } from '../../../Servisi/turnir-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-pregled-turnira-admin',
  templateUrl: './pregled-turnira-admin.component.html',
  styleUrls: ['./pregled-turnira-admin.component.css']
})
export class PregledTurniraAdminComponent implements OnInit 
{
  text:any;
  header=['ime','stanje'];
  igra: Igra;
  stanja_turnira:any;
  turniri: Turnir[] = [];
  server: string;
  danas = Date.now();

  zavrseniTurniri: Turnir[] = [];
  noviTurniri: Turnir[] = [];
  uTokuTurniri: Turnir[] = [];
  pendingTurniri: Turnir[] = []

  selektovano:string;
  prvoSelektovano:any;
  selektovanaVrednost:any;

  brojKorisnikaPoTurniru:any[]=[];

  @Input('matTooltipPosition')
  position: TooltipPosition = "right";

  public ttp0: string;
  public ttp1: string;
  public ttp2: string;
  public ttp3: string;
  public ttp4: string;

  constructor
  (
    private igreService: IgreInfoService,
    private turnirService: TurnirInfoService,
    private router: Router,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private route : ActivatedRoute
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
            this.ttp0 = this.text._198;
            this.ttp4 = this.text._199;
            this.ttp3 = this.text._200;
            this.ttp2 = this.text._1094;
            this.ttp1 = this.text._202;
            this.stanja_turnira= [
              {value: 'svi', viewValue: this.text._208},
              {value: 'novi', viewValue: this.text._209},
              {value: 'uToku', viewValue: this.text._210},
              {value: 'zavrseni', viewValue: this.text._211},
              {value: 'pending', viewValue: this.text._212 }
            ];
          
          }
        );
      }
    );

    this.igreService.izabranaIgra$.subscribe
    (
      (x) =>
      {
        if (x != null)
        {
          this.igra = x;
          this.PokupiTurnire();
        }
        else  // Napravi zahtev za igrom.
        {
          let id = +this.route.snapshot.paramMap.get('id');
          this.igreService.DajIgru(id).subscribe((x) =>
          {
            this.igreService.IzaberiIgru(x);
          });
        }
      }
    ); 
  }

  ngOnInit() 
  {
    this.selektovanaVrednost = 'pending';
    this.selektovano ='pending';

    this.server = environment.apiUrl;
  }

  PokupiTurnire()
  {
    this.turniri = [];
    this.zavrseniTurniri = [];
    this.noviTurniri = [];
    this.uTokuTurniri = [];
    this.pendingTurniri = [];

    this.turnirService.DajTurnire(this.igra.id_igre)
    .subscribe((resp: any) =>
    { 
      this.turniri = Turnir.FromJsonToArray(resp);
      this.turnirService.DajTurnire(this.igra.id_igre)
      .subscribe((resp: any) =>
      { 
        this.turniri = Turnir.FromJsonToArray(resp);
        //console.log(this.turniri);
        this.turnirService.BrojKorisnikaPoTurniru()
        .subscribe((resp: any) =>
        { 
          this.brojKorisnikaPoTurniru = resp;
          
    
          this.NapraviTurnire();
        });
        
      });
    });
  }

  NapraviTurnire()
  {
    let pom;
    for (let i = 0; i < this.turniri.length; i++) 
    {  
      pom = this.brojKorisnikaPoTurniru.find(x=> x.id_turnira==this.turniri[i].id_turnira);
      if(pom != null || pom != undefined)
        this.turniri[i].broj_prijavljenih=pom.broj_prijavljenih;

      if(this.turniri[i].naziv_stanja==="Active")
      {
        this.uTokuTurniri.push(this.turniri[i]);
      }
      else if(this.turniri[i].naziv_stanja=='New')
      {
        if (new Date(this.turniri[i].datum_kraja_prijave).getTime() > new Date().getTime())
          this.noviTurniri.push(this.turniri[i]);
        else
          this.pendingTurniri.push(this.turniri[i]);
      }
      else if(this.turniri[i].naziv_stanja=='Finished')
      {
        this.zavrseniTurniri.push(this.turniri[i]);
      }
    }
  }

  ManagePending(turnir:Turnir)
  {
    this.turnirService.obradaPrijaveAdmin=true;
    this.turnirService.IzaberiTurnir(turnir);
    this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/obradaPrijava']);
  }

  ManageFinished(turnir:Turnir)
  {
    if(turnir.naziv_tipa_turnira == "Cup")
    {
      this.turnirService.gledanjeOtvoreno = true;
      this.turnirService.pregledLige=false;
      this.turnirService.IzaberiTurnir(turnir);
      this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/pregledKupa']);
    }
    else if(turnir.naziv_tipa_turnira== "League")
    {
      this.turnirService.pregledLige=true;
      this.turnirService.gledanjeOtvoreno=false;
      this.turnirService.IzaberiTurnir(turnir);
      this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/pregledLige']);
    }
  }

  ManageNew(turnir:Turnir)
  {
    this.turnirService.pregledNovogTurnriraAdmin=true;
    this.turnirService.IzaberiTurnir(turnir);
    this.router.navigate(['admin/igra/'+this.igra.id_igre+'/pregledNovogTurnira']);

  }


}
