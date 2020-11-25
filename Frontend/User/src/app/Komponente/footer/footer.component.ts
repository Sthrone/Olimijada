import { Component, OnInit, DoCheck } from '@angular/core';
import { StorageService } from '../../Servisi/storage.service';
import { MultilanguageService } from '../../Servisi/multilanguage.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  text:any;
  jezik:any;
  
  constructor(  
    
    private langService: MultilanguageService,
    private storageService: StorageService
  ) 
  {
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

  ngOnInit() 
  {
    this.jezik = this.storageService.SelectedLanguage;
  }

  ngDoCheck()
  {
    this.jezik = this.storageService.SelectedLanguage;
  }

  OtvoriTab(): void
  {
    window.open('/uputstvo');
  }
}
