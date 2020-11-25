import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import "rxjs/add/operator/map";
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Igra } from '../Klase/igra'; 
import { AuthService } from './auth.service';

@Injectable()
export class IgreInfoService 
{
  private izabranaIgra: Subject<Igra> = new BehaviorSubject<Igra>(null);
  izabranaIgra$ = this.izabranaIgra.asObservable();

  constructor
  (
    private http: Http,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }


  IzaberiIgru(igra: Igra)
  {
    this.izabranaIgra.next(igra);
  }

  // Omoguciti slanje dva argumenta: aori, id_meca.
  StartMatch(aori: string, id_meca: number)
  {
    window.open(environment.front + "/" + aori + "/game/" + id_meca, "_blank", "titlebar=no,status=no,menubar=no,toolbar=no,scrollbars=no,resizable=no,top=100,left=100,width=800,height=740");
  }

  // Omoguciti slanje jednog argumenta: naziv bota.
  StartTest(bot: string)
  {
    window.open(environment.front + "/index/test/" + bot, "_blank", "titlebar=no,status=no,menubar=no,toolbar=no,scrollbars=no,resizable=no,top=100,left=100,width=800,height=740");
  }

  PokupiIgre()
  {
    //var igre:Igra[];
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/igre", {}, {headers: headers}).map(res => res.json());
  }

  DajIgru(id_igre)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/nadjiIgru",{'id_igre':id_igre},{headers:headers}).map(res=>res.json());
  }

  DodajIgru(igra: Igra, sviTipoviBotova:string[] ,fajlIgre: File, slikaIgre: File, slikaPozadineIgre: File)
  {
    let formData: FormData = new FormData();
    formData.append('fajl_igre', fajlIgre, fajlIgre.name);
    
    if (slikaIgre != null)
      formData.append('slika_igre', slikaIgre, slikaIgre.name);
    
    if(slikaPozadineIgre != null)
      formData.append('slika_pozadine_igre', slikaPozadineIgre, slikaPozadineIgre.name);

    formData.append('tipovi_botova', JSON.stringify(sviTipoviBotova));
    formData.append('igra', JSON.stringify(igra));

    return this.http.post(environment.apiUrl+"/dodajIgru", formData).map(res=>res.json());
  }
  
  IzmeniIgru(igra: Igra, sviTipoviBotova:string[] ,fajlIgre: File, slikaIgre: File, slikaPozadineIgre: File)
  {
    if(slikaIgre == null)
    {
      slikaIgre = new File([""], "prazan.txt");
    }

    if(fajlIgre == null)
    {
      fajlIgre = new File([""], "prazan.txt");
    }

    if(slikaPozadineIgre == null)
    {
      slikaPozadineIgre = new File([""], "prazan.txt");
    }

    let formData: FormData = new FormData();
    formData.append('fajl_igre', fajlIgre, fajlIgre.name);
    formData.append('slika_igre', slikaIgre, slikaIgre.name);
    formData.append('slika_pozadine_igre', slikaPozadineIgre, slikaPozadineIgre.name);
    
    formData.append('igra', JSON.stringify(igra));
    formData.append('tipovi_botova', JSON.stringify(sviTipoviBotova));

    return this.http.post(environment.apiUrl+"/izmeniIgru", formData).map(res=>res.json());
  }

  SviTipoviIgara()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/dodajIgru/tipoviIgara", {}, {headers: headers}).map(res => res.json());
  }
  
  VratiNajigranijeIgre()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/najpopularnijeIgre", {}, {headers: headers}).map(res => res.json());
  }
  

  VratiIgreKorisnika(idKorisnika: number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/najpopularnijeIgreKorisnika", {'id_korisnika': idKorisnika}, {headers: headers}).map(res => res.json());
  }

  VratiTipoveIgracaZaIgru(idIgre: number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/botovi/dajTipoveBotova", {'id_igre': idIgre}, {headers: headers}).map(res => res.json());
  }


  Daj10NajigranijihIgaraSaTurnira()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/Najigranijih10IgaraSaTurnirima", {}, {headers: headers}).map(res => res.json());
  }

  PrvaIgraAlfabeta()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/nadjiIgru/alfabet", {}, {headers: headers}).map(res => res.json());
  }

}