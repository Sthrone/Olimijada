import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Korisnik } from '../Klase/korisnik';
import { AuthService } from './auth.service';

@Injectable()
export class KorisnickiProfilService {


  private izabraniKorisnik: Subject<Korisnik> = new BehaviorSubject<Korisnik>(null);
  izabraniKorisnik$ = this.izabraniKorisnik.asObservable();

 

  

  constructor
  (
    private http: Http,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

/*
  dajKorisnika(id_korisnika)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/nadjiKorisnika",{'id_korisnika':id_korisnika},{headers:headers}).map(res=>res.json());
  }
*/

  IzaberiKorisnika(korisnik: Korisnik)
  {
  this.izabraniKorisnik.next(korisnik);
  

 // let user = JSON.parse(localStorage.getItem('user'));
  

  }
  dajBrojBotova(id_korisnika)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/botovi/dajBrojBotova",{'id_korisnika':id_korisnika},{headers:headers}).map(res=>res.json());
  }


  dajBrojTurnira(id_korisnika)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/turniri/dajBrojTurniraZaKorisnika",{'id_korisnika':id_korisnika},{headers:headers}).map(res=>res.json());
  }

  proveraSifre(id_korisnika, lozinka)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/izmenaProfila/proveraSifre",{'id_korisnika':id_korisnika,'lozinka':lozinka},{headers:headers}).map(res=>res.json());
  }


  izmeniKorisnika(user: Korisnik,file:File)
  {
    let formData: FormData = new FormData();
    
    if(file==null)
    {
      file=new File([''],'prazan.txt');
    }
    
    formData.append('avatar', file, file.name);
    formData.append('user', JSON.stringify(user));
    return this.http.post(environment.apiUrl+"/izmenaProfila", formData).map(res=>res.json());
  }

  izmenaKorisnikaBezAvatara(user:Korisnik)
  {
    var headers=this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/izmenaProfila/izmenaBezSlike",{'user':user},{headers:headers}).map(res=>res.json());
  }

}
