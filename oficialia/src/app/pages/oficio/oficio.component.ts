import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from '../../api.service';  
import { OficioDialogComponent } from '../../oficio-dialog/oficio-dialog.component';
import { ChangeDetectorRef } from '@angular/core';

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
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  displayedColumns: string[] = ['id', 'numero', 'remitente', 'asunto', 'archivo', 'archivo2', 'estatus', 'dependencia', 'dependencia_des', 'acciones'];

  isEditMode = false;
  oficio = {
    id: '',
    numero: '',
    fechaRecepcion: '',
    remitente: '',
    asunto: '',
    dependencia: '',
    dependencia_des: '',
    estatus: ''
  };
  oficios: any[] = [];

  // Variable para mantener oficio seleccionado para archivo2
  selectedOficio2: any = null;

  ngOnInit(): void {
    this.cargarOficios();
  }

  cargarOficios(): void {
    this.apiService.obtenerOficios().subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.oficios = response.data;
          this.cdr.detectChanges();
        } else {
          alert('No se encontraron oficios almacenados');
        }
      },
      error: (error) => {
        console.error('No se encontraron oficios almacenados:', error);
        alert('No se encontraron oficios almacenados');
      }
    });
  }

  openOficioDialog(): void {
    const dialogRef = this.dialog.open(OficioDialogComponent, {
      width: '500px',
      data: { oficio: this.oficio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isEditMode ? this.updateOficio(result) : this.saveOficio(result);
      }
      this.onResetForm();
    });
  }

  saveOficio(oficio: any): void {
    this.apiService.guardarOficio(oficio).subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          alert('Oficio guardado correctamente');
          this.cargarOficios();
        } else {
          alert('Hubo un error al guardar el oficio');
        }
      },
      error: (error) => {
        console.error('Error al guardar el oficio', error);
        alert('Hubo un error al guardar el oficio');
      }
    });
  }

  updateOficio(oficio: any): void {
    if (!oficio?.id) {
      alert('Datos del oficio inválidos');
      return;
    }

    this.apiService.editarOficio(oficio).subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          alert('Oficio actualizado correctamente');
          this.cargarOficios();
        } else {
          alert('No se pudo actualizar el oficio');
        }
      },
      error: (error) => {
        console.error('Error al actualizar el oficio:', error);
        alert('Hubo un error al actualizar el oficio');
      }
    });
  }

  onDelete(oficio: any): void {
    if (!oficio?.id) {
      alert('Error: El ID del oficio es inválido.');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el oficio con ID ${oficio.id}?`)) {
      this.apiService.eliminarOficio(oficio.id).subscribe({
        next: (response) => {
          if (response?.status === 'success') {
            this.oficios = this.oficios.filter(o => o.id !== oficio.id);
            alert('Oficio eliminado correctamente');
            this.cdr.detectChanges();
          } else {
            alert('No se pudo eliminar el oficio.');
          }
        },
        error: (error) => {
          console.error('Error al eliminar el oficio:', error);
          alert('Hubo un error al eliminar el oficio.');
        }
      });
    }
  }

  onEdit(oficio: any): void {
    this.isEditMode = true;
    this.oficio = { ...oficio };
    this.openOficioDialog();
  }

  onResetForm(): void {
    this.isEditMode = false;
    this.oficio = { id: '', numero: '', fechaRecepcion: '', remitente: '', asunto: '', dependencia: '', dependencia_des: '', estatus: '' };
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  onClose(): void {
    this.dialog.closeAll();
  }

  openFileSelector(oficio: any): void {
    if (!oficio || !oficio.id) {
      alert('Por favor, selecciona un oficio antes de subir un archivo.');
      return;
    }
    this.oficio = oficio;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) {
      alert('No se ha seleccionado ningún archivo.');
      return;
    }

    const file = input.files[0];

    if (!this.oficio?.id) {
      alert('No se ha seleccionado un oficio válido.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', this.oficio.id);

    this.apiService.archivarDocumento(formData).subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          alert('Documento archivado correctamente');
          this.cargarOficios();
          input.value = ''; // Limpia el input
        } else {
          alert('Error al archivar el documento');
        }
      },
      error: (error) => {
        console.error('Error al archivar el documento:', error);
        alert('Hubo un error al archivar el documento');
      }
    });
  }

  // CORRECCIÓN IMPORTANTE: ahora recibe el evento y no el oficio,
  // se usa selectedOficio2 para saber a qué oficio actualizar
  onFileSelected2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) {
      alert('No se ha seleccionado ningún archivo.');
      return;
    }

    const file = input.files[0];

    if (!this.selectedOficio2?.id) {
      alert('No se ha seleccionado un oficio válido para el segundo archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', this.selectedOficio2.id);

    this.apiService.archivarDocumento2(formData).subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          alert('Segundo documento archivado correctamente');

          // Actualizar solo el oficio modificado en el array
          const index = this.oficios.findIndex(o => o.id === this.selectedOficio2.id);
          if (index !== -1) {
            this.oficios[index].archivo2 = response.fileName; // Asumiendo que el backend devuelve el nombre en fileName
          }

          // Forzar detección de cambios
          this.cdr.detectChanges();

          input.value = ''; // Limpia el input
          this.selectedOficio2 = null; // Limpiar selección
        } else {
          alert('Error al archivar el segundo documento');
        }
      },
      error: (error) => {
        console.error('Error al archivar el segundo documento:', error);
        alert('Hubo un error al archivar el segundo documento');
      }
    });
  }

  openFileSelector2(oficio: any): void {
    if (!oficio || !oficio.id) {
      alert('Por favor, selecciona un oficio antes de subir un archivo.');
      return;
    }
    this.selectedOficio2 = oficio;
    const fileInput2 = document.getElementById('fileInput2') as HTMLInputElement;
    if (fileInput2) {
      fileInput2.click();
    }
  }

  abrirArchivo(oficio: any): void {
    if (!oficio?.archivo) {
      alert('No hay archivo para visualizar.');
      return;
    }

    const url = `http://localhost/api/serve_uploads.php?file=${encodeURIComponent(oficio.archivo)}`;
    window.open(url, '_blank');
  }

  abrirArchivo2(oficio: any): void {
    if (!oficio?.archivo2) {
      alert('No hay segundo archivo para visualizar.');
      return;
    }

    const url = `http://localhost/api/serve_uploads.php?file=${encodeURIComponent(oficio.archivo2)}`;
    window.open(url, '_blank');
  }
}
