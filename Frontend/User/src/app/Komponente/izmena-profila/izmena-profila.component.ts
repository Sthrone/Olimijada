import { Component, OnInit, Input } from '@angular/core';
import { Korisnik } from '../../Klase/korisnik';
import { ActivatedRoute } from '@angular/router';
import { KorisnickiProfilService } from '../../Servisi/korisnicki-profil.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { YesNoDialogComponent } from '../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TooltipPosition } from '@angular/material/tooltip';

import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { UserInfoService } from '../../Servisi/user-info.service';

@Component({
  selector: 'app-izmena-profila',
  templateUrl: './izmena-profila.component.html',
  styleUrls: ['./izmena-profila.component.css']
})
export class IzmenaProfilaComponent implements OnInit 
{
  korisnik: Korisnik;
  korisnikPom:Korisnik;
  server:String;
  hoverSlika: string = "";

  organizacija:string;
  staraLozinka:string;
  korisnickoIme:string;
  email:string; 
  novaLozinka: string;
  novaLozinka2: string;

  uspelo:string="Success!";
 //poklapanjeSifri: string = "Entered passwords do not match.";
 // losaSifra: string = "The password needs to contain at least 8 characters and at least: 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character.";
  //losEmail: string = "Invalid email entered.";
  //losUsername: string = "Username must be 6-12 characters long.";
  //losaStaraSifra:string = "This password is not correct";
  //losaOrganizacija:string = "Organisation must be maximum 50 caracters long.";
  
  nijeIzabranaDrzava:string;
  proveraSifre: string;
  proveraPoklapanjaSifri: string;
  proveraKorisnickogImena: string;
  proveraEmail: string;
  proveraStareSifre:string;
  daLiJeNasaoSifru:number;
  organizacijaProvera:string="";

  validno:boolean=false;
  validno1:boolean=false;
  validno2:boolean=false;
  validno3:boolean=false;
  validno4:boolean=false;
  validno5:boolean=false;
  
  drzavaPitanje=false;
  organizacijaPitanje=false;
  fileToUpload:File=null;
  brojBotova:number;
  brojTurnira:number;

  yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;

  losUsername1 : string;
  losUsername2 : string;
  losEmail1 : string;
  losEmail2 : string;


  @Input('matTooltipPosition')
  position: TooltipPosition = "right";

  countries = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal","Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];

  text:any;

  constructor
  (
    private userInfoService: UserInfoService, 
    private route : ActivatedRoute,
    private korisnickiProfil: KorisnickiProfilService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private langService: MultilanguageService,
    private storageService: StorageService
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
            this.hoverSlika=this.text._27;
            this.losUsername1 = this.text._1015;
            this.losUsername2 = this.text._572;
            this.losEmail1 = this.text._1014;
            this.losEmail2 = this.text._1092;
          }
        );
      }
    );
  }

  ngOnInit() {
    this.DajKorisnika();
    this.dajBrojBotova();
    this.dajBrojTurnira();
    this.server=environment.apiUrl;
      if(this.korisnik.drzava!=null)
    this.drzavaPitanje=true;
      if(this.korisnik.organizacija!=null)
    this.organizacijaPitanje=true;
    this.novaLozinka = "";
    this.novaLozinka2 = "";
    
  }
//---------------------------------------------




  onFileSelected(files: FileList)
  {
    this.fileToUpload = files.item(0);
    this.readURL(files);
    this.hoverSlika=this.text._576;
  }


  dajBrojBotova()
  {
    this.korisnickiProfil.dajBrojBotova(this.korisnik.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          this.brojBotova=resp[0].broj;
        }
    );
  }

  dajBrojTurnira()
  {
    this.korisnickiProfil.dajBrojTurnira(this.korisnik.id_korisnika).subscribe
    (
        (resp: any) =>
        {
          this.brojTurnira=resp[0].broj;
         
        }
    );
  }




//-----------------------------------------------

  DajKorisnika() : void
  {
    let k = JSON.parse(localStorage.getItem('user'));
    this.korisnik=Korisnik.FromJson(k);
    this.korisnikPom=Korisnik.FromJson(k);
  
    this.korisnikPom.lozinka="";
    this.nijeIzabranaDrzava="";
    this.proveraSifre= "";
    this.proveraPoklapanjaSifri = "";
    this.proveraKorisnickogImena= "";
    this.proveraEmail= "";
    this.proveraStareSifre="";
  }

  Resetuj()
  {
    let tekst = this.text._1539;

    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
       tekst
      }
    });
    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
       if (res == true)
        this.ngOnInit();
    
    else
      {
        this.toastr.info("Operation aborted.");
      }
    });
    
  }

  
  readURL(input) {
  
        var reader = new FileReader();

 
        
        reader.onload = (function(f) {
          
            $('#slikaKorisnika').attr('src',this.result);

      });
        reader.readAsDataURL(input.item(0));
    
}



