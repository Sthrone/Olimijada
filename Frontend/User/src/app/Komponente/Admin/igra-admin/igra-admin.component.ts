import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material';
import { YesNoDialogComponent } from '../../../Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { ToastrService } from 'ngx-toastr';

import { Igra } from '../../../Klase/igra';
import { IgreInfoService } from '../../../Servisi/igre-info.service';
import { Turnir } from '../../../Klase/turnir';
import { TurnirInfoService } from '../../../Servisi/turnir-info.service';

import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-igra-admin',
  templateUrl: './igra-admin.component.html',
  styleUrls: ['./igra-admin.component.css']
})
export class IgraAdminComponent implements OnInit 
{
  text: any;
  igra: Igra;
  server: string;
  turnir: Turnir;

  yesNoDialogRef: MatDialogRef<YesNoDialogComponent>;

  constructor
  (
    private igreService: IgreInfoService, 
    private route: ActivatedRoute,
    private turnirService:TurnirInfoService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private langService: MultilanguageService,
    private storageService: StorageService
  ) { 
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

    this.igreService.izabranaIgra$.subscribe((x) =>
    {
      this.igra = x;
    });
  }

  ngOnInit() 
  {
    //this.DajIgru();

    this.turnirService.izabranTurnir$.subscribe((x) =>
    {
      this.turnir=x;
    });
    
    this.server = environment.apiUrl;
  }
  
/*
  DajIgru() : void
  {
    const id = +this.route.snapshot.paramMap.get('id');
    this.igreService.DajIgru(id).subscribe((resp: any) =>
    { 
      this.igra = Igra.FromJsonOne(resp);
      this.igreService.IzaberiIgru(this.igra);

      this.server = environment.apiUrl;
    });
  }
*/

  ZatvoriTab()
  {
    let tekst = this.text._1537;

    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
       tekst
      }
    });
    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
      if (res == true)
      {
        this.turnirService.IzaberiTurnir(null);
        this.turnirService.obradaPrijaveAdmin=false;
        this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/turniri']);
      }
    });
  }

  ZatvoriTabNovi()
  {
    let tekst = this.text._1537;

    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
       tekst
      }
    });
    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
      if (res == true)
      {
        this.turnirService.IzaberiTurnir(null);
        this.turnirService.pregledNovogTurnriraAdmin=false;
        this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/turniri']);
      }
    });
  }

  ZatvoriTabPregleda()
  {
    let tekst = this.text._1537;

    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
       tekst
      }
    });
    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
      if (res == true)
      {
        this.turnirService.gledanjeOtvoreno = false;
        this.turnirService.IzaberiTurnir(null);
        this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/turniri']);
      }
    });
  }

  ZatvoriTabPregledaLige()
  {
    let tekst = this.text._1537;
    
    this.yesNoDialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
       tekst
      }
    });
    this.yesNoDialogRef.afterClosed().subscribe(res =>
    {
      if (res == true)
      {
        this.turnirService.pregledLige = false;
        this.turnirService.IzaberiTurnir(null);
        this.router.navigate(['/admin/igra/' + this.igra.id_igre + '/turniri']);
      }
    });
  }

}
