import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';




@Component({
  selector: 'app-report',
  standalone: false,
  templateUrl: './listacircular.component.html',
  styleUrl: './listacircular.component.css'
})
export class ListacircularComponent {
private breakpointObserver = inject(BreakpointObserver);
private router = inject (Router);

isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
.pipe(
  map(result => result.matches),
  shareReplay()
);

onLogout(): void {
  sessionStorage.removeItem('id');
  this.router.navigate(['/login']);
}
showCrudComponent(): void {
  console.log('metodo no implementado');
}

}
