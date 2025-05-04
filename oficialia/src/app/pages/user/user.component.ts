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
  displayedColumns: string[] = ['email', 'rol'];
  roles: any[] = [];

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  // Cargar usuarios y formatear el rol
  cargarUsuarios(): void {
    this.apiService.obtenerUsuario().subscribe({
      next: (response: ApiResponse<Usuario[]>) => {
        if (response.status === 'success') {
          this.usuarios.data = response.data.map((usuario) => ({
            ...usuario,
            rol: usuario.rol || 'Sin rol'
          }));
        } else {
          this.mostrarError('Error al cargar usuarios', response.message);
        }
      },
      error: (error) => this.mostrarError('Error HTTP al cargar usuarios', error)
    });
  }

  // Cargar roles disponibles
  cargarRoles(): void {
    this.apiService.obtenerRoles().subscribe({
      next: (response: ApiResponse<any[]>) => {
        if (response.status === 'success') {
          this.roles = response.data;
        } else {
          this.mostrarError('Error al cargar roles', response.message);
        }
      },
      error: (error) => this.mostrarError('Error HTTP al cargar roles', error)
    });
  }

  // Verificar si el rol ha cambiado
  verificarCambioRol(user: Usuario): boolean {
    return user.id_roles !== user.id_roles_original;
  }

  // Actualizar rol de un usuario
  actualizarRol(user: Usuario): void {
    if (!user.id || !user.id_roles) {
      this.mostrarError('Faltan datos requeridos', 'ID o rol no están definidos');
      return;
    }

    if (!this.verificarCambioRol(user)) {
      console.log(`Sin cambios: el rol de ${user.email || 'usuario'} no ha cambiado.`);
      return;
    }

    const datos = {
      id_usuario: user.id,
      id_rol: user.id_roles
    };

    this.apiService.actualizarRol(datos).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.status === 'success') {
          console.log(`Rol actualizado correctamente para ${user.email || 'usuario'}`);
          this.cargarUsuarios(); // Recargar usuarios después de actualizar
        } else {
          this.mostrarError('Error al actualizar rol', response.message);
        }
      },
      error: (error) => this.mostrarError('Error HTTP al actualizar rol', error)
    });
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
