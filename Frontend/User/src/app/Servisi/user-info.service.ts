import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import "rxjs/add/operator/map";
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Korisnik } from '../Klase/korisnik'

import { AuthService } from '../Servisi/auth.service';
import { StorageService } from '../Servisi/storage.service';
import { MultilanguageService } from '../Servisi/multilanguage.service';
import { TurnirInfoService } from '../Servisi/turnir-info.service';


@Injectable()
export class UserInfoService 
{
  text:any;
  private izabranKorisnik: Subject<Korisnik> = new BehaviorSubject<Korisnik>(null);
  izabranKorisnik$ = this.izabranKorisnik.asObservable();

  constructor
  (
    private http: Http,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private turnirInfo: TurnirInfoService
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
  }


  RegistrujKorisnika(user: Korisnik, file: File)
  {
    let formData: FormData = new FormData();
    formData.append('avatar', file, file.name);
    formData.append('user', JSON.stringify(user));
    return this.http.post(environment.apiUrl+"/registracija", formData).map(res=>res.json());
  }


  PrijaviKorisnika(user: Korisnik)
  {
    var headers = this.authService.BuildHeaders();
    this.http.post(environment.apiUrl+"/prijava", JSON.stringify(user), {headers: headers}).map(res => res.json())
             .subscribe
             (
              (resp: any) =>
              {
                  if (resp.user.ban != null && resp.user.ban != "" && (new Date(resp.user.ban).getTime() > new Date().getTime()))
                  {
                    this.toastr.error(this.text._1046 + " " + resp.user.ban);
                    return;
                  }

                  this.storageService.SetLoaderState(true);

                  // Sesija
                  localStorage.setItem('user', JSON.stringify(resp.user));

                  // Autorizacija
                  this.authService.LoginState(true);
                  this.authService.SaveToken(resp.token);
                  
                  setTimeout(() => 
                  { 
                    this.storageService.SetLoaderState(false); 

                    // Poruka
                    this.toastr.success(` ${this.text._96}, ${resp.user.korisnicko_ime}`);

                    // Redirekcija korisnika
                    if (resp.user.id_tipa_korisnika == 1)   // Ako se ulogovao admin
                    {
                      this.router.navigate(['/admin']);
                    }
                    else                                    // Svi ostali korisnici
                    {
                      this.router.navigate(['/index']);
                    }

                  }, 1000);
              }, 
              (errorResp: any) =>
              {
                  this.authService.LoginState(false);
                  this.toastr.error(this.text._100);
              }
            );
  }

  
  OdjaviKorisnika()
  {
    if (this.authService.IsAuthenticated())
    {
      this.authService.DestroyToken();
    }

    this.authService.LoginState(false); 

    if (localStorage.getItem('user') != null)
    {
      let username = JSON.parse(localStorage.getItem('user')).korisnicko_ime;
      localStorage.removeItem('user');
      this.toastr.success(`${this.text._97}, ${username}`);
    }

    this.turnirInfo.ZatvoriSve();
    
    this.router.navigate(['/']);
  }


  IzbaciKorisnika()
  {
    if (this.authService.IsAuthenticated())
    {
      this.authService.DestroyToken();
    }

    this.authService.LoginState(false); 

    if (localStorage.getItem('user') != null)
    {
      let username = JSON.parse(localStorage.getItem('user')).korisnicko_ime;
      localStorage.removeItem('user');
      this.toastr.error(`${this.text._1075}`);
    }

    this.turnirInfo.ZatvoriSve();
    
    this.router.navigate(['/']);
  }

  ProveraPostojanjaEmaila(email:string)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/registracija/proveriPostojanjeEmaila",{"email":email},{headers:headers}).map(res => res.json());
  }

  ProveraPostojanjaUsername(korisnicko_ime:string)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/registracija/proveriPostojanjeUsername",{"korisnicko_ime":korisnicko_ime},{headers:headers}).map(res => res.json());
  }

  PokupiKorisnike()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/izlistajKorisnike",{"key":"value"},{headers:headers}).map(res => res.json());
  }
  
  PokupiSortiraneKorisnike()
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/izlistajKorisnike/Sortirani",{},{headers:headers}).map(res => res.json());
  }


  VratiKorisnika(id_korisnika)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/nadjiKorisnika",{'id_korisnika':id_korisnika},{headers:headers}).map(res=>res.json());
  }
  

  IzaberiKorisnika(korisnik: Korisnik)
  {
    this.izabranKorisnik.next(korisnik);
  }

  PonovnaPrijava(korisnik: Korisnik)
  { 
    if (korisnik.ban != null && korisnik.ban != "" && (new Date(korisnik.ban).getTime() > new Date().getTime()))
    {
      this.OdjaviKorisnika();
      return;
    }
                  
    this.authService.LoginState(true);
    
    if ((!this.location.path().includes('game')) && (!this.location.path().includes('test')))
    {
      if ((!this.location.path().includes('index')) || (korisnik.id_tipa_korisnika != 1))
      {
        if (korisnik.id_tipa_korisnika == 1)
        {
          if (this.location.path().includes('admin'))
            this.router.navigate([this.location.path()]);
          else
            this.router.navigate(['/admin']);

          this.toastr.success(`${this.text != null ? this.text._96 : "Welcome"}, ${korisnik.korisnicko_ime}`);
        }
        else
        {
          if (this.location.path().includes('index'))
            this.router.navigate([this.location.path()]);
          else
            this.router.navigate(['/index']);

          this.toastr.success(`${this.text != null ? this.text._96 : "Welcome"}, ${korisnik.korisnicko_ime}`);
        }
      }
    } 
  }


  VratiKorisnikeProtivKojihImaNajvisePobeda(id_korisnika)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/analiza/dajPobedeProtivKorisnika",{'id_korisnika':id_korisnika},{headers:headers}).map(res=>res.json());
  }

  VratiKorisnikeProtivKojihImaNajvisePoraza(idKorisnika : number)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/analiza/dajPorazeProtivKorisnika",{'id_korisnika':idKorisnika},{headers:headers}).map(res=>res.json());
  }

  DajPobedePorazeNeresenoZaKorisnika(idKorisnika : number)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/analiza/dajPobedePorazeNeresenoZaKorisnika",{'id_korisnika':idKorisnika},{headers:headers}).map(res=>res.json());
  }

  DajRejtingZaMesecDana(idKorisnika : number)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/analiza/dajRejtingZaMesecDana",{'id_korisnika':idKorisnika},{headers:headers}).map(res=>res.json());
  }

  izlistajZadnjih10Korisnika()
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/pocetna/zadnjih10Korisnika",{},{headers:headers}).map(res=>res.json());
  }

  BanujKorisnika(id: number, vreme: Date)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/izmenaProfila/banKorisnika",{'id_korisnika':id, 'vreme': vreme},{headers:headers}).map(res=>res.json());
  }

  PromeniTipKorisnika(id: number, tip: number)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/izmenaProfila/promeniTipKorisnika",{'id_korisnika': id, 'tip_korisnika': tip},{headers:headers}).map(res=>res.json());
  }

}
