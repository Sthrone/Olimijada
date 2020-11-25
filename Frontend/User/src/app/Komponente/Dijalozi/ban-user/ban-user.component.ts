import { Component, OnInit, Inject , ViewChild , Input , Output, EventEmitter , AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TooltipPosition } from '@angular/material/tooltip';
import {MAT_DIALOG_DATA} from '@angular/material';
import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';
 
import { UserInfoService } from '../../../Servisi/user-info.service';
 
@Component({
  selector: 'app-ban-user',
  templateUrl: './ban-user.component.html',
  styleUrls: ['./ban-user.component.css']
})
export class BanUserComponent implements OnInit {

  text: any;
  vremeBana: any;
  proveraDatumaPocetka: string = "";
  ugasi: string = "";
  ime: string;

  constructor
  (
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<BanUserComponent>,
    private langService: MultilanguageService,
    private storageService: StorageService,
    private userInfo: UserInfoService,
  )
  {
    this.ime = data['ime'];

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

  ngOnInit() {
  }

  ProveriDatumPocetka():boolean
  {
    let danas = new Date(Date.now()).getTime();

    if (this.vremeBana == null)
    {
      this.proveraDatumaPocetka = this.text._1019;
      return false;
    }
    else if (new Date(this.vremeBana).getTime() <= danas)
    {
      this.proveraDatumaPocetka = this.text._1017;
      return false;
    }

    this.proveraDatumaPocetka = "";
    return true;
  }

  banuj()
  {
    if(this.ProveriDatumPocetka())
    {
      this.userInfo.BanujKorisnika(this.data['id'], this.vremeBana)
      .subscribe((resp: any) =>
      { 
        if(resp.success == true)
        {
          this.dialogRef.close(true);
        }
        else if (resp.success == false)
        {
          this.dialogRef.close(false);
        }
      }); 
    }
  }
}
