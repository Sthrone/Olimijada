import { Component, OnInit, ViewChild } from '@angular/core';
import { UserInfoService } from '../../../Servisi/user-info.service';
import { Korisnik } from '../../../Klase/korisnik';
import { MatTableDataSource, MatSort} from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AdministracijaKorisnikaDialogComponent } from '../../Dijalozi/administracija-korisnika-dialog/administracija-korisnika-dialog.component';
import { BanUserComponent } from '../../Dijalozi/ban-user/ban-user.component';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-lista-korisnika',
  templateUrl: './lista-korisnika.component.html',
  styleUrls: ['./lista-korisnika.component.css']
})
export class ListaKorisnikaComponent implements OnInit 
{
  text:any;
  server:String;
  kk:String[] = [];

  korisnik:Korisnik;
  sviKorisnici: Korisnik[] = [];
  korisnici:Korisnik[] = [];

  administracijaKorisnika: MatDialogRef<AdministracijaKorisnikaDialogComponent>;
  banKorisnika: MatDialogRef<BanUserComponent>;

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
    this.userInfo.PokupiKorisnike()
    .subscribe((resp: any) =>
    {
      this.sviKorisnici = Korisnik.FromJsonToArray(resp);
      this.sviKorisnici.sort();

      for (let i=0 ; i<this.sviKorisnici.length ; i++)
        this.korisnici.push(this.sviKorisnici[i]);

      this.korisnik = this.korisnici[0];
      
      /*
      this.korisnici = Korisnik.FromJsonToArray(resp);   
      this.korisnici.sort();  
      */
    });
    
    this.server=environment.apiUrl; 
  }

  SelektujKorisnika(korisnik:Korisnik)
  {
    this.router.navigate(['/admin/pregledKorisnika/'+korisnik.id_korisnika]);
  } 

  otvoriPopUp(rec: string, id: number, ime: string, tip: number)
  {
    if(rec === "administracija")
    {
      this.administracijaKorisnika = this.dialog.open(AdministracijaKorisnikaDialogComponent, {
        width: '500px',
        data: {
         id, ime, tip
        }
      });

      this.administracijaKorisnika.afterClosed().subscribe(result => {
        if(result === true)
        {
          this.toastr.success(`${this.text._1526}`);
          this.ngOnInit();
        }
        else
        {
          //this.toastr.error(`${this.text._1527}`);
        } 
      });
    }
    else if (rec === "ban") {
      this.banKorisnika = this.dialog.open(BanUserComponent, {
        width: '700px',
        data: {
          id, ime, tip
        }
      });

      this.banKorisnika.afterClosed().subscribe(result => {
        if (result === true) 
        {
          this.toastr.success(`${this.text._1530}`);
          this.ngOnInit();
        }
        else {
          //this.toastr.error(`${this.text._1527}`);
        }
      });

    }
  }

  IzvrsenaPretraga(filtriraniKorisnici)
  {
    this.korisnici = filtriraniKorisnici;
  }

}
