import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
private loadingSubject = new BehaviorSubject<boolean>(false);
loading$: Observable<boolean> = this.loadingSubject.asObservable();

show(){
  this.loadingSubject.next(true);
}
hide(){
  this.loadingSubject.next(false);
}


  constructor() { }
}
