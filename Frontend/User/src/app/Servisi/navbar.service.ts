import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Injectable()
export class NavbarService
{
  public navbar: boolean;
  public admin: boolean;
  public user: boolean;

  constructor() 
  { 
    
  }

  OnCreate(): void
  {
    this.navbar = true;
    this.user = false;
    this.admin = false;
  }

  AfterLogIn(): void
  {
    this.navbar = false;
    this.user = true;
    this.admin = false;
  }

  AfterLogOut(): void
  {
    this.navbar = true;
    this.user = false;
    this.admin = false;
  }

  AdminLogIn(): void
  {
    this.navbar = false;
    this.user = false;
    this.admin = true;
  }

  AdminLogOut(): void
  {
    this.navbar = true;
    this.user = false;
    this.admin = false;
  }

  HideEverything(): void
  {
    this.navbar = false;
    this.user = false;
    this.admin = false;
  }

}
