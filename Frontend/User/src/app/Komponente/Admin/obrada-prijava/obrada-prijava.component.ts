import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material';
import { YesNoDialogComponent } from '../../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { TooltipPosition } from '@angular/material/tooltip';

import { Igra } from '../../../Klase/igra';
import { Turnir } from '../../../Klase/turnir';
import { Igrac } from '../../../Klase/igrac';
import { Korisnik } from '../../../Klase/korisnik';

import { IgreInfoService } from '../../../Servisi/igre-info.service';
import { TurnirInfoService } from '../../../Servisi/turnir-info.service';
import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-obrada-prijava',
  templateUrl: './obrada-prijava.component.html',
  styleUrls: ['./obrada-prijava.component.css']
})

export class ObradaPrijavaComponent implements OnInit 
{
  igra: Igra;
  text: any;
  server: string;
  turnir: Turnir;

  igraci: Igrac[] = [];
  korisnici: Korisnik[] = [];

  datumKraja: any;
  datumOdigravanja: any;

  proveraDatumaKraja: string = "";
  proveraDatumaPocetka: string = "";
  ttp_01: string;
  
  sada: Date;
  defKraj: string;
  defOdigravanje: string;

  @Input('matTooltipPosition')
  position: TooltipPosition = "right";

  yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;

  constructor
  (
    private igreService:IgreInfoService,
    private turnirService: TurnirInfoService,
    private router:Router,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private route : ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog
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
            this.ttp_01 = this.text._1025;
          }
        );
      }
    );

    this.sada = new Date();
    this.defKraj = this.Kraj;
    this.defOdigravanje = this.Odigravanje;
  }

  ngOnInit() 
  {
    this.turnirService.izabranTurnir$.subscribe((x) =>
    {
      if(x == null)
      {
        this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/turniri']);
      }
      else
      {
        this.turnir = x;
      
        this.turnirService.dajIgraceZaTurnir(this.turnir.id_turnira)
        .subscribe((resp: any) =>
        { 
          this.igraci = Igrac.FromJsonToArray(resp);
          this.korisnici = Korisnik.VratiKorisnike(this.igraci);
          this.SortirajKorisnike();
        });
      }
    });
  }

  //--------------------- GET/SET ---------------------

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

  private SortirajKorisnike()
  {
    this.korisnici.sort((x, y) =>
    {
      if (x.rejting < y.rejting)
        return 1;
      
      if (x.rejting > y.rejting)
        return -1;

      return 0;
    });
  }

/*
  ProveriDatumKraja():boolean
  {
    if(this.turnir.datum_kraja_prijave == undefined){
      this.proveraDatumaKraja = "This field is required";
      return false;
    }
    else if(this.turnir.datum_kraja_prijave < this.turnir.datum_pocetka_prijave)
    {
      this.proveraDatumaKraja = "Date can't be in the past.."
      return false;
    }
    else
    {
      this.proveraDatumaKraja = "";
      return true;
    }
  }
*/
  ProveraDatumKraja()
  {
    this.datumKraja = this.defKraj;
    let danas = new Date(Date.now()).getTime();
    
    if (this.datumKraja == null)
    {
      this.proveraDatumaKraja = this.text._1019;
      return false;
    }
    else if (new Date(this.datumKraja).getTime() <= danas)
    {
      this.proveraDatumaKraja = this.text._1017;
      return false;
    }

    this.proveraDatumaKraja = "";
    return true;
  }

  ProveraDatumOdigravanja()
  {
    this.datumOdigravanja = this.defOdigravanje;
    let danas = new Date(Date.now()).getTime();

    if (this.datumOdigravanja == null)
    {
      this.proveraDatumaPocetka = this.text._1019;
      return false;
    }
    else if (new Date(this.datumOdigravanja).getTime() <= danas)
    {
      this.proveraDatumaPocetka = this.text._1017;
      return false;
    }
    else if (this.datumKraja != null && new Date(this.datumKraja).getTime() > new Date(this.datumOdigravanja).getTime())
    {
      this.proveraDatumaPocetka = this.text._1018;
      return false;
    }

    this.proveraDatumaPocetka = "";
    return true;
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

  ProduziPeriod()
  {
    let tekst = this.text._1535;
    let p1 = this.ProveraDatumKraja();
    let p2 = this.ProveraDatumOdigravanja();

    if (p1 && p2)
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
          this.turnir.datum_kraja_prijave = this.datumKraja;
          this.turnir.datum_odigravanja = this.datumOdigravanja;

          this.turnirService.ProduziPeriod(this.turnir)
          .subscribe
          (
            (resp: any) =>
            { 
              setTimeout(() => 
              {
                this.storageService.SetLoaderState(false); 
                this.toastr.success(`${this.text._1022}`);

                this.router.navigate(['/admin/igra/'+ this.igra.id_igre + '/turniri']);
              
                this.turnirService.IzaberiTurnir(null);
                this.turnirService.obradaPrijaveAdmin = false;
              }, 1000);
            }, 
            (errorResp: any) =>
            {
              setTimeout(() => 
              { 
                this.storageService.SetLoaderState(false); 
                this.toastr.error(JSON.parse(errorResp._body).errorMessage);
              }, 1000);
            }
          )
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


  UkloniTurnir()
  {
    let tekst = this.text._1536;

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
      
        this.turnirService.ObrisiTurnir(this.turnir)
        .subscribe
        (
          (resp: any) =>
          { 
            setTimeout(() => 
            { 
              this.storageService.SetLoaderState(false); 
              this.toastr.success(`${this.text._1027}`);
              this.router.navigate(['/admin/igra/'+ this.igra.id_igre + '/turniri']);

              this.turnirService.IzaberiTurnir(null);
              this.turnirService.obradaPrijaveAdmin = false;
            }, 1000);
          }, 
          (errorResp: any) =>
          {
            setTimeout(() => 
            { 
              this.storageService.SetLoaderState(false); 
              this.toastr.error(JSON.parse(errorResp._body).errorMessage);
            }, 1000);
          }
        )
      }
      else
      {
        this.toastr.info(this.text._74);
      }
    });
  }


  ZapocniTurnir()
  {

  }


}
