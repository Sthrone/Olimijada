import { Component, OnInit, ViewChild } from '@angular/core';
import { UserInfoService } from '../../Servisi/user-info.service';
import { Korisnik } from '../../Klase/korisnik';
import { MatTableDataSource, MatSort} from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AdministracijaKorisnikaDialogComponent } from '../Dijalozi/administracija-korisnika-dialog/administracija-korisnika-dialog.component';
import { BanUserComponent } from '../Dijalozi/ban-user/ban-user.component';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  p: any = 1;
  text: any;
  server: string;
  
  sviKorisnici: Korisnik[] = [];
  korisnici: Korisnik[] = [];
 
  constructor
  (
    private userInfo:UserInfoService,  
    private router:Router,
    private toastr: ToastrService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private dialog: MatDialog
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

  ngOnInit() 
  {
    this.userInfo.PokupiSortiraneKorisnike()
    .subscribe((resp: any) =>
    {
      this.sviKorisnici = Korisnik.FromJsonToArray(resp);
      
      for (let i=0 ; i<this.sviKorisnici.length ; i++)
        this.korisnici.push(this.sviKorisnici[i]);
    });
    
    this.server=environment.apiUrl; 
  }


  PrikaziKorisnika(idKorisnika:number)
  {
    this.router.navigate(["/index/pregledKorisnika/"+idKorisnika]);
  }

  IzvrsenaPretraga(filtriraniKorisnici)
  {
    this.korisnici = filtriraniKorisnici;
  }


}
