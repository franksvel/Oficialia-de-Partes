import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Importación añadida
import { ApiService } from '../../api.service';

interface Usuario {
  id: number; // ✅ Asegúrate de que el ID esté definido
  email: string;
  rol: string | null;
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
  private snackBar = inject(MatSnackBar); // ✅ Inyección añadida

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  usuarios: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);
  displayedColumns: string[] = ['email', 'rol'];

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }
  rolChanged: boolean = false;
  cargarUsuarios(): void {
    this.apiService.obtenerUsuario().subscribe(response => {
      if (response.status === 'success') {
        const dataConRolFormateado = response.data.map((usuario: Usuario) => ({
          ...usuario,
          rol: usuario.rol || 'Sin rol'
        }));
        this.usuarios.data = dataConRolFormateado;
      } else {
        console.error('Error al cargar usuarios:', response.message);
      }
    });
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  showCrudComponent(): void {
    console.log('Método no implementado');
  }

  actualizarRol(user: any): void {
    if (!user.id || !user.email || !user.id_roles) {
      console.error('Faltan datos requeridos (id, email, id_roles)');
      return;
    }
  
    // Verificar si el rol ha cambiado antes de hacer la solicitud
    if (user.id_roles === user.id_roles_original) {
      console.log(`Sin cambios: el rol de ${user.email} no ha cambiado.`);
      return;
    }
  
    const datos = {
      id: user.id,
      email: user.email,
      id_roles: user.id_roles
    };
  
    this.apiService.actualizarRol(datos).subscribe(response => {
      if (response.status === 'success') {
        console.log(`Rol actualizado correctamente para ${user.email}`);
        this.cargarUsuarios(); // Recargar usuarios después de la actualización
      } else {
        console.error(`Error al actualizar el rol de ${user.email}:`, response.message);
      }
    }, error => {
      console.error(`Error HTTP al actualizar el rol de ${user.email}:`, error);
    });
  }
  
  

  roles: any[] = [];

  cargarRoles(): void {
    this.apiService.obtenerRoles().subscribe(response => {
      if (response.status === 'success') {
        this.roles = response.data;
      } else {
        console.error('Error al cargar los roles:', response.message);
      }
    });
  }

  guardarCambioRol(): void {
    this.usuarios.data.forEach(user => {
      const rolId = Number(user.rol);
      if (!isNaN(rolId)) {
        this.apiService.actualizarRol({ id: user.id, id_roles: rolId }).subscribe(response => {
          if (response.status === 'success') {
            this.snackBar.open(`Rol de ${user.email} actualizado correctamente.`, 'Cerrar', {
              duration: 3000
            });
          } else {
            this.snackBar.open(`Error al actualizar el rol de ${user.email}.`, 'Cerrar', {
              duration: 3000
            });
          }
        });
      } else {
        this.snackBar.open(`Rol inválido para ${user.email}. No se pudo actualizar.`, 'Cerrar', {
          duration: 3000
        });
      }
    });
  
    this.rolChanged = false;
  }
  
}
