import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import "rxjs/add/operator/map";
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Igra } from '../Klase/igra'; 
import { Bot } from '../Klase/bot';
import { AuthService } from './auth.service';

@Injectable()
export class BotInfoService 
{

  constructor
  (
    private http: Http,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }


  BotoviZaIgru(idKorisnika: number, idIgre: number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/botovi/pronadji_botove", {'id_korisnika': idKorisnika, 'id_igre': idIgre}, {headers: headers}).map(res => res.json());
  }

  DodajBota(bot: Bot, fajlBota: File)
  {
    let formData: FormData = new FormData();
    formData.append('bot_info', JSON.stringify(bot));
    formData.append('bot', fajlBota, fajlBota.name);

    return this.http.post(environment.apiUrl+"/botovi/dodaj_bota", formData).map(res=>res.json());
  }

  ObrisiBotove(botovi: Bot[])
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/botovi/obrisi_botove", {'botovi': JSON.stringify(botovi)}, {headers: headers}).map(res => res.json());
  }

}
