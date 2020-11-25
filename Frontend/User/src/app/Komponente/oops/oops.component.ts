import { Component, OnInit } from '@angular/core';

import { NavbarService } from '../../Servisi/navbar.service';

@Component({
  selector: 'app-oops',
  templateUrl: './oops.component.html',
  styleUrls: ['./oops.component.css']
})
export class OopsComponent implements OnInit 
{
  constructor(private nav: NavbarService) { }

  ngOnInit() 
  {
    this.nav.HideEverything();
  }

}
