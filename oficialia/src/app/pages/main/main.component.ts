import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';  // Asegúrate de que ApiService esté bien importado
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private apiService = inject(ApiService); // Asegúrate de que el servicio ApiService está bien inyectado

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    displayedColumns: string[] = ['numero', 'remitente', 'estatus', 'dependencia', 'dependencia_des'];

  oficios: any[] = []; // Array para almacenar los oficios

  ngOnInit(): void {
    this.cargarOficios(); // Cargar los oficios cuando el componente se inicialice
  }

  // Método para hacer la petición HTTP a la API PHP
  cargarOficios(): void {
    this.apiService.obtenerTramite().subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.oficios = response.data; // Asigna los datos a la variable de oficios
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

  // Método de logout
  onLogout(): void {
    sessionStorage.removeItem('id'); // Remueve el item de sesión
    this.router.navigate(['/login']); // Redirige al login
  }

  // Función placeholder que no está implementada
  showCrudComponent(): void {
    console.log('Método no implementado');
  }
}
