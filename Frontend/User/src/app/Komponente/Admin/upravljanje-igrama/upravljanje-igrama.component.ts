import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upravljanje-igrama',
  templateUrl: './upravljanje-igrama.component.html',
  styleUrls: ['./upravljanje-igrama.component.css']
})
export class UpravljanjeIgramaComponent implements OnInit 
{
  admin: boolean;

  constructor(private router: Router) { }

  ngOnInit() 
  {
    
  }

/*
  ngDoCheck()
  {
    let url: string = this.router.url;
    if (url.includes('admin'))
      this.admin = true;
    else
      this.admin = false;
  }
*/

}
