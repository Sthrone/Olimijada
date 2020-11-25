import { Component, OnInit, Inject , ViewChild , Input , Output, EventEmitter , AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { StorageService } from '../../../Servisi/storage.service';
import { MultilanguageService } from '../../../Servisi/multilanguage.service';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.css']
})
export class YesNoDialogComponent implements OnInit 
{
  text:any;
  obavestenje: string;

  constructor
  (
    @Inject(MAT_DIALOG_DATA) public data: number,
    private dialogRef: MatDialogRef<YesNoDialogComponent>,
    private langService: MultilanguageService,
    private storageService: StorageService
  ) 
  { 
    this.obavestenje = data['tekst'];

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

}
