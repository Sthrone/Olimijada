import { Component, OnInit,Input } from '@angular/core';
import { YesNoDialogComponent } from '../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TooltipPosition } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

import { Igrac } from '../../Klase/igrac';
import { TurnirInfoService } from '../../Servisi/turnir-info.service';
import { environment } from '../../../environments/environment';
import { Turnir } from '../../Klase/turnir';
import { MatSelectModule } from '@angular/material/select';
import { Bot } from '../../Klase/bot';
import { Router } from '@angular/router';
import { Igra } from '../../Klase/igra';
import { IgreInfoService } from '../../Servisi/igre-info.service';
import { Korisnik } from '../../Klase/korisnik';
import { TipBota } from '../../Klase/tip_bota';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BotInfoService } from '../../Servisi/bot-info.service';

import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';




@Component({
  selector: 'app-pravljenje-igraca',
  templateUrl: './pravljenje-igraca.component.html',
  styleUrls: ['./pravljenje-igraca.component.css']
})
export class PravljenjeIgracaComponent implements OnInit {
  
  yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;
  
  @Input('matTooltipPosition')
  position: TooltipPosition = "right";
  public ttp_01: string = "If the game has only one bot role, this field will be automatically selected.";
  public ttp_02: string = "Uploading a new bot with the same name and role as the existing bot, will update the old bot.";

  text: any;
  igraci:Igrac[]=[];
  server:String;
  turnir:Turnir;
  botovi:Bot[]=[];
  igra:Igra;
  korisnik:Korisnik;
  igraciKorisnika:Igrac[]=[];
  igraciKorisnikaNovi:Igrac[]=[];

  cekiraniBot:string;
  nijeCekiranBot:string="";
  slikaZaDodavanje:File;

  public nazivIgraca:string = "";
  proveraNazivaIgraca:string="";
  losNazivIgraca="Name of player must be 3-10 characters long.";

  public nemaBotova: string = "";
  public nemaIzbora: string = "";
  public proveraFajlIgre: string = "";
  public proveraMogucnostZamene: string = "";

  public postojeciBotovi: Bot[];
  public tipoviBotova: TipBota[];

  private izabraniTip: number;
  private botZaDodavanje: File;


  korisnici:Korisnik[]=[];
  izabraniBot:number;
  pomocna:number;

  ttpSlika:string;

  prikazivanjeDivaZaDodaj:number=0;
  daLiPostojiBot:number=0;
  daLiMozeDaDoda:number;
  daLiMozeDaSePrijavi:string="";
  daLiJePrijavljen: boolean;

  // *ngIf="daLiPostojiBot==0;then disabled;"

  //-------------Textovi--------------

  t1:string;
  t2:string;
  t3:string;
  t4:string;
  t5:string;
  t6:string;
  t7:string;
  t8:string;
  t9:string;
  t10:string;
  t11:string;
  t12:string;
  //-----------------------

