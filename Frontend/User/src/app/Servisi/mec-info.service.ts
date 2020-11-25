import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import "rxjs/add/operator/map";

import { StorageService } from '../Servisi/storage.service';
import { MultilanguageService } from '../Servisi/multilanguage.service';

import { AuthService } from '../Servisi/auth.service';

@Injectable()
export class MecInfoService {

  constructor
  (
    private authService: AuthService,
    private http: Http,
    private toastr: ToastrService,
    private router: Router,
    private langService: MultilanguageService,
    private storageService: StorageService
  ) { }


  IgraciInformacije(id_meca: number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/mecevi/igraci", {"id_meca": id_meca}, {headers:headers}).map(res => res.json());
  }
  
  KretanjeMeca(id_meca: string)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/mecevi/kretanje", {"id_meca": id_meca}, {headers:headers}).map(res => res.json());
  }

  VratiPozadinuIgre(id_bota: number)
  {
    var headers = this.authService.BuildHeaders();
    return this.http.post(environment.apiUrl+"/mecevi/pozadinaPoBotu", {"id_bota": id_bota}, {headers:headers}).map(res => res.json());
  }

}
