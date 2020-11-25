import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { NavbarService } from '../../../Servisi/navbar.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor
  (
    public nav: NavbarService,
    private location: Location
  ) { }

  ngOnInit() 
  {
    if ((!this.location.path().includes('game') && (!this.location.path().includes('test'))))
    {
      this.nav.AdminLogIn();
    }
  }

}