  constructor
  (
    private toastr: ToastrService,
    private dialog: MatDialog,
    private turnirService: TurnirInfoService,
    private router:Router,
    private igreService:IgreInfoService,
    private botService: BotInfoService,
    private langService: MultilanguageService,
    private storageService: StorageService,
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
            this.t1=this.text._70; //A bot with that file name already exists, and has a different role than specified. Please change either bot or it's role. //proveraMogucnost zamene
            this.t2=this.text._75;//Successfully uploaded: //
            this.t3=this.text._500;//Please check bot
            this.t4=this.text._501;//Please select image for your player.
            this.t5=this.text._502;//Choose a file from your system to upload.
            this.t6=this.text._71;//Please fill in the required fields.
            this.t7=this.text._1093;//Successfully changed
            this.t8=this.text._504;//Changes failed
            this.t9=this.text._74;//Operation aborted
            this.t10=this.text._510;//imate prijavljene igrace
            this.t11=this.text._511;//los naziv igraca
            this.t12=this.text._512;//uspesno dodao igrace
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
        this.turnir=x;
        this.dajIgrace(); 
        this.DajKorisnika();
        this.UzmiBotove();
        this.UzmiTipoveBota();
        this.dajBrojBotovaZaKorisnikaNaTurniru();
        this.DaLiMozeDaDoda();
        this.daLiMozeDaDoda=0;
      }
    });

   
    this.server=environment.apiUrl;
    this.nijeCekiranBot="";
    this.ttpSlika=this.t4;//"Please select image for your player.";
    
    this.igraciKorisnika=[];
  }

  dajIgrace()
  {
    this.turnirService.dajIgraceZaTurnir(this.turnir.id_turnira)
    .subscribe((resp: any) =>
    { 
      //this.igraci = Korisnik.FromJsonToArray(resp);
      this.korisnici=Korisnik.FromJsonToArray(resp);
      //console.log(this.korisnici);
      this.SortirajKorisnike();
      let pom;
      pom = this.korisnici.find(x => x.id_korisnika == this.korisnik.id_korisnika);
      if(pom==null || pom==undefined)
        this.daLiJePrijavljen=true;
      else
        this.daLiJePrijavljen=false;
        
    });
  }

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

  IzbaciIgracaIzNiza(index:number)
  {

    this.igraciKorisnika.splice(index,1);
    //console.log(this.igraciKorisnika);
  }


  UzmiTipoveBota()
  {
    this.turnirService.dajTipoveBotova( this.igra.id_igre)
    .subscribe
    (
      (resp: any) =>
      { 
        
        this.tipoviBotova = TipBota.FromJsonToArray(resp);
        this.izabraniTip=this.tipoviBotova[0].id_tipa_bota;
      },
      (errorResp: any) =>
      {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
    );


    this.prikazivanjeDivaZaDodaj=0;
  }


  DajKorisnika() : void
  {
    let k = JSON.parse(localStorage.getItem('user'));
    this.korisnik=Korisnik.FromJson(k);
  }

  UzmiBotove()
  {
    this.turnirService.dajBotoveZaKorisnika(this.korisnik.id_korisnika, this.igra.id_igre)
      .subscribe
      (
        (resp: any) =>
        { 
          this.postojeciBotovi = Bot.FromJsonToArray(resp);
        },
        (errorResp: any) =>
        {
          console.log(errorResp);
          this.toastr.error(JSON.parse(errorResp._body).errorMessage);
        }
      );
  }

  dajBrojBotovaZaKorisnikaNaTurniru()
  {
   
    this.turnirService.dajBrojBotovaZaKorisnikaNaTurniru(this.korisnik.id_korisnika, this.turnir.id_turnira)
      .subscribe
      (
        (resp: any) =>
        { 
          
          this.daLiPostojiBot=resp[0].broj;
        },
        (errorResp: any) =>
        {
          console.log(errorResp);
          this.toastr.error(JSON.parse(errorResp._body).errorMessage);
        }
      );
  }

  DaLiMozeDaDoda()
  {
    if(this.igraciKorisnika.length==this.igra.broj_igraca || this.nazivIgraca=="" || this.cekiraniBot==null)
      this.daLiPostojiBot=1;
  }
  

//------------------------------------------DODAVANJE BOTA--------------------------------------------------------
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
        this.proveraMogucnostZamene = this.t1;
        return false;
      }
    }

    this.proveraMogucnostZamene = "";

    return true;
  }

  ProveraFajlIgre(): boolean
  {
    if (this.botZaDodavanje == null)
    {
      this.proveraFajlIgre = this.t5;//"Choose a file from your system to upload."
      return false;
    }

    this.proveraFajlIgre = "";
    return true;
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


  DodajBota()
  {
    this.prikazivanjeDivaZaDodaj=1;
  }


  IzvrsiDodavanje()
  {
    if (this.ProveraFajlIgre() && this.ProveraMogucnostZamene())
    {
      this.storageService.SetLoaderState(true);
      // Pravim objekat tipa Bot i saljem u zahtev.
      let bot: Bot = new Bot();
      bot.id_korisnika = this.korisnik.id_korisnika;
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

                this.prikazivanjeDivaZaDodaj=0;
              }

              this.prikazivanjeDivaZaDodaj = 0;

              setTimeout(() => 
              {
                this.storageService.SetLoaderState(false);
                this.toastr.success(this.t2+` ${resp.bot.putanja_do_fajla}`);
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
      this.toastr.error(this.t6);
    }
  }


//------------------------------------------------------Zavrseno dodavanje bota------------------------------------------

//------------------------------------------------------Dodavanje igraca---------------------------------

SlikaSelected(files: FileList)
{
  this.slikaZaDodavanje = files.item(0);
}
/*
  Snimi()
  {

    if(this.cekiraniBot==null)
      this.nijeCekiranBot=this.t3;//"Please check bot";
    else if(this.proveraNazivaIgraca=="" && this.slikaZaDodavanje!=null)
    {
      let igrac = new Igrac();
      igrac.id_bota=parseInt(this.cekiraniBot);
      igrac.id_korisnika=this.korisnik.id_korisnika;
      igrac.naziv_igraca=this.nazivIgraca;
      //igrac.slika_igraca=

    

    this.turnirService.dodajIgraca(igrac, this.slikaZaDodavanje,this.turnir)
        .subscribe
        (
          (resp: any) =>
          { 
            setTimeout( () => { this.loading = false; }, 1000 );
            if (resp.success)       // Ako je dodat
            {
              this.toastr.success(this.t2);
              this.ngOnInit();
            }
            
          }, 
          (errorResp: any) =>
          {
            setTimeout( () => { this.loading = false; }, 1000 );
            setTimeout(() => this.toastr.error(JSON.parse(errorResp._body).errorMessage) , 1000);
          }
        );


    }
    



  }
*/
//----------------------------------------------zavrseno dodavanje igraca-------------------------------------
  


  //---------------PROVERE------------------
  ProveraNazivaIgraca()
  {
    
    var re = /^[a-zA-Z0-9_.\\-]{3,10}$/;
    this.proveraNazivaIgraca="";
    var odgovorRe=re.test(this.nazivIgraca);
    if(this.nazivIgraca.length<3 || this.nazivIgraca.length>10)
    {
      this.proveraNazivaIgraca=this.t11;
    }
      
    else
    {
      this.proveraNazivaIgraca="";
    }
      
  }



  ZatvoriDodajBota()
  {
    this.prikazivanjeDivaZaDodaj=0;
  }


  obrisiKorisnika(id_korisnika:number)
  {
    let tekst = this.text._1541;
   
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
          this.turnirService.obrisiIgraca(id_korisnika,this.turnir.id_turnira).subscribe
          (
              (resp: any) =>
              {
                setTimeout(() => 
                { 
                  this.storageService.SetLoaderState(false);
                  this.toastr.success(this.t7);
                  this.ngOnInit();
                }, 1000);
              },
              (errorResp: any) =>
              {
                setTimeout(() => 
                { 
                  this.storageService.SetLoaderState(false);
                  setTimeout(() => this.toastr.error(this.t8) , 1000);
                }, 1000);
              }
          );
        }
        else
        {
          this.toastr.info(this.t9);
        }
      });
  }

  DodajIgraca()
  {
    if(this.nazivIgraca != "" && this.cekiraniBot != null)
    {
      let igrac:Igrac = new Igrac();
      igrac.naziv_igraca=this.nazivIgraca;
      igrac.id_bota=parseInt(this.cekiraniBot);
      igrac.id_korisnika=this.korisnik.id_korisnika;
      igrac.putanja_do_fajla=this.postojeciBotovi.find(x=> x.id_bota == igrac.id_bota).putanja_do_fajla;
      igrac.naziv_tipa_bota=this.postojeciBotovi.find(x=> x.id_bota == igrac.id_bota).naziv_tipa_bota;
      //novi.naziv_tipa_bota = this.tipoviBotova.find(x => x.id_tipa_bota == novi.id_tipa_bota).naziv_tipa_bota;


      this.igraciKorisnika.push(igrac);
      if(this.igraciKorisnika.length==this.igra.broj_igraca)
        this.daLiMozeDaDoda=1;
      this.nazivIgraca="";
      this.cekiraniBot=null;
    }
    
  }


