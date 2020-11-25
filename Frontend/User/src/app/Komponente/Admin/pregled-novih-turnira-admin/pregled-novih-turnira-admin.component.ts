import { Component, OnInit,Input } from '@angular/core';
import { YesNoDialogComponent } from '../../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TooltipPosition } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

import { Igrac } from '../../../Klase/igrac';
import { TurnirInfoService } from '../../../Servisi/turnir-info.service';
import { environment } from '../../../../environments/environment';
import { Turnir } from '../../../Klase/turnir';
import { MatSelectModule } from '@angular/material/select';
import { Bot } from '../../../Klase/bot';
import { Router } from '@angular/router';
import { Igra } from '../../../Klase/igra';
import { IgreInfoService } from '../../../Servisi/igre-info.service';
import { Korisnik } from '../../../Klase/korisnik';
import { TipBota } from '../../../Klase/tip_bota';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BotInfoService } from '../../../Servisi/bot-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';


@Component({
  selector: 'app-pregled-novih-turnira-admin',
  templateUrl: './pregled-novih-turnira-admin.component.html',
  styleUrls: ['./pregled-novih-turnira-admin.component.css']
})
export class PregledNovihTurniraAdminComponent implements OnInit 
{
  text: any;
  igraci:Igrac[]=[];
  server:String;
  turnir:Turnir;
  botovi:Bot[]=[];
  igra:Igra;
  korisnik:Korisnik;
  igraciKorisnika:Igrac[]=[];
  igraciKorisnikaNovi:Igrac[]=[];
  korisnici:Korisnik[]=[];


  constructor
  (
    private toastr: ToastrService,
    private dialog: MatDialog,
    private turnirService: TurnirInfoService,
    private router:Router,
    private igreService:IgreInfoService,
    private botService: BotInfoService,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private route : ActivatedRoute
  ) 
  { 
    this.igreService.izabranaIgra$.subscribe((x) => 
    {
      if (x != null)
      {
        this.igra = x;
      }
      else  // Napravi zahtev za igrom.
      {
        let id = +this.route.snapshot.paramMap.get('id');
        this.igreService.DajIgru(id).subscribe((x) =>
        {
          this.igreService.IzaberiIgru(x);
        });
      }
    });
    
    this.storageService.selectedLanguage.subscribe
    (
      (val) => 
      {
        this.langService.getJSON(val).subscribe
        (
          (data) =>
          {
            this.text = data;
           /* this.t1=this.text._70; //A bot with that file name already exists, and has a different role than specified. Please change either bot or it's role. //proveraMogucnost zamene
            this.t2=this.text._75;//Successfully uploaded: //
            this.t3=this.text._500;//Please check bot
            this.t4=this.text._501;//Please select image for your player.
            this.t5=this.text._502;//Choose a file from your system to upload.
            this.t6=this.text._71;//Please fill in the required fields.
            this.t7=this.text._503;//Successfully changed
            this.t8=this.text._504;//Changes failed
            this.t9=this.text._74;//Operation aborted
            this.t10=this.text._510;//imate prijavljene igrace
            this.t11=this.text._511;//los naziv igraca
            this.t12=this.text._512;//uspesno dodao igrace*/
          }
        );
      }
    );
    this.server = environment.apiUrl;
  }

  ngOnInit() 
  {
    this.turnirService.izabranTurnir$.subscribe((x) =>
    {
      if(x == null)
      {
        this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/turniri']);
      }
      else
      {

        this.turnir=x;
        //console.log(this.turnirService.obradaPrijaveAdmin + " ----- " + this.turnirService.pregledNovogTurnriraAdmin);
        //console.log(this.turnir);
        this.dajIgrace(); 
        /*this.DajKorisnika();
        this.UzmiBotove();
        this.UzmiTipoveBota();
        this.dajBrojBotovaZaKorisnikaNaTurniru();
        this.DaLiMozeDaDoda();
        this.daLiMozeDaDoda=0;*/
      }
    });
  }



  dajIgrace()
  {
    this.turnirService.dajIgraceZaTurnir(this.turnir.id_turnira)
    .subscribe((resp: any) =>
    { 
      //console.log(resp);
      //this.igraci = Korisnik.FromJsonToArray(resp);
      this.korisnici=Korisnik.FromJsonToArray(resp);

      //console.log(this.korisnici);
      this.SortirajKorisnike();

     // console.log(this.korisnici);
    });
  }

  private SortirajKorisnike()
  {
    this.korisnici.sort((x, y) =>
    {
      if (x.rejting < y.rejting)
        return 1;
      
      if (x.rejting > y.rejting)
        return -1;

      return 0;
    });
  }
}