//------------PROVERE---------------------------

  proveraDrzave()
  {
    this.validno5=false;
    if (this.korisnikPom.drzava == undefined || this.korisnikPom.drzava.length <= 0)
    {
      this.nijeIzabranaDrzava = this.text._579;
      this.validno5=true;
      return false;
    }

    this.nijeIzabranaDrzava = "";
    this.validno5=false;
    return true;
  }
  

  ProveraSifreStare()
  {
    this.proveraStareSifre="";
    this.korisnickiProfil.proveraSifre(this.korisnikPom.id_korisnika,this.korisnikPom.lozinka).subscribe
    (
        (resp: any) =>
        {
          this.daLiJeNasaoSifru=resp[0].broj;
          this.validno=false;
          if(this.daLiJeNasaoSifru!=0)
          {
            this.validno=false
            //console.log('usepelo je '+this.korisnikPom.lozinka);
            this.proveraStareSifre="";
            
          }
          else
          {
            //console.log('nije uspelo -- '+this.korisnikPom.lozinka);
            this.validno=true;
            this.proveraStareSifre=this.text._577;
          }
        }
    );
    
  }
 


  ProveraEmail()
  {
    //var re = /[čćđšža-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[čćđšža-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[čćđšža-z0-9](?:[čćđšža-z0-9-]*[čćđšža-z0-9])?\.)+[čćđšža-z0-9](?:[čćđšža-z0-9-]*[čćđšža-z0-9])?/;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.validno=false;
    var odgovorRe=re.test((this.korisnikPom.email).toLowerCase());
    if(odgovorRe==false)
    {
      this.validno1=true;
      this.proveraEmail=this.losEmail1;
    }
    else
    {
     
      this.validno1=false;
      this.proveraEmail="";
      if(this.korisnikPom.email!=this.korisnik.email)
        this.userInfoService.ProveraPostojanjaEmaila(this.korisnikPom.email).subscribe
        (
            (resp: any) =>
            {
              
              if(resp[0].broj != 0)
                this.proveraEmail = this.losEmail2;
              else
                this.proveraEmail = "";
            },
        );
    }
      
  }

  ProveraOrganizacije()
  {
    
    this.organizacijaProvera="";
    if(this.korisnikPom.organizacija.length > 50)
    {
      
      this.organizacijaProvera=this.text._578;
    }
    else
    {
      this.organizacijaProvera="";
    }
  }


  ProveraKorisnickogImena()
  {
    
    var re = /^[ČčĆćĐđŠšŽža-zA-Z0-9_.\\-]{6,12}$/;
    this.validno=false;
    var odgovorRe=re.test(this.korisnikPom.korisnicko_ime);
    if(odgovorRe==false)
    {
      this.proveraKorisnickogImena=this.losUsername1;
      this.validno2=true;
    }
      
    else
    {
      this.proveraKorisnickogImena="";
      this.validno2=false;
      this.userInfoService.ProveraPostojanjaUsername(this.korisnikPom.korisnicko_ime).subscribe
      (
          
          (resp: any) =>
          {
            
            if(resp[0].broj != 0)
              this.proveraKorisnickogImena = this.losUsername2;
          },
      );
    }
      
  }

  ProveraSifre()
  {
    //console.log(this.proveraSifre);
    //console.log(this.novaLozinka);
    this.proveraSifre = "";
    var re = /^(?=.*[čćđšža-z])(?=.*[ČĆĐŠŽA-Z])(?=.*[0-9])(?=.{8,})/;
    this.validno=false;
    var odogovorRe = re.test(this.novaLozinka);
    if(odogovorRe==false || this.korisnikPom.lozinka=="")
    {
      this.proveraSifre=this.text._1013;
      this.validno3=true;
    }
    else
    {
      this.proveraSifre="";
      this.validno3=false;
    }
    console.log(this.proveraSifre);
  }

  PoklapanjeSifri()
  {
    
    this.validno=false;
    if(this.novaLozinka!=this.novaLozinka2 || this.proveraSifre!="" || this.novaLozinka2=="")
    {

      this.proveraPoklapanjaSifri=this.text._93;
      this.validno4=true;
    }
    else
    {
      this.proveraPoklapanjaSifri="";
      this.validno4=false;
    }    
  }


  ProveraPostojanjaEmail()
  {
    this.userInfoService.ProveraPostojanjaEmaila(this.korisnikPom.email).subscribe
      (
          (resp: any) =>
          {
            
            if(resp[0].broj != 0)
              this.proveraEmail = this.text._571;
            else
              this.proveraEmail = "";
          },
      );
  }
//----------------- KRAJ PROVERA ------------------------

  Izmeni()
  {
    //this.ProveraPostojanjaEmail();
    var tekst=this.text._573;
    
    if(this.proveraEmail=="" && this.proveraKorisnickogImena=="" && this.proveraSifre=="" && this.proveraStareSifre=="" && this.proveraPoklapanjaSifri=="" && this.novaLozinka2!="")
    {
      this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
        data: {
         tekst
        }
      });

      this.korisnikPom.lozinka = this.novaLozinka;
 
      
      this.yesNoDialogRef.afterClosed().subscribe(res =>
      {
        if (res == true)
        {
          this.storageService.SetLoaderState(true); 
          this.korisnickiProfil.izmeniKorisnika(this.korisnikPom,this.fileToUpload).subscribe
          (
              (resp: any) =>
              {
                setTimeout(() => 
                { 
                  this.storageService.SetLoaderState(false);
                  this.toastr.success(this.text._1090);
                  resp.user.lozinka="";
                  resp.user.odgovor="";
                  localStorage.setItem('user', JSON.stringify(resp.user));
                  this.ngOnInit();

                }, 500);
              },
              (errorResp: any) =>
              {
                setTimeout(() => 
                { 
                  if (errorResp.greska != null)
                    this.toastr.error(this.text._1088);
                  else
                    this.toastr.error(this.text._1089);
        
                  this.storageService.SetLoaderState(false);
                }, 500);
              }
          );
        }
        else
        {
          this.toastr.info(this.text._1091);
        }
      });
    }
    else
      this.toastr.error(this.text._1095);
  }







}
