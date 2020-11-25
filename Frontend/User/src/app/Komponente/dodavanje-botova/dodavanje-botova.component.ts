import { Component, OnInit, Input } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Korisnik } from '../../Klase/korisnik';
import { Igra } from '../../Klase/igra';
import { Bot } from '../../Klase/bot';
import { IgreInfoService } from '../../Servisi/igre-info.service';  
import { BotInfoService } from '../../Servisi/bot-info.service';
import { TipBota } from '../../Klase/tip_bota';
import { YesNoDialogComponent } from '../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';

import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-dodavanje-botova',
  templateUrl: './dodavanje-botova.component.html',
  styleUrls: ['./dodavanje-botova.component.css']
})

export class DodavanjeBotovaComponent implements OnInit 
{
  text: any;
  public igra: Igra;
  public postojeciBotovi: Bot[];
  public tipoviBotova: TipBota[];

  private izabraniTip: number;
  private botZaDodavanje: File;

  public nemaBotova: string = "";
  public nemaIzbora: string = "";
  public proveraFajlIgre: string = "";
  public proveraMogucnostZamene: string = "";

  public cekiraniBotovi: number[] = [];
  public moguceTestiranje: boolean = false;
  public moguceBrisanje: boolean = false;

  @Input('matTooltipPosition')
  position: TooltipPosition = "right";
  @Input('matTooltipPosition')
  positionAbove: TooltipPosition = "above";

  public ttp_01: string;
  public ttp_02: string;
  private yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;

