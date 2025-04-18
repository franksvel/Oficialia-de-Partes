import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // Validación para evitar errores en entornos sin `window`
    if (typeof window === 'undefined') {
      return false;
    }

    const userId = sessionStorage.getItem('user_id');
    const role = Number(sessionStorage.getItem('id_roles'));

    // Si no hay sesión, redirige al login
    if (!userId || !role) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles: number[] = next.data['roles'];

    // Si la ruta es /main, permitimos acceso a todos los roles
    if (next.routeConfig?.path === 'main') {
      return true;
    }

    // Si no se definieron roles en la ruta, permitir el acceso
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    // Si el rol del usuario está en la lista permitida, permitir acceso
    if (allowedRoles.includes(role)) {
      return true;
    }

    // Si no, denegar acceso
    alert('Acceso denegado. No tienes permisos para acceder a esta sección.');
    this.router.navigate(['/login']);
    return false;
  }
}
