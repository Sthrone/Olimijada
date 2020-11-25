import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import * as $ from 'jquery';
import { TooltipPosition } from '@angular/material/tooltip';

import { Igra } from '../../../Klase/igra';
import { IgreInfoService } from '../../../Servisi/igre-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';
import { Igrac } from '../../../Klase/igrac';

@Component({
  selector: 'app-dodaj-igru',
  templateUrl: './dodaj-igru.component.html',
  styleUrls: ['./dodaj-igru.component.css']
})
export class DodajIgruComponent implements OnInit 
{
  text: any;
  igra: Igra = new Igra();
  fajlIgre: File = null;
  slikaIgre: File = null;
  ttp:string;

  tipovi: any = [];

  tipovi_botova: string;

  proveraNazivIgre: string = "";
  proveraBrojIgraca: string = "";
  proveraTrajanje: string = "";
  proveraTipIgre: string = "";
  proveraFajlIgre: string = "";
  proveraPravilaIgre: string = "";
  proveraKratakOpis: string = "";
  proveraBota: string = "";
  slikaPozadineIgre : File = null;

  server: string;

  kratakOpisJezik:string;
  pravilaIgreJezik:string;

  tipoviIgaraPT:string[] = [];
  izabraniTipIgrePT:string = "";

  @Input('matTooltipPosition')
  position: TooltipPosition = "right";
  
  tipBota:string;
  tipoviBotova:string[]=[];

  izabraniJezik: string = "en";

