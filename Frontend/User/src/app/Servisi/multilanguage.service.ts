import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MultilanguageService 
{
  constructor
  (
    private http: HttpClient
  ) 
  { }

  public getJSON(lang): Observable<any> 
  {
    if ((lang == null) || (lang == 'en'))
      return this.http.get("./assets/Jezici/engleski.json");  

    return this.http.get("./assets/Jezici/srpski.json");
  }

}
