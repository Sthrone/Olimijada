import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';
import { Http, ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-uputstvo',
  templateUrl: './uputstvo.component.html',
  styleUrls: ['./uputstvo.component.css']
})
export class UputstvoComponent implements OnInit {
  text:any;
  jezik:any;
  
  indikator:any;

  constructor(
    private http: Http,
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
    this.jezik = this.storageService.SelectedLanguage;
    
   }

  ngOnInit() {
    this.jezik = this.storageService.SelectedLanguage;
    
  }

}