/*
  obrisiIgraca(id_igraca:number)
  {
    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent);

   
    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
      if (res == true)
      {

        for (var _i = 0; _i < this.igraciKorisnika.length; _i++)
        if(this.igraciKorisnika[_i]!=null && this.igraciKorisnika[_i].id_igraca==id_igraca)
        {
          this.igraciKorisnika[_i]=null;
          break;
        }  
      }
      
    });


  }
  */
  


  PrijaviSeNaTurnir()
  {
    let tekst = this.text._1540;
    let pom=0;
    for(let i of this.korisnici)
      if(i.id_korisnika==this.korisnik.id_korisnika)
        pom=1;
      
    if(pom==1)
    {
      this.daLiMozeDaSePrijavi=this.t10;
    }
    else
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
          // Uzimam samo one botove koji su cekirani i saljem ih na brisanje.
          //let botoviZaBrisanje: Bot[] = this.postojeciBotovi.filter(x => this.cekiraniBotovi.find(y => y == x.id_bota) !== undefined);
          this.storageService.SetLoaderState(true);

          this.turnirService.dodajIgrace(this.igraciKorisnika,this.turnir).subscribe
          (
            (resp: any) =>
            { 
              setTimeout(() => 
              { 
                this.storageService.SetLoaderState(false); 
                this.toastr.success(this.t12);
                this.ngOnInit();
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
  }



}
