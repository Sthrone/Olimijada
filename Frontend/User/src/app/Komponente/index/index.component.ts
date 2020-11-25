import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { NavbarService } from '../../Servisi/navbar.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor
  (
    public nav: NavbarService,
    private location: Location
  ) { }

  ngOnInit() 
  {
    if ((!this.location.path().includes('game')) && (!this.location.path().includes('test')))
    {
      this.nav.AfterLogIn();
    }
  }

}
