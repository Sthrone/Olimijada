import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
import { TooltipPosition } from '@angular/material/tooltip';

import { Korisnik } from '../../Klase/korisnik';
import { UserInfoService } from '../../Servisi/user-info.service';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { YesNoDialogComponent } from '../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-registracija-korisnika',
  templateUrl: './registracija-korisnika.component.html',
  styleUrls: ['./registracija-korisnika.component.css']
})
export class RegistracijaKorisnikaComponent implements OnInit 
{
  k = new Korisnik();
  
  server: string;

  fileToUpload: File = null;
  sifra2: string;

  poklapanjeSifri: string;
  losaSifra: string;
  losEmail: string;
  losUsername: string;
  ponovljenUsername: string;
  ponovljenEmail: string;

  proveraSifre: string = "";
  proveraPoklapanjaSifri: string = "";
  proveraKorisnickogImena: string = "";
  proveraEmail: string = "";

  yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;
  @Input('matTooltipPosition')
  position: TooltipPosition = "right";

  ttp: string;
  text : any;
  
  constructor
  (
    private userInfoService: UserInfoService, 
    private router: Router,
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

            this.poklapanjeSifri = this.text._1012;
            this.losaSifra = this.text._1013;
            this.losEmail = this.text._1014;
            this.losUsername = this.text._1015;
            this.ttp = this.text._1016;
            this.ponovljenEmail = this.text._1092;
            this.ponovljenUsername = this.text._572;
          }
        );
      }
    );

    this.k = new Korisnik();
    this.k.korisnicko_ime = "";
    this.k.email = "";
    this.k.lozinka = "";
    this.sifra2 = "";
  }

  ngOnInit()
  {
    this.server = environment.apiUrl;
  }

  onFileSelected(files: FileList)
  {
    this.fileToUpload = files.item(0);
    this.readURL(files);
  }

  RegistracijaReg()
  {
    this.ProveraKorisnickogImena();
    this.ProveraEmail();
    this.ProveraSifre();
    this.PoklapanjeSifri();

    if
    (
      this.proveraPoklapanjaSifri=="" && 
      this.proveraSifre=="" && 
      this.proveraKorisnickogImena=="" && 
      this.proveraEmail=="" &&
      this.k.korisnicko_ime != null &&
      this.k.email != null && 
      this.k.lozinka != null &&
      this.k.korisnicko_ime != "" &&
      this.k.email != "" && 
      this.k.lozinka != ""
    )
    {
      this.storageService.SetLoaderState(true);

      this.k.id_tipa_korisnika = 2;
      this.k.odgovor = "";
      
      if (this.fileToUpload == null)
      {
        this.fileToUpload = new File([""], "prazan.txt");
      }

     this.userInfoService.RegistrujKorisnika(this.k, this.fileToUpload).subscribe((resp: any) =>
      {
        /*
        this.toastr.success(`${this.text._95} ${this.k.korisnicko_ime}`);
        this.router.navigate(['/prijava']);
        */
       
        this.proveraPoklapanjaSifri = ""; 
        this.proveraSifre = "";
        this.proveraKorisnickogImena = ""; 
        this.proveraEmail = "";
        
        setTimeout(() => 
        { 
          this.proveraPoklapanjaSifri = ""; 
          this.proveraSifre = "";
          this.proveraKorisnickogImena = ""; 
          this.proveraEmail = "";

          this.storageService.SetLoaderState(false);
          this.userInfoService.PrijaviKorisnika(this.k);

        }, 500);

      },
      (errorResp: any) =>
      {
        setTimeout(() => 
        { 
          this.storageService.SetLoaderState(false);

          if (errorResp.greska != null)
            this.toastr.error(this.text._1088);
          else
            this.toastr.error(this.text._1096);

        }, 500);
      });
    }
    else
      this.toastr.error(this.text._1096);
  }

  ProveraPostojanjaEmail()
  {
    this.proveraEmail = "";
    this.userInfoService.ProveraPostojanjaEmaila(this.k.email).subscribe
      (
          (resp: any) =>
          { 
            if(resp[0].broj != 0)
              this.proveraEmail = this.ponovljenEmail;
            else
              this.proveraEmail = "";
          },
      );
  }

  ProveraEmail()
  {
    //var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([ČčĆćĐđŠšŽža-zA-Z\-0-9]+\.)+[ČčĆćĐđŠšŽža-zA-Z]{2,}))$/;
    //var re = /[čćđšža-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[čćđšža-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[čćđšža-z0-9](?:[čćđšža-z0-9-]*[čćđšža-z0-9])?\.)+[čćđšža-z0-9](?:[čćđšža-z0-9-]*[čćđšža-z0-9])?/;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var odgovorRe = re.test(String(this.k.email).toLowerCase());
    if(odgovorRe == false)
      this.proveraEmail = this.losEmail;
    else
    {
      this.proveraEmail = "";
      this.userInfoService.ProveraPostojanjaEmaila(this.k.email).subscribe
      (
          (resp: any) =>
          { 
            if(resp[0].broj != 0)
              this.proveraEmail = this.ponovljenEmail;
            else
              this.proveraEmail = "";
          },
      );
    }
}

  ProveraKorisnickogImena()
  {
    var re = /^[ČčĆćĐđŠšŽža-zA-Z0-9_.\\-]{6,12}$/;
    var odgovorRe=re.test(this.k.korisnicko_ime);
    if(odgovorRe==false)
      this.proveraKorisnickogImena=this.losUsername;
    else
    {
      this.proveraKorisnickogImena="";
      this.userInfoService.ProveraPostojanjaUsername(this.k.korisnicko_ime).subscribe
      (
          (resp: any) =>
          {
            if(resp[0].broj != 0)
              this.proveraKorisnickogImena = this.ponovljenUsername;
            else
              this.proveraKorisnickogImena = "";
          },
      );
    }
  }

  ProveraSifre()
  {
    var re = /^(?=.*[čćđšža-z])(?=.*[ČĆĐŠŽA-Z])(?=.*[0-9])(?=.{8,})/;
    var odogovorRe = re.test(this.k.lozinka);
    if(odogovorRe==false)
    {
      this.proveraSifre=this.losaSifra;
    }
    else
      this.proveraSifre="";

    if (this.sifra2 != "")
      this.PoklapanjeSifri();
  }

  PoklapanjeSifri()
  {
    if(this.k.lozinka!=this.sifra2)
    {
      this.proveraPoklapanjaSifri=this.poklapanjeSifri;
    }
    else
      this.proveraPoklapanjaSifri = "";
  }

  readURL(input) 
  {
    var reader = new FileReader(); 
    reader.onload = (function(f) 
    {  
      $('#blah').attr('src',this.result);
    });

    reader.readAsDataURL(input.item(0));
  }

}
