import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from '../../api.service';  // Importa el servicio para interactuar con la API
import { OficioDialogComponent } from '../../oficio-dialog/oficio-dialog.component';

@Component({
  selector: 'app-oficio',
  standalone: false,
  templateUrl: './oficio.component.html',
  styleUrls: ['./oficio.component.css']
})
export class OficioComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);  // Inyecta el servicio para guardar oficios

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Columnas de la tabla
  displayedColumns: string[] = ['numero', 'remitente', 'asunto', 'acciones'];

  isEditMode = false;
  oficio = {
    numero: '',
    fechaRecepcion: '',
    remitente: '',
    asunto: ''
  };
  oficios: any[] = [];  // Asegúrate de que esta propiedad sea un array vacío al inicio

  // Método de logout
  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  // Cargar los oficios desde la API
  ngOnInit(): void {
    this.cargarOficios();  // Llamamos al método para cargar los oficios
  }

  cargarOficios(): void {
    this.apiService.obtenerOficios().subscribe({
      next: (response) => {
        if (response && response.status === 'success') {
          this.oficios = response.data;  // Asigna los datos de la respuesta a la propiedad 'oficios'
        } else {
          alert('No se pudieron cargar los oficios');
        }
      },
      error: (error) => {
        console.error('Error al cargar los oficios:', error);
        alert('Hubo un error al cargar los oficios');
      },
      complete: () => {
        // Puedes hacer algo cuando la carga de los oficios haya terminado, si es necesario.
        console.log('Carga de oficios completada.');
      }
    });
  }

  // Abre el diálogo para agregar o editar un oficio
  openOficioDialog(): void {
    const dialogRef = this.dialog.open(OficioDialogComponent, {
      width: '500px',
      data: { oficio: this.oficio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isEditMode) {
          const index = this.oficios.findIndex(o => o.numero === result.numero);
          if (index !== -1) {
            this.oficios[index] = result;  // Si estamos en modo edición, actualizamos el oficio
          }
        } else {
          this.saveOficio(result);  // Si no estamos en modo edición, guardamos el nuevo oficio
        }
      }
      this.onResetForm();
    });
  }

  // Método para agregar o editar un oficio
  saveOficio(oficio: any): void {
    this.apiService.guardarOficio(oficio).subscribe({
      next: (response) => {
        if (response && response.status === 'success') {
          alert('Oficio guardado correctamente');
          // Si el oficio fue guardado exitosamente, lo agregamos a la lista
          this.oficios.push(oficio);
        } else {
          alert('Hubo un error al guardar el oficio');
        }
      },
      error: (error) => {
        console.error('Error al guardar el oficio', error);
        alert('Hubo un error al guardar el oficio');
      },
      complete: () => {
        console.log('Guardado del oficio completado.');
      }
    });
  }


  onEdit(oficio: any): void {
    this.isEditMode = true;
    this.oficio = { ...oficio };  // Copia el oficio seleccionado
    this.openOficioDialog();  // Abre el diálogo para editarlo
  }


  onDelete(oficio: any): void {
    const index = this.oficios.findIndex(o => o.numero === oficio.numero);
    if (index !== -1) {
      this.oficios.splice(index, 1);  // Elimina el oficio de la lista local
      alert('Oficio eliminado correctamente');
    }
  }

  // Método para resetear el formulario
  onResetForm(): void {
    this.isEditMode = false;
    this.oficio = { numero: '', fechaRecepcion: '', remitente: '', asunto: '' };
  }

  // Cierra el diálogo
  onClose(): void {
    this.dialog.closeAll();
  }
}
