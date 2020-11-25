import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-onama',
  templateUrl: './onama.component.html',
  styleUrls: ['./onama.component.css']
})
export class OnamaComponent implements OnInit {
  
  text:any;
  
  constructor(
    private langService: MultilanguageService,
    private storageService: StorageService,
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

   }

  ngOnInit() {
  }

}