  constructor 
  (
    private igreService: IgreInfoService,
    private botService: BotInfoService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) 
  {
    this.igreService.izabranaIgra$.subscribe((x) =>
    {
      if (x != null)
      {
        this.igra = x;
        this.UzmiBotove();
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
            this.ttp_01 = this.text._1023;
            this.ttp_02 = this.text._1024;

            if (this.postojeciBotovi == null)
              this.nemaBotova = this.text._66;
            else if (this.postojeciBotovi.length == 0)
              this.nemaBotova = this.text._66;
          }
        );
      }
    );
  }

  ngOnInit() 
  {

  }

  UzmiBotove()
  {
    this.botService.BotoviZaIgru(JSON.parse(localStorage.getItem('user')).id_korisnika, this.igra.id_igre)
      .subscribe
      (
        (resp: any) =>
        { 
          this.postojeciBotovi = Bot.FromJsonToArray(JSON.parse(resp.botovi));
          this.tipoviBotova = TipBota.FromJsonToArray(JSON.parse(resp.tipovi));

          if (this.postojeciBotovi.length == 0)
            this.nemaBotova = this.text._66;
          else
            this.nemaBotova = "";

          if (this.tipoviBotova.length <= 1)
            this.nemaIzbora = "disabled";
          else
            this.nemaIzbora = "";

          this.izabraniTip = this.tipoviBotova[0].id_tipa_bota;

          this.SortirajBotove();
          //console.log(this.postojeciBotovi);
          //console.log(this.tipoviBotova);
        },
        (errorResp: any) =>
        {
          console.log(errorResp);
          this.toastr.error(JSON.parse(errorResp._body).errorMessage);
        }
      );
  }

  SortirajBotove()
  {
    this.postojeciBotovi.sort((x, y) =>
    {
      if (x.putanja_do_fajla < y.putanja_do_fajla)
        return -1;
      
      if (x.putanja_do_fajla > y.putanja_do_fajla)
        return 1;

      return 0;
    });
  }

  PostaviTipBota(tip: number)
  {
    this.izabraniTip = tip;

    this.ProveraMogucnostZamene();
  }

  OnFileSelected(files: FileList)
  {
    this.botZaDodavanje = files.item(0);
    
    this.ProveraMogucnostZamene();
  }

  ProveraFajlIgre(): boolean
  {
    if (this.botZaDodavanje == null)
    {
      this.proveraFajlIgre = this.text._69;
      return false;
    }

    this.proveraFajlIgre = "";
    return true;
  }


  // Ako postoji bot sa istim imenom i istim tipom, moguce je samo uraditi update fajla.
  // Ako postoji bot sa istim imenom, ali sa razlicitim tipom, to je greska u unosu.
  ProveraMogucnostZamene(): boolean
  {
    if (this.botZaDodavanje == null)
    {
      this.proveraMogucnostZamene = "";
      return;
    }

    let filename = this.botZaDodavanje.name;
    let tip = this.izabraniTip;
    let b: Bot;
    
    // Da li postoji fajl sa ovim imenom?
    if ((b = this.postojeciBotovi.find(x => x.putanja_do_fajla == filename)) !== undefined)
    {
      // Da li je izabrani tip isti kao tip postojeceg bota?
      if (b.id_tipa_bota != tip)
      {
        this.proveraMogucnostZamene = this.text._70;
        return false;
      }
    }

    this.proveraMogucnostZamene = "";

    return true;
  }


  IzvrsiDodavanje()
  {
    if (this.ProveraFajlIgre() && this.ProveraMogucnostZamene())
    {
      this.storageService.SetLoaderState(true);
      // Pravim objekat tipa Bot i saljem u zahtev.
      let bot: Bot = new Bot();
      bot.id_korisnika = JSON.parse(localStorage['user']).id_korisnika;
      bot.id_tipa_bota = this.izabraniTip;
      bot.id_igre = this.igra.id_igre;

      this.botService.DodajBota(bot, this.botZaDodavanje)
          .subscribe
          (
            (resp: any) =>
            { 
              if (resp.success)       // Ako je dodat
              {
                let novi = new Bot();
                novi.id_bota = resp.bot.id_bota;
                novi.id_tipa_bota = resp.bot.id_tipa_bota;
                novi.putanja_do_fajla = resp.bot.putanja_do_fajla;
                novi.naziv_tipa_bota = this.tipoviBotova.find(x => x.id_tipa_bota == novi.id_tipa_bota).naziv_tipa_bota;
                novi.id_korisnika = resp.bot.id_korisnika;
                novi.id_igre = resp.bot.id_igre;

                this.postojeciBotovi.push(novi);
                this.SortirajBotove();
                this.nemaBotova = "";
              }

              setTimeout(() => 
              { 
                this.storageService.SetLoaderState(false); 
                this.toastr.success(`${this.text._75} ${resp.bot.putanja_do_fajla}`);
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
          );
    }
    else
    {
      this.toastr.error(this.text._71);
    }
     
  }
  

  IzvrsiBrisanje()
  {
    // Izvrsiti proveru da li je bilo sta selektovano.
    // Ako jeste, onda treba pitati: da li ste sigurni...

    if (this.cekiraniBotovi.length == 0)
    {
      this.toastr.info(this.text._72);
      return;
    }
    
    let tekst = this.text._1538;

    // Otvori dijalog.
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
        // Uzimam samo one botove koji su cekirani i saljem ih na brisanje.
        let botoviZaBrisanje: Bot[] = this.postojeciBotovi.filter(x => this.cekiraniBotovi.find(y => y == x.id_bota) !== undefined);

        this.botService.ObrisiBotove(botoviZaBrisanje).subscribe
        (
          (resp: any) =>
          { 
            this.postojeciBotovi = this.postojeciBotovi.filter(x => this.cekiraniBotovi.find(y => y == x.id_bota) === undefined);
            this.cekiraniBotovi = [];
            
            if (this.postojeciBotovi.length == 0)
              this.nemaBotova = this.text._66;

            setTimeout(() => 
            { 
              this.storageService.SetLoaderState(false); 
              this.toastr.success(this.text._73);
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
        );
      }
      else
      {
        this.toastr.info(this.text._74);
      }
    });
  }

  PratiCekiranje()
  {
    if (this.cekiraniBotovi.length != 1)
      this.moguceTestiranje = false;
    else
      this.moguceTestiranje = true;

    if (this.cekiraniBotovi.length > 0)
      this.moguceBrisanje = true;
    else
      this.moguceBrisanje = false;
  }

  IzvrsiTestiranje()
  {
    if (this.cekiraniBotovi.length != 1)
    {
      this.toastr.info(this.text._1035);
      return;
    }

    let id = this.cekiraniBotovi[0];
    let naziv = this.postojeciBotovi.find(x => x.id_bota == id).putanja_do_fajla;
    this.igreService.StartTest(naziv);
  }

}
