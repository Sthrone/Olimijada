import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { TooltipPosition } from '@angular/material/tooltip';
import { YesNoDialogComponent } from '../../Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { Igra } from '../../../Klase/igra';
import { IgreInfoService } from '../../../Servisi/igre-info.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';
import { TipBota } from '../../../Klase/tip_bota';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-izmeni-igru',
  templateUrl: './izmeni-igru.component.html',
  styleUrls: ['./izmeni-igru.component.css']
})
export class IzmeniIgruComponent implements OnInit 
{
  text:any;
  igra: Igra;
  igraPom: Igra = new Igra();

  fajlIgre: File = null;
  slikaIgre: File = null;
  slikaPozadineIgre: File = null;
  tipovi: any = [];
  
  proveraNazivIgre: string = "";
  proveraBrojIgraca: string = "";
  proveraTrajanje: string = "";
  proveraTipIgre: string = "";
  proveraPravilaIgre: string = "";

  yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;

  tipoviIgaraPT:string[] = [];
  izabraniTipIgrePT:string = "";

  kratakOpisJezik: string;
  pravilaIgreJezik: string;


  @Input('matTooltipPosition')
  position: TooltipPosition = "right";
  public ttp_01: string;
  public ttp_02: string;
  public ttp_03: string;
  public server: string;

  tipoviBotova:any[]=[];
  tipBota:string;
  proveraBota:string = "";

  izabraniJezik: string = "en";

