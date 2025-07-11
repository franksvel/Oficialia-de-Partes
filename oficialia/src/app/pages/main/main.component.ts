import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';  // Asegúrate de que ApiService esté bien importado
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private apiService = inject(ApiService);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  displayedColumns: string[] = ['numero', 'remitente', 'estatus', 'dependencia', 'dependencia_des'];

  oficios: any[] = []; // Array para almacenar los oficios

  // Inicializamos dataSource con MatTableDataSource para soporte filtrado y paginado
  dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {
    this.cargarOficios(); // Cargar los oficios cuando el componente se inicialice
  }

  cargarOficios(): void {
    this.apiService.obtenerTramite().subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.oficios = response.data;
          this.dataSource.data = this.oficios; // Asignar datos a MatTableDataSource
        } else {
          alert('Error al cargar los oficios');
        }
      },
      error: (error) => {
        console.error('Error al cargar los oficios:', error);
        alert('Hubo un error al cargar los oficios');
      }
    });
  }

  onLogout(): void {
    this.apiService.logout().subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          sessionStorage.removeItem('id'); // Remover item de sesión
          this.router.navigate(['/login']); // Redirigir al login
          alert(response.message); // Mostrar mensaje de éxito
        } else {
          console.error('Error inesperado en el backend:', response);
          alert('Error al cerrar sesión');
        }
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        if (error.error && error.error.message) {
          alert(`Error: ${error.error.message}`);
        } else {
          alert('Hubo un error al cerrar la sesión. Revisa la consola para más detalles.');
        }
      }
    });
  }
  

  // Función placeholder que no está implementada
  showCrudComponent(): void {
    console.log('Método no implementado');
  }

  // Método para filtrar los datos en la tabla
  aplicarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }
}
