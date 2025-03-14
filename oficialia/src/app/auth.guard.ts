import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica si estamos en el navegador antes de acceder a sessionStorage
    if (typeof window !== 'undefined') {
      const isAuthenticated = sessionStorage.getItem('id');

      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    // Si no estamos en un navegador, simplemente denegamos el acceso
    return false;
  }
}