  constructor
  (
    private igreInfoService:IgreInfoService, 
    private router:Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private route : ActivatedRoute
  ) 
  {   
    this.igreInfoService.izabranaIgra$.subscribe((x) => 
    {
      if (x != null)
      {
        this.igra = x
        this.igraPom.id_igre = this.igra.id_igre;
        this.igraPom.naziv_igre = this.igra.naziv_igre;
        this.igraPom.broj_igraca = this.igra.broj_igraca;
        this.igraPom.pravila_igre_en = this.igra.pravila_igre_en;
        this.igraPom.pravila_igre_srb = this.igra.pravila_igre_srb;
        this.igraPom.putanja_do_fajla = this.igra.putanja_do_fajla;
        this.igraPom.trajanje_u_sekundama = this.igra.trajanje_u_sekundama;
        this.igraPom.id_tipa_igre = this.igra.id_tipa_igre;
        this.igraPom.slika_igre = this.igra.slika_igre;
        this.igraPom.naziv_tipa_igre = this.igra.naziv_tipa_igre;
        this.igraPom.kratak_opis_en = this.igra.kratak_opis_en;
        this.igraPom.kratak_opis_srb = this.igra.kratak_opis_srb;
        //if(this.igra.slika_pozadine_igre=='' || this.igra.slika_pozadine_igre==null)
          //this.igraPom.slika_pozadine_igre='default.jpg';
        this.igraPom.slika_pozadine_igre = this.igra.slika_pozadine_igre;
      }
      else  // Napravi zahtev za igrom.
      {
        let id = +this.route.snapshot.paramMap.get('id');
        this.igreInfoService.DajIgru(id).subscribe((x) =>
        {
          this.igreInfoService.IzaberiIgru(x);
        
        });
      }
    });
    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        if(val  == 'en')
        {
          this.kratakOpisJezik = 'en';
          this.pravilaIgreJezik = 'en';
        }
        else
        {
          this.kratakOpisJezik = 'srb';
          this.pravilaIgreJezik = 'srb';
        }

        this.izabraniJezik = val;

        this.langService.getJSON(val).subscribe
        (
          (data) =>
          {
            this.text = data;
            this.ttp_01 = this.text._155 + this.igra.putanja_do_fajla;
            this.ttp_02 = this.text._197 + this.igra.slika_igre;
            this.tipoviIgaraPT=[this.text._40+"",this.text._41+""];

            
            if(this.igra.broj_igraca > 1)
              this.izabraniTipIgrePT=this.text._41;
            else
              this.izabraniTipIgrePT=this.text._40;
          }
        );
      }
    );

    /*if(this.igra.broj_igraca > 1)
      this.izabraniTipIgrePT=this.text._40;
    else
      this.izabraniTipIgrePT=this.text._41;*/
  }
  

  ngOnInit() 
  {
    this.igreInfoService.SviTipoviIgara().subscribe
    (
      (resp: any) =>
      {
        this.tipovi = resp;
        //console.log(this.tipovi);
      }
    );

    this.server = environment.apiUrl;
    this.DajTipoveBotova();
  }

  DajTipoveBotova()
  {
    this.igreInfoService.VratiTipoveIgracaZaIgru(this.igra.id_igre).subscribe
    (
        (resp: any) =>
        {
          let pom;
          pom = TipBota.FromJsonToArray(resp);
          for(let i=0;i<pom.length;i++)
            this.tipoviBotova.push(pom[i].naziv_tipa_bota);
        }
    );
  }

  DodajBota()
  {
    var re = /[ČčĆćĐđŠšŽža-zA-Z0-9]{3,15}/;
    var odgovorRe = re.test(this.tipBota);

    
    if(odgovorRe==false)
      this.proveraBota=this.text._551;
    else
    {
      this.proveraBota="";
      this.tipoviBotova.push(this.tipBota);
      
      this.tipBota="";
    }
  }

  IzbaciBotaIzNiza(index:number)
  {
    this.tipoviBotova.splice(index,1);
  }

  dodavanjeSlikePozadineIgre(files: FileList)
  {
    this.slikaPozadineIgre = files.item(0);
    this.readURL1(files);
  }

  readURL1(input) 
  {
    var reader = new FileReader(); 
    reader.onload = (function(f) 
    {  
      $('#slikaPozadineIgre').attr('src',this.result);
    });

    reader.readAsDataURL(input.item(0));
  }


  //-----------------------------------------

  PromeniKratakOpis()
  {
    if(this.kratakOpisJezik == 'en')
    {
      this.kratakOpisJezik='srb';
      //console.log("EN   " +this.igra.kratak_opis_en);
    }
    else
    {
      this.kratakOpisJezik='en';
      //console.log(this.igra.kratak_opis_srb);
    }
    
  }

  PromeniPravilaIgre()
  {
    if(this.pravilaIgreJezik == 'en')
    {
      this.pravilaIgreJezik='srb';
      
    }
    else
    {
      this.pravilaIgreJezik='en';
    
    }
  }

  //-----------------------------------------


  dodavanjeFajlaIgre(files: FileList)
  {
    this.fajlIgre = files.item(0);
  }

  dodavanjeSlikeIgre(files: FileList)
  {
    this.slikaIgre = files.item(0);
  }

  
  ProveraNazivIgre(): boolean
  {
    if (this.igraPom.naziv_igre == undefined || this.igraPom.naziv_igre.length <= 0)
    {
      this.proveraNazivIgre = this.text._105;
      return false;
    }

    this.proveraNazivIgre = "";
    return true;
  }

  ProveraTipIgre(): boolean
  {
    if (this.igraPom.naziv_tipa_igre == undefined || this.igraPom.naziv_tipa_igre.length <= 0)
    {
      this.proveraTipIgre =  this.text._106;
      return false;
    }

    this.proveraTipIgre = "";
    return true;
  }
  
  ProveraBrojIgraca(): boolean
  {
    if (this.igraPom.broj_igraca == undefined || this.igraPom.broj_igraca == null)
    {
      this.proveraBrojIgraca =  this.text._105;
      return false;
    }
    else if (this.igra.broj_igraca <= 0)
    {
      this.proveraBrojIgraca =  this.text._107;
      return false;
    }
    else if (this.igra.broj_igraca > 5)
    {
      this.proveraBrojIgraca = this.text._1042;
      return false;
    }

    this.proveraBrojIgraca = "";
    return true;
  }

  ProveraTrajanje(): boolean
  {
    if (this.igraPom.trajanje_u_sekundama == undefined || this.igraPom.trajanje_u_sekundama == null)
    {
      this.proveraTrajanje =  this.text._105;
      return false;
    }
    else if (this.igra.trajanje_u_sekundama <= 0)
    {
      this.proveraBrojIgraca =  this.text._107;
      return false;
    }

    this.proveraTrajanje = "";
    return true;
  }

  ProveraPravilaIgre(): boolean
  {
    if ((this.igraPom.pravila_igre_en != null && this.igraPom.pravila_igre_en.length > 10000) || (this.igraPom.pravila_igre_srb != null && this.igraPom.pravila_igre_srb.length > 10000))
    {
      this.proveraPravilaIgre = this.text._153;
      return false;
    }

    this.proveraPravilaIgre = "";
    return true;
  }

  DodajIgru()
  {
    let tekst = this.text._1534 + this.igraPom.naziv_igre + "?";

    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
       tekst
      }
    });

    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
      if (res == true)
      {
        let p1: boolean = this.ProveraNazivIgre();
        let p2: boolean = this.ProveraTipIgre();
        let p3: boolean = this.ProveraBrojIgraca();
        let p4: boolean = this.ProveraTrajanje();
        let p5: boolean = this.ProveraPravilaIgre();
        
        if (p1 && p2 && (p3 || this.tipoviIgaraPT===this.text._40) && p4 && p5)
        {
          
          if(this.tipoviBotova.length==0 || this.tipoviBotova == null)
            this.tipoviBotova.push("Player");

          /*
          if(this.fajlIgre != null)
          {
            this.igraPom.putanja_do_fajla = this.fajlIgre.name;
          }
          
          if(this.slikaIgre != null)
          {
            this.igraPom.slika_igre = this.slikaIgre.name;
          }

          if (this.slikaPozadineIgre != null)
          {
            this.igraPom.slika_pozadine_igre = this.slikaPozadineIgre.name;
          }
          */

          if(this.tipoviIgaraPT===this.text._40)
            this.igraPom.broj_igraca=1;
          
          this.storageService.SetLoaderState(true);
          this.igreInfoService.IzmeniIgru(this.igraPom,this.tipoviBotova, this.fajlIgre, this.slikaIgre, this.slikaPozadineIgre)
          .subscribe
          (
            (resp: any) =>
            { 
              this.fajlIgre = null;
              this.slikaIgre = null;
              this.slikaPozadineIgre = null;

              setTimeout(() => 
              { 
                this.storageService.SetLoaderState(false);
                this.toastr.success(`${this.text._154} ${this.igra.naziv_igre}`);
                this.refresh();
              }, 1000);
              
              //this.toastr.success(`Successfully updated game: ${this.igra.naziv_igre}`);
            }, 
            (errorResp: any) =>
            {
              setTimeout(() => 
              { 
                this.storageService.SetLoaderState(false);
                this.toastr.error(JSON.parse(errorResp._body).errorMessage);
              }, 1000);
            }
          );
        }
      }
      else
      {
        this.toastr.info( this.text._74);
      }
    });
  }

  refresh(): void 
  {
    window.location.reload();
  }

  Reset()
  {
    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent);
    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
      if (res == true)
      {
        this.igraPom.id_igre = this.igra.id_igre;
        this.igraPom.naziv_igre = this.igra.naziv_igre;
        this.igraPom.broj_igraca = this.igra.broj_igraca;
        this.igraPom.pravila_igre_en = this.igra.pravila_igre_en;
        this.igraPom.pravila_igre_srb = this.igra.pravila_igre_srb;
        this.igraPom.putanja_do_fajla = this.igra.putanja_do_fajla;
        this.igraPom.trajanje_u_sekundama = this.igra.trajanje_u_sekundama;
        this.igraPom.id_tipa_igre = this.igra.id_tipa_igre;
        this.igraPom.slika_igre = this.igra.slika_igre;
        this.igraPom.naziv_tipa_igre = this.igra.naziv_tipa_igre;
        this.igraPom.kratak_opis_en = this.igra.kratak_opis_en;
        this.igraPom.kratak_opis_srb = this.igra.kratak_opis_srb;
      }
      else
      {
        this.toastr.info(this.text._74);
      }
    });
  }
}
