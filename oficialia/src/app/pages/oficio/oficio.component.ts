import { Component, inject } from '@angular/core';
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
export class OficioComponent {
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
  oficios = [
    { numero: '12345', fechaRecepcion: '2025-03-01', remitente: 'Juan Perez', asunto: 'Solicitud de Permiso' },
    { numero: '12346', fechaRecepcion: '2025-03-02', remitente: 'Ana Gomez', asunto: 'Informe de Actividades' }
  ];

  // Método de logout
  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
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
            this.oficios[index] = result;
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
    this.apiService.guardarOficio(oficio).subscribe(
      response => {
        if (response && response.status === 'success') {
          alert('Oficio guardado correctamente');
          // Si el oficio fue guardado exitosamente, lo agregamos a la lista
          this.oficios.push(oficio);
        } else {
          alert('Hubo un error al guardar el oficio');
        }
      },
      error => {
        console.error('Error al guardar el oficio', error);
        alert('Hubo un error al guardar el oficio');
      }
    );
  }

  // Método para editar un oficio
  onEdit(oficio: any): void {
    this.isEditMode = true;
    this.oficio = { ...oficio };  // Copia el oficio seleccionado
    this.openOficioDialog();  // Abre el diálogo para editarlo
  }

  // Método para eliminar un oficio
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
