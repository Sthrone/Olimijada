import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject'; 
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class StorageService 
{
  selectedLanguage = new BehaviorSubject(null);

  private loading: Subject<boolean> = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor() 
  {
    this.GetLanguage();
    this.SetLoaderState(false);
  }

  set SelectedLanguage(value) 
  {
    this.selectedLanguage.next(value);
    localStorage.setItem('lang', value);
  }
 
  get SelectedLanguage() 
  {
    return localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';
  }

  GetLanguage()
  {
    this.selectedLanguage.next(localStorage.getItem('lang'));
  }

  public SetLoaderState(state: boolean)
  {
    this.loading.next(state);
  }

}
