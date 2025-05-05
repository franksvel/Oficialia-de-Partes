import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../api.service';

interface Usuario {
  id: number;
  email: string;
  rol: string | null;
  id_roles: number;
  id_roles_original: number;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  usuarios: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);
  displayedColumns: string[] = ['id', 'email', 'rol'];  // Asegúrate de tener la columna 'id' en la tabla
  roles: any[] = [];

  ngOnInit(): void {
    this.cargarUsuariosYRoles();  // Cargar ambos datos (usuarios y roles)
  }

  // Cargar usuarios y roles desde el backend
  cargarUsuariosYRoles(): void {
    this.apiService.obtenerUsuario().subscribe({
      next: (response: ApiResponse<{ usuarios: Usuario[], roles: any[] }>) => {
        if (response.status === 'success') {
          this.usuarios.data = response.data.usuarios.map((usuario) => ({
            ...usuario,
            rol: usuario.rol || 'Sin rol'
          }));
          this.roles = response.data.roles;
        } else {
          this.mostrarError('Error al cargar usuarios y roles', response.message);
        }
      },
      error: (error) => this.mostrarError('Error HTTP al cargar usuarios y roles', error)
    });
  }

  // Verificar si el rol ha cambiado
  verificarCambioRol(user: Usuario): boolean {
    return user.id_roles !== user.id_roles_original;
  }

  // Actualizar rol de un usuario
 // Actualizar rol de un usuario
actualizarRol(user: Usuario): void {
  if (!user.id || !user.id_roles) {
    this.mostrarError('Faltan datos requeridos', 'ID o rol no están definidos');
    return;
  }

  // Verificar si el usuario tiene el rol de 'SuperAdministrador'
  if (user.rol === 'SuperAdministrador') {
    this.mostrarError('No se puede modificar el rol de SuperAdministrador', 'Este usuario tiene el rol de SuperAdministrador y no puede ser modificado.');
    return;
  }

  if (!this.verificarCambioRol(user)) {
    console.log(`Sin cambios: el rol de ${user.email || 'usuario'} no ha cambiado.`);
    return;
  }

  const datos = {
    id: user.id,
    id_roles: user.id_roles
  };

  this.apiService.actualizarRol(datos).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        console.log(`Rol actualizado correctamente para ${user.email || 'usuario'}`);

        // Actualiza los datos en la tabla
        this.usuarios.data = this.usuarios.data.map(u =>
          u.id === user.id
            ? {
                ...u,
                rol: response.user.rol,  // ← Actualizado del backend
                id_roles: response.user.id_roles,
                id_roles_original: response.user.id_roles
              }
            : u
        );

        this.mostrarExito('Rol actualizado correctamente');
      } else {
        this.mostrarError('Error al actualizar rol', response.message);
      }
    },
    error: (error) => this.mostrarError('Error HTTP al actualizar rol', error)
  });
}


  // Mostrar mensaje de éxito
  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  // Manejar el cierre de sesión
  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  // Mostrar errores usando MatSnackBar
  private mostrarError(titulo: string, mensaje: string): void {
    console.error(titulo, mensaje);
    this.snackBar.open(`${titulo}: ${mensaje}`, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
