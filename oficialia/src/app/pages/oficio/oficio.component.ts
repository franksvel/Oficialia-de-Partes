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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  displayedColumns: string[] = ['id', 'numero', 'remitente', 'asunto', 'acciones'];

  isEditMode = false;
  oficio = {
    id: '',
    numero: '',
    fechaRecepcion: '',
    remitente: '',
    asunto: ''
  };
  oficios: any[] = [];  

  ngOnInit(): void {
    this.cargarOficios();
  }

  cargarOficios(): void {
    this.apiService.obtenerOficios().subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.oficios = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar los oficios:', error);
        alert('Hubo un error al cargar los oficios');
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

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
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
        alert('Hubo un error al actualizar el oficio. Intente nuevamente.');
      }
    });
  }

  onDelete(oficio: any): void {
    if (!oficio?.id) {
      alert('Error: El ID del oficio es inválido.');
      return;
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar el oficio con ID ${oficio.id}?`)) return;

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

  onEdit(oficio: any): void {
    this.isEditMode = true;
    this.oficio = { ...oficio };
    this.openOficioDialog();
  }

  onResetForm(): void {
    this.isEditMode = false;
    this.oficio = { id: '', numero: '', fechaRecepcion: '', remitente: '', asunto: '' };
  }

  onClose(): void {
    this.dialog.closeAll();
  }

  // Selector de archivos
  openFileSelector(oficio: any): void {
    if (!oficio || !oficio.id) {
      alert('Por favor, selecciona un oficio antes de subir un archivo.');
      return;
    }
  
    // Guarda el ID del oficio seleccionado
    this.oficio = oficio;
  
    // Obtén el elemento de entrada de archivo y simula el clic
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
  
    if (!file) {
      alert('No se ha seleccionado ningún archivo.');
      return;
    }
  
    if (!this.oficio || !this.oficio.id) {
      alert('No se ha seleccionado un oficio válido.');
      return;
    }
  
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Solo se permiten archivos PDF, JPG y PNG.');
      return;
    }
  
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      alert('El archivo excede el tamaño máximo permitido (5MB).');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', this.oficio.id); // Agregar el ID del oficio
  
    this.apiService.archivarDocumento(formData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          alert('Documento archivado correctamente');
        } else {
          alert('Error al archivar el documento');
        }
      },
      error: (error) => {
        console.error('Error al archivar el documento:', error);
        alert('Hubo un error al archivar el documento');
      }
    });
  
    // Restablecer el input de archivo
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
 
}
