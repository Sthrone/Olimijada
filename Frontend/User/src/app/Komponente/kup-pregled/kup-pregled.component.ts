import { Component, OnInit } from '@angular/core';
import { Mec } from '../../Klase/mec';
import { Igra } from '../../Klase/igra';
import { Turnir } from '../../Klase/turnir';
import { TurnirInfoService } from '../../Servisi/turnir-info.service';
import { IgreInfoService } from '../../Servisi/igre-info.service';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment'
import { BotInfoService } from '../../Servisi/bot-info.service';
import { Bot } from '../../Klase/bot';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { Igrac } from '../../Klase/igrac';

@Component({
  selector: 'app-kup-pregled',
  templateUrl: './kup-pregled.component.html',
  styleUrls: ['./kup-pregled.component.css']
})
export class KupPregledComponent implements OnInit 
{
  igra: Igra;
  text: any;

  igraci1:Igrac[]=[];
  igraci2:Igrac[]=[];

  public server: string;
  public naziv_igre: string = "";
  public id_igre: number;
  public indikator: boolean = false;

  public bot: Bot;
  public botovi1: Bot[];
  public botovi2: Bot[];
  public mec: Mec;
  public turnir: Turnir;
  public pom: string = "MECHAK";

  public slika: string;

  public s_takmicar1: string;
  public s_takmicar2: string;
  public s_takmicar3: string;
  public s_takmicar4: string;

  public s_avatar1: string = "";
  public s_avatar2: string = "";
  public s_avatar3: string = "";
  public s_avatar4: string = "";

  public s_skor1: any;
  public s_skor2: any;
  public s_skor3: any;
  public s_skor4: any;

  public s_id1: number;
  public s_id2: number;
  public s_id3: number;
  public s_id4: number;

  public s_datum1: any;
  public s_datum2: any;

  public g_takmicar1: string;
  public g_takmicar2: string;

  public g_skor1: any;
  public g_skor2: any;

  public g_avatar1: string;
  public g_avatar2: string;

  public g_id1: number;
  public g_id2: number;

  public g_datum: any;

  public niz_meceva: Mec[];

  aori: string;

  constructor
  (
    private igreService: IgreInfoService,
    private turnirService: TurnirInfoService,
    private router: Router,
    private toastr: ToastrService,
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
    ((val) => 
    {
        this.langService.getJSON(val).subscribe
        ((data) => 
        {
          this.text = data;
        });
    });
  }

