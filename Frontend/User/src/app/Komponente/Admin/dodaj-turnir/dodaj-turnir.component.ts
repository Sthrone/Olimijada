import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { YesNoDialogComponent } from '../../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Igra } from '../../../Klase/igra';
import { IgreInfoService } from '../../../Servisi/igre-info.service';
import { TurnirInfoService } from '../../../Servisi/turnir-info.service';
import { Turnir } from '../../../Klase/turnir';
import { getLocaleDateTimeFormat } from '@angular/common';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-dodaj-turnir',
  templateUrl: './dodaj-turnir.component.html',
  styleUrls: ['./dodaj-turnir.component.css']
})
export class DodajTurnirComponent implements OnInit 
{
  text: any;
  igra: Igra = new Igra();
  turnir: Turnir = new Turnir();

 
  yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;

  proveraBrojIgraca: string = "";
  proveraDatumaPocetka: string  = "";
  proveraDatumaKraja: string = "";
  proveraNazivaTurnira: string = "";
  proveraTipaTurnira: string = "";
  proveraDatumaOdigravanja: string = "";

  sada: Date;
  defPocetak: string;
  defKraj: string;
  defOdigravanje: string;

  constructor
  (
    private igreService: IgreInfoService, 
    private turnirService: TurnirInfoService,
    private toastr: ToastrService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private route : ActivatedRoute,
    private dialog: MatDialog
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
          }
        );
      }
    );

    this.igreService.izabranaIgra$.subscribe((x) => 
    {
      if (x != null)
      {
        this.igra = x
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
    
    this.sada = new Date();
    this.defPocetak = this.Pocetak;
    this.defKraj = this.Kraj;
    this.defOdigravanje = this.Odigravanje;
  }
  
  ngOnInit() 
  {
    this.Initialize();
  }

  //--------------------- GET/SET ---------------------

  get Pocetak():string
  {  
    let dat: Date;
    dat = new Date(this.sada.getTime() + 2*60000);
    dat.setHours(dat.getHours() + 2);

    let niz = dat.toISOString().split(':');
    return niz[0] + ":" + niz[1];
  }

  set Pocetak(value:string)
  {
    //this.turnir.datum_pocetka_prijave = new Date(value);
    this.defPocetak = value;
  }

  get Kraj():string
  {  
    let dat: Date;
    dat = new Date(this.sada.getTime() + 7*60000);
    dat.setHours(dat.getHours() + 2);

    let niz = dat.toISOString().split(':');
    return niz[0] + ":" + niz[1];
  }

  set Kraj(value:string)
  {
    //this.turnir.datum_kraja_prijave = new Date(value);
    this.defKraj = value;
  }

  get Odigravanje():string
  {      
    let dat: Date;
    dat = new Date(this.sada.getTime() + 9*60000);
    dat.setHours(dat.getHours() + 2);

    let niz = dat.toISOString().split(':');
    return niz[0] + ":" + niz[1];
  }

  set Odigravanje(value:string)
  {
    //this.turnir.datum_odigravanja = new Date(value);
    this.defOdigravanje = value;
  }

  //---------------------------------------------------

  ProveriDatumPocetka():boolean
  {
    this.turnir.datum_pocetka_prijave = new Date(this.defPocetak);
    let danas = new Date(Date.now()).getTime();

    if (this.turnir.datum_pocetka_prijave == null)
    {
      this.proveraDatumaPocetka = this.text._1019;
      return false;
    }
    else if (new Date(this.turnir.datum_pocetka_prijave).getTime() <= danas)
    {
      this.proveraDatumaPocetka = this.text._1017;
      return false;
    }

    this.proveraDatumaPocetka = "";
    return true;
  }

  ProveriDatumKraja():boolean
  {
    this.turnir.datum_kraja_prijave = new Date(this.defKraj);
    let danas = new Date(Date.now()).getTime();

    if (this.turnir.datum_kraja_prijave == null)
    {
      this.proveraDatumaKraja = this.text._1019;
      return false;
    }
    else if (new Date(this.turnir.datum_kraja_prijave).getTime() <= danas)
    {
      this.proveraDatumaKraja = this.text._1017;
      return false;
    }
    else if (this.turnir.datum_pocetka_prijave != null && new Date(this.turnir.datum_pocetka_prijave).getTime() > new Date(this.turnir.datum_kraja_prijave).getTime())
    {
      this.proveraDatumaKraja = this.text._128;
      return false;
    }

    this.proveraDatumaKraja = "";
    return true;
  }

  ProveraDatumaOdigravanja():boolean
  {
    this.turnir.datum_odigravanja = new Date(this.defOdigravanje);
    let danas = new Date(Date.now()).getTime();

    if (this.turnir.datum_odigravanja == null)
    {
      this.proveraDatumaOdigravanja = this.text._1019;
      return false;
    }
    else if (new Date(this.turnir.datum_odigravanja).getTime() <= danas)
    {
      this.proveraDatumaOdigravanja = this.text._1017;
      return false;
    }
    else if (this.turnir.datum_kraja_prijave != null && new Date(this.turnir.datum_kraja_prijave).getTime() > new Date(this.turnir.datum_odigravanja).getTime())
    {
      this.proveraDatumaOdigravanja = this.text._1018;
      return false;
    }

    this.proveraDatumaOdigravanja = "";
    return true;
  }

  ProveriTipTurnira():boolean
  {
    if(this.turnir.id_tipa_turnira != 1 && this.turnir.id_tipa_turnira != 2) {
      this.proveraTipaTurnira = this.text._105; 
      return false;
    }
    else {
      this.proveraTipaTurnira = "";
      return true;
    }
  }

  ProveriNazivTurnira(): boolean
  {
    if (this.turnir.naziv_turnira == undefined)
    {
      this.proveraNazivaTurnira = this.text._105;
      return false;
    }
    else
    {
      this.proveraNazivaTurnira = "";
      return true;
    }
  }

  /*ProveraBrojIgraca(): boolean
  {
    if (this.turnir.broj_ucesnika == undefined || this.turnir.broj_ucesnika == null)
    {
      this.proveraBrojIgraca = "This field is required.";
      return false;
    }
    else if (this.turnir.broj_ucesnika <= 0)
    {
      this.proveraBrojIgraca = "Please enter a positive value.";
      return false;
    }

    this.proveraBrojIgraca = "";
    return true;
  }*/

  
  
  Initialize():void
  {
    this.turnir.id_igre = this.igra.id_igre;
    this.turnir.naziv_stanja = "New";
    this.turnir.broj_ucesnika = 4;

    if(this.turnir.id_tipa_turnira == 1) this.turnir.naziv_tipa_turnira = "Cup";
    else this.turnir.naziv_tipa_turnira = "League";
  }

  DodajTurnir()
  {    
    let tekst = this.text._1533;
    let p1: boolean = this.ProveriDatumPocetka();
    let p2: boolean = this.ProveriDatumKraja();
    let p3: boolean = this.ProveriNazivTurnira();
    let p4: boolean = this.ProveriTipTurnira();
    let p5: boolean = this.ProveraDatumaOdigravanja();

    if(p1 && p2 && p3 && p4 && p5) 
    {
      this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
        data: {
         tekst
        }
      });
      this.yesNoDialogRef.afterClosed().subscribe(res =>
      {
        if (res == true)
        {
          this.storageService.SetLoaderState(true);  
          this.Initialize();

          this.turnirService.DodajTurnir(this.turnir)
          .subscribe
            (
              (resp: any) =>
              { 
                this.turnir = new Turnir();

                setTimeout( () => 
                { 
                  this.storageService.SetLoaderState(false); 
                  this.toastr.success(`${this.text._129}`);
                }, 1000 );

                
              }, 
              (errorResp: any) =>
              {
                setTimeout( () => 
                { 
                  this.storageService.SetLoaderState(false); 
                  this.toastr.error(JSON.parse(errorResp._body).errorMessage);
                }, 1000 );
                
              }
            );
          }
          else
          {
            this.toastr.info(this.text._74);
          }
        });
      }
      else
        this.toastr.error(`${this.text._1021}`); 
  }

}
