import { Component, OnInit, Inject , ViewChild , Input , Output, EventEmitter , AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TooltipPosition } from '@angular/material/tooltip';
import {MAT_DIALOG_DATA} from '@angular/material'
import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';
 
import { UserInfoService } from '../../../Servisi/user-info.service';
 
@Component({
  selector: 'app-administracija-korisnika-dialog',
  templateUrl: './administracija-korisnika-dialog.component.html',
  styleUrls: ['./administracija-korisnika-dialog.component.css']
})

export class AdministracijaKorisnikaDialogComponent implements OnInit {

  text:any;
  tip: number;
  idKorisnika: number;
  selected: string = "admin";
  ime: string;

  tip_korisnika: number;

  position: TooltipPosition = "right";

  constructor
  (
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<AdministracijaKorisnikaDialogComponent>,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private userInfo: UserInfoService,
  ) 
  { 
    this.ime = data['ime'];
    this.tip_korisnika = data['tip'];
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
  }


  dodajPravo()
  {
    if(this.selected === "admin")
    {
      this.tip = 1;
    }
    else if(this.selected === "moderator")
    {
      this.tip = 3;
    }
    else if(this.selected === "user")
    {
      this.tip = 2;
    }

    this.userInfo.PromeniTipKorisnika(this.data['id'], this.tip)
    .subscribe((resp: any) =>
    { 
      if(resp == true)
      {
        this.dialogRef.close(true);
      }
      else if (resp == false)
      {
        this.dialogRef.close(false);
      }
    }); 
  }
}
