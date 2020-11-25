import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  panelOpenState: boolean = false;
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
