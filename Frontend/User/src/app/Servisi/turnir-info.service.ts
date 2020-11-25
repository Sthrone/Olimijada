import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import "rxjs/add/operator/map";

import { Turnir } from '../Klase/turnir'
import { AuthService } from '../Servisi/auth.service';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Igrac } from '../Klase/igrac';
import { Igra } from '../Klase/igra';

@Injectable()
export class TurnirInfoService 
{
  private izabranTurnir: Subject<Turnir> = new BehaviorSubject<Turnir>(null);
  izabranTurnir$ = this.izabranTurnir.asObservable();

  public gledanjeOtvoreno: boolean = false;
  public prijavljivanjeNaTurnir: boolean = false; 
  public pregledLige: boolean = false;
  public pregledNovogTurnriraAdmin: boolean = false;
  public obradaPrijaveAdmin: boolean = false;

  constructor
  (
    private http: Http,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }


  ZatvoriSve()
  {
    this.gledanjeOtvoreno = false;
    this.prijavljivanjeNaTurnir = false; 
    this.pregledLige = false;
    this.pregledNovogTurnriraAdmin = false;
    this.obradaPrijaveAdmin = false;

    this.IzaberiTurnir(null);
  }

  IzaberiTurnir(turnir: Turnir)
  {
    this.izabranTurnir.next(turnir);
  }

  DodajTurnir(turnir:Turnir)
  {
    var headers = this.authService.BuildHeaders(); 
    return this.http.post(environment.apiUrl+"/dodajTurnir", { 'turnir' :turnir },{headers: headers}).map(res => res.json());
  }

  DajTurnire(id_igre:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/turniri/dajTurnire", {'id_igre':id_igre}, {headers: headers}).map(res => res.json());
  }

  dajIgraceZaTurnir(id_turnira:number)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/igraci/dajKorisnikeZaTurnir",{'id_turnira':id_turnira},{headers:headers}).map(res=>res.json());
  }

  dajBotoveZaKorisnika(idKorisnika:number,idIgre:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/turniri/dajBotoveZaKorisnika", {'id_korisnika': idKorisnika, 'id_igre': idIgre}, {headers: headers}).map(res => res.json());
  }

  dajTipoveBotova(idIgre : number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/botovi/dajTipoveBotova", { 'id_igre': idIgre}, {headers: headers}).map(res => res.json());
  }

  dodajIgrace(igraci:Igrac[], turnir:Turnir)
  {
   /* let formData: FormData = new FormData();
    formData.append('avatar', file, file.name);
    formData.append('igrac', JSON.stringify(igrac));
    formData.append('turnir', JSON.stringify(turnir));*/
    return this.http.post(environment.apiUrl+"/dodavanjeIgraca",{'igraci':JSON.stringify(igraci), 'turnir':JSON.stringify(turnir)}).map(res=>res.json());
  }
  
  dajBrojBotovaZaKorisnikaNaTurniru(idKorisnika : number,idTturnira:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/igraci/dajBrojBotovaZaKorisnikaNaTurniru", {'id_korisnika': idKorisnika, 'id_turnira': idTturnira}, {headers: headers}).map(res => res.json());
  }

  obrisiIgraca(idKorisnika : number, idTurnira:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/turniri/obrisiKorisnikaSaTurnira", {'id_korisnika': idKorisnika,'id_turnira':idTurnira}, {headers: headers}).map(res => res.json());
  }

  podaciZaTurnir(id_turnira: number)
  {
    this.gledanjeOtvoreno = true;
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pregledTurnira", {'id_turnira': id_turnira}, {headers: headers}).map(res => res.json());
  }


  MeceviZaTurnir(id_turnira:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pregledTurnira/meceviSaTurniraLiga", {'id_turnira': id_turnira}, {headers: headers}).map(res => res.json());
  }
  
  DajMeceveSaRezultatima(id_turnira:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/turniri/dajMeceveSaRezultatima", {'id_turnira': id_turnira}, {headers: headers}).map(res => res.json());
  }
  
  DajTabelu(id_turnira:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/turniri/dajTabelu", {'id_turnira': id_turnira}, {headers: headers}).map(res => res.json());
  }

  DajIgraceKorisnikaZaTurnir(idKorisnika: number ,idTurnira:number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/igraci/dajIgraceKorisnikaZaTurnir", {'id_korisnika': idKorisnika,'id_turnira': idTurnira}, {headers: headers}).map(res => res.json());
  }

  ProduziPeriod(turnir: Turnir)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/obradaPrijava/produziPrijavu", {'turnir': turnir}, {headers: headers}).map(res => res.json());
  }

  ObrisiTurnir(turnir: Turnir)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/obradaPrijava/obrisiTurnir", {'turnir': turnir}, {headers: headers}).map(res => res.json());
  }

  VratiPrijavljeneTurnireKorisnika(id_korisnika: number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/prijavljeniTurniri", {'id_korisnika': id_korisnika}, {headers: headers}).map(res => res.json());
  }

  VratiTurnireZaKorisnika(igre: Igra[])
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/turniriZaKorisnika", {'igre': JSON.stringify(igre)}, {headers: headers}).map(res => res.json());
  }

  VratiTurnireNedovoljno()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/neuspesniTurniri", {}, {headers: headers}).map(res => res.json());
  }

  VratiZadnjih10TurniraOdigranih()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/zadnjih10Turnira", {}, {headers: headers}).map(res => res.json());
  }

  BrojKorisnikaPoTurniru()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/turniri/brojKorisnikaPoTurniru", {}, {headers: headers}).map(res => res.json());
  }

  VratiZadnjih10MecevaOdigranihZaKorisnika(id: number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/zadnjih10mecevaZaKorisnika", {'id_korisnika': id}, {headers: headers}).map(res => res.json());
  }
}
