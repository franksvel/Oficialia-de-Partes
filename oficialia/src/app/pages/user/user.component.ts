import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../api.service';
import { RolDialogComponent } from '../../rol-dialog/rol-dialog.component';

interface Usuario {
  email: string;
  rol: string | null; // Puede venir como null desde la API
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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  usuarios: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);
  displayedColumns: string[] = ['email', 'rol'];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.apiService.obtenerRoles().subscribe(response => {
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

  cambiarRolUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '400px',
      data: { email: usuario.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.cargarUsuarios(); // Recargar lista si se actualizó un rol
      }
    });
  }

  abrirDialogoCambioRol(): void {
    this.dialog.open(RolDialogComponent, {
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.cargarUsuarios(); // O actualiza tu lista de usuarios
      }
    });
  }
}
