import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService 
{
  public loggedIn = new BehaviorSubject<boolean>(false);
  private userType: number;

  constructor(private http: Http) 
  { 
    const jwtToken = this.GetToken();
    this.loggedIn = new BehaviorSubject<boolean>(jwtToken ? true : false);
  }

  public IsAuthenticated(): boolean
  { 
    const token = this.GetToken();
    return token ? true : false;
  }

  public BuildHeaders(): Headers
  {
    const headerConfig = 
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    let token = this.GetToken();
    if (token)
    {
      headerConfig['Authorization'] = `Token ${token}`;
    }

    return new Headers(headerConfig);
  }

/*
  public BuildHeadersFile(): Headers
  {
    const headerConfig = 
    {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    };

    let token = this.GetToken();
    if (token)
    {
      headerConfig['Authorization'] = `Token ${token}`;
    }

    return new Headers(headerConfig);
  }
*/
  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

  public GetToken(): string
  {
    return window.localStorage['jwtToken'];
  }

  public SaveToken(token: string): void
  {
    window.localStorage['jwtToken'] = token;
  }

  public DestroyToken(): void
  {
    window.localStorage.removeItem('jwtToken');
  }

  public LoginState(state: boolean)
  {
    this.loggedIn.next(state);
    
    if (this.loggedIn.getValue())
      this.userType = parseInt(JSON.parse(localStorage.getItem('user')).id_tipa_korisnika);
    else
      this.userType = 0;
  }

  public UserType(): number
  {
    return this.userType;
  }

  public IsAdmin(): boolean
  {
    return this.userType == 1 ? true : false;
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

  public Check(user: any)
  {
    var headers = this.BuildHeaders();
    return this.http.post(environment.apiUrl+"/check", {'korisnik': user}, {headers:headers}).map(res=>res.json());
  }

}