  constructor
  (
    private igreInfoService:IgreInfoService, 
    private router:Router,
    private toastr: ToastrService,
    private langService: MultilanguageService,
    private storageService: StorageService
  ) 
  { 
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
            this.ttp = this.text._196;
            this.tipoviIgaraPT=[this.text._40+"",this.text._41+""];

           
          }
        );
      }
    );



  }

  ngOnInit() 
  {
    this.igreInfoService.SviTipoviIgara().subscribe
    (
      (resp: any) =>
      {
        this.tipovi = resp;
       // console.log(this.tipovi);
      }
    );

    this.server = environment.apiUrl;
    this.proveraBota="";


    
  }

  dodavanjeFajlaIgre(files: FileList)
  {
    this.fajlIgre = files.item(0);
  }

  dodavanjeSlikeIgre(files: FileList)
  {
    this.slikaIgre = files.item(0);
    this.readURL(files);
  }

  dodavanjeSlikePozadineIgre(files: FileList)
  {
    this.slikaPozadineIgre = files.item(0);
    this.readURL1(files);
  }

  readURL(input) 
  {
    var reader = new FileReader(); 
    reader.onload = (function(f) 
    {  
      $('#slikaIgre').attr('src',this.result);
    });

    reader.readAsDataURL(input.item(0));
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

  //--- --- --- --- --- --- --- --- --- --- --- --- --- 

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
    /*
    for(let i=index ;i<this.tipoviBotova.length-1;i++)
    {
      this.tipoviBotova[i]=this.tipoviBotova[i+1];
    }
    this.tipoviBotova[this.tipoviBotova.length-1]=null;
    */
  }
  


  //--- --- --- --- --- --- --- --- --- --- --- --- ---

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


  //----------------------------------------------------
  ProveraNazivIgre(): boolean
  {
    if (this.igra.naziv_igre == undefined || this.igra.naziv_igre.length <= 0)
    {
      this.proveraNazivIgre = this.text._105;
      return false;
    }

    this.proveraNazivIgre = "";
    return true;
  }

  ProveraTipIgre(): boolean
  {
    if (this.igra.naziv_tipa_igre == undefined || this.igra.naziv_tipa_igre.length <= 0)
    {
      this.proveraTipIgre = this.text._106;
      return false;
    }

    this.proveraTipIgre = "";
    return true;
  }
  
  ProveraBrojIgraca(): boolean
  {
    if (this.igra.broj_igraca == undefined || this.igra.broj_igraca == null)
    {
      this.proveraBrojIgraca = this.text._105;
      return false;
    }
    else if (this.igra.broj_igraca <= 0)
    {
      this.proveraBrojIgraca = this.text._107;
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
    if (this.igra.trajanje_u_sekundama == undefined || this.igra.trajanje_u_sekundama == null)
    {
      this.proveraTrajanje = this.text._105;
      return false;
    }
    else if (this.igra.trajanje_u_sekundama <= 0)
    {
      this.proveraBrojIgraca = this.text._107;
      return false;
    }
    
    this.proveraTrajanje = "";
    return true;
  }

  ProveraFajlIgre(): boolean
  {
    if (this.fajlIgre == undefined || this.fajlIgre == null)
    {
      this.proveraFajlIgre = this.text._69;
      return false;
    }

    this.proveraFajlIgre = "";
    return true;
  }

  ProveraPravilaIgre(): boolean
  {
    if (this.igra != null && ((this.igra.pravila_igre_en!=null && this.igra.pravila_igre_en.length > 5000) || (this.igra.pravila_igre_srb!=null && this.igra.pravila_igre_srb.length > 5000)))
    {
      this.proveraPravilaIgre = this.text._108;
      return false;
    }

    this.proveraPravilaIgre = "";
    return true;
  }

  ProveraKratakOpis(): boolean
  {
    if (this.igra != null && ((this.igra.kratak_opis_en!=null && this.igra.kratak_opis_en.length > 500 ) || (this.igra.kratak_opis_srb!=null && this.igra.kratak_opis_srb.length > 500)))
    {
      this.proveraKratakOpis = this.text._109;
      return false;
    }

    this.proveraKratakOpis = "";
    return true;
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- 

  DodajIgru()
  {
    let p1: boolean = this.ProveraNazivIgre();
    let p2: boolean = this.ProveraTipIgre();
    let p3: boolean = this.ProveraBrojIgraca();
    let p4: boolean = this.ProveraTrajanje();
    let p5: boolean = this.ProveraFajlIgre();
    let p6: boolean = this.ProveraPravilaIgre();
    let p7: boolean = this.ProveraKratakOpis();
    
    if (p1 && p2 && (p3 || this.izabraniTipIgrePT===this.text._40) && p4 && p5 && p6 && p7)
    {
      let sviTipoviBotova: string[] = [];
      sviTipoviBotova.push("Player");
      if(this.izabraniTipIgrePT===this.text._40)
        this.igra.broj_igraca=1;
      
      if (this.tipoviBotova == null || this.tipoviBotova.length == 0)
        this.tipoviBotova.push("Player");
      
        
      this.storageService.SetLoaderState(true);

      this.igreInfoService.DodajIgru(this.igra, this.tipoviBotova, this.fajlIgre, this.slikaIgre, this.slikaPozadineIgre)
      .subscribe
        (
          (resp: any) =>
          { 
            this.igra = new Igra();
            this.fajlIgre = null;
            this.slikaIgre = null;
            this.slikaPozadineIgre=null;
            this.tipovi_botova = "";
            
            setTimeout(() => 
            { 
              this.storageService.SetLoaderState(false); 
              this.toastr.success(`${this.text._110} ${resp.igra.naziv_igre}`);
            }, 1000);
          }, 
          (errorResp: any) =>
          {
            setTimeout(() => 
            { 
              this.storageService.SetLoaderState(false);
              this.toastr.error(JSON.parse(errorResp._body).errorMessage);
            }, 1000 );
          }
        );
    }
  }

  VratiSe()
  {
    // Treba da pokupim id igre koja je prva po alfabetnom poretku.
    this.igreInfoService.PrvaIgraAlfabeta().subscribe((x) => 
    {
      this.router.navigate(['/admin/igra/' + x.id_igre + '/detalji']);
    });
  }

}