  ngOnInit() 
  {
    this.turnirService.izabranTurnir$.subscribe((x) => 
    {
      if (x == null)
      {
        this.router.navigate(['index/igra/' + this.igra.id_igre + '/turniri']);
      }
      else 
      {
        this.turnir = x;
        this.turnirService.podaciZaTurnir(this.turnir.id_turnira).subscribe
          (
          (resp: any) => {
            this.niz_meceva = resp;
            this.naziv_igre = resp[0].naziv_igre;
            this.id_igre = resp[0].id_igre;
            this.popuniSemifinale();
            this.popuniZlato();
          },
          (errorResp: any) => {
            console.log(errorResp);
            this.toastr.error(JSON.parse(errorResp._body).errorMessage);
          }
          );
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

  PogledajKorisnika(idKorisnika:number)
  {
    this.router.navigate([this.aori + "/pregledKorisnika/" + idKorisnika]);
  }


  id_mecha: number;

  nadjiIdMecha(id_korisnika1: number, id_korisnika2: number)
  {
    for(let i=0; i<this.niz_meceva.length; i++)
    {
      if(this.niz_meceva[i].id_korisnika == id_korisnika1)
      {
        for(let j=0; j<this.niz_meceva.length; j++)
        {
          if(this.niz_meceva[i].id_meca == this.niz_meceva[j].id_meca && this.niz_meceva[j].id_korisnika == id_korisnika2)
          {
            return this.niz_meceva[j].id_meca;
          }
        }
      }
    }
  }

  popuniZlato() 
  {
    for (let i = 0; i < this.niz_meceva.length; i++) {
      if (this.niz_meceva[i].runda == 2) {
        if (this.niz_meceva[i].pozicija == 1) 
        {
          this.g_skor1 = this.niz_meceva[i].ucinak;
          this.g_takmicar1 = this.niz_meceva[i].korisnicko_ime;
          this.g_datum = this.niz_meceva[i].vreme_pocetka;
          this.g_avatar1 = this.niz_meceva[i].avatar;
          this.g_id1 = this.niz_meceva[i].id_korisnika;
        }
        else 
        {
          this.slika = this.niz_meceva[i].avatar;
          this.g_skor2 = this.niz_meceva[i].ucinak;
          this.g_takmicar2 = this.niz_meceva[i].korisnicko_ime;
          this.g_avatar2 = this.niz_meceva[i].avatar;
          this.g_id2 = this.niz_meceva[i].id_korisnika;
        }
      }
    }
  }

  popuniSemifinale() {
    for (let i = 0; i < this.niz_meceva.length; i++) {
      if (this.niz_meceva[i].runda == 1) {
        if (this.niz_meceva[i].pozicija == 1) {
          this.s_takmicar1 = this.niz_meceva[i].korisnicko_ime;
          this.s_skor1 = this.niz_meceva[i].ucinak;
          this.s_datum1 = this.niz_meceva[i].vreme_pocetka;
          this.s_avatar1 = this.niz_meceva[i].avatar;
          this.s_id1 = this.niz_meceva[i].id_korisnika;
        }
        else if (this.niz_meceva[i].pozicija == 2) {
          this.s_takmicar2 = this.niz_meceva[i].korisnicko_ime;
          this.s_skor2 = this.niz_meceva[i].ucinak;
          this.s_avatar2 = this.niz_meceva[i].avatar;
          this.s_id2 = this.niz_meceva[i].id_korisnika;
        }
        else if (this.niz_meceva[i].pozicija == 3) {
          this.s_takmicar3 = this.niz_meceva[i].korisnicko_ime;
          this.s_skor3 = this.niz_meceva[i].ucinak;
          this.s_avatar3 = this.niz_meceva[i].avatar;
          this.s_datum2 = this.niz_meceva[i].vreme_pocetka;
          this.s_id3 = this.niz_meceva[i].id_korisnika;
        }
        else (this.niz_meceva[i].pozicija == 4)
        {
          this.s_takmicar4 = this.niz_meceva[i].korisnicko_ime;
          this.s_avatar4 = this.niz_meceva[i].avatar;
          this.s_skor4 = this.niz_meceva[i].ucinak;
          this.s_id4 = this.niz_meceva[i].id_korisnika;
        }
      }
    }
  }


  pobedio(broj: number) {
    if (broj == 1) {
      if (this.s_skor1 > this.s_skor2)
        return "tournament-bracket__team--winner";
      else
        return "";
    }
    else if (broj == 2) {
      if (this.s_skor1 < this.s_skor2)
        return "tournament-bracket__team--winner";
      else
        return "";
    }
    else if (broj == 3) {
      if (this.s_skor3 > this.s_skor4)
        return "tournament-bracket__team--winner";
      else
        return "";
    }
    else if (broj == 4) {
      if (this.s_skor3 < this.s_skor4)
        return "tournament-bracket__team--winner";
      else
        return "";
    }
    else if (broj == 11) {
      if (this.g_skor1 > this.g_skor2)
        return "tournament-bracket__team--winner";
      else
        return "";
    }
    else if (broj == 12) {
      if (this.g_skor1 < this.g_skor2)
        return "tournament-bracket__team--winner";
      else
        return "";
    }
  }


  pobednik() {
    if (this.g_skor1 > this.g_skor2)
      return this.g_takmicar1;
    else if(this.g_skor1 < this.g_skor2)
      return this.g_takmicar2;
    else if (this.g_skor1 == "" || this.g_skor1 == null)
      return "";
  }

  public takmicar1: string;
  public takmicar2: string;
  public skor1: any;
  public skor2: any;
  public datum: any;
  public slika1: string;
  public slika2: string;
  public id1: number;
  public id2: number;
  pom1: string = "";
  pom2: string = "";

  izabraniMec(takmicar1: string, takmicar2: string, skor1: any, skor2: any, datum: Date, id_takmicar1: number, id_takmicar2: number, slika1: string, slika2: string) 
  {
    if(skor1 > skor2)
    {
      this.pom1 = "pobednik";
      this.pom2 = "gubitnik";
    }
    else
    {
      this.pom1 = "gubitnik";
      this.pom2 = "pobednik";
    }
    
    if (skor1 == "" || skor2 == "" || skor1 == null || skor2 == null) 
    {
      this.indikator = false;
    }
    else 
    {
      this.indikator = true;
      this.takmicar1 = takmicar1;
      this.takmicar2 = takmicar2;
      this.skor1 = skor1;
      this.skor2 = skor2;
      this.datum = datum;
      this.slika1 = slika1;
      this.slika2 = slika2;
      this.id1 = id_takmicar1;
      this.id2 = id_takmicar2;
    }

    this.botService.BotoviZaIgru(id_takmicar1, this.id_igre).subscribe
      (
      (resp: any) => {
        this.botovi1 = Bot.FromJsonToArray(JSON.parse(resp.botovi));
      },
      (errorResp: any) => {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
      );

    this.botService.BotoviZaIgru(id_takmicar2, this.id_igre).subscribe
      (
      (resp: any) => {
        this.botovi2 = Bot.FromJsonToArray(JSON.parse(resp.botovi));
      },
      (errorResp: any) => {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
      );

      this.id_mecha = this.nadjiIdMecha(id_takmicar1, id_takmicar2);

      // ------------------ POSLE HAOSA -------------------

      this.turnirService.DajIgraceKorisnikaZaTurnir(id_takmicar1, this.turnir.id_turnira).subscribe
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

    this.turnirService.DajIgraceKorisnikaZaTurnir(id_takmicar2, this.turnir.id_turnira).subscribe
      (
      (resp: any) => {
        this.igraci2 = Igrac.FromJsonToArray(resp);
      },
      (errorResp: any) => {
        console.log(errorResp);
        this.toastr.error(JSON.parse(errorResp._body).errorMessage);
      }
      );
  }

  prazno(skor: any)
  {
    if(skor == "" || skor == null)
      return "prazno";
    else  
      return "";
  }

  ZapocniMec()
  {
    this.igreService.StartMatch(this.aori, this.id_mecha);
  }

  ProveraDatumaOdigravanja():boolean
  {
    let danas = new Date(Date.now()).getTime();
    if (new Date(this.datum).getTime() <= danas)
    {
      return false;
    }
    else
      return true;
  }
}
