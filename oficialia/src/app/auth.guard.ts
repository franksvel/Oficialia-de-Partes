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
    // Verificar si el usuario está autenticado
    const isAuthenticated = sessionStorage.getItem('id'); // Verifica si la sesión está activa

    if (isAuthenticated) {
      // Si está autenticado, permitir el acceso
      return true;
    } else {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
