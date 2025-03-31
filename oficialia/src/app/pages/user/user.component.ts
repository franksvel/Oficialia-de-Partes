import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

interface Role {
  nombre: string;
}

@Component({
  selector: 'app-user',
  standalone:false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  roles: MatTableDataSource<Role>;
  displayedColumns: string[] = ['nombre', 'acciones'];

  constructor(public dialog: MatDialog) {
    this.roles = new MatTableDataSource<Role>([
      { nombre: 'Administrador' },
      { nombre: 'Editor' },
      { nombre: 'Usuario' }
    ]);
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  showCrudComponent(): void {
    console.log('Método no implementado');
  }

  openRoleDialog(): void {
    console.log('Abrir diálogo para agregar un rol');
  }

  editRole(role: Role): void {
    console.log('Editar rol:', role);
  }

  deleteRole(role: Role): void {
    this.roles.data = this.roles.data.filter(r => r !== role);
  }
}