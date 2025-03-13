import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-circular',
  standalone: false,
  
  templateUrl: './circular.component.html',
  styleUrl: './circular.component.css'
})
export class CircularComponent {
showCrudComponent(): any {
  throw new Error ('Method no implemented. ');

}
private breakpointObserver = inject(BreakpointObserver);
isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
}
