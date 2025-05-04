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

  displayedColumns: string[] = ['id', 'numero', 'remitente', 'asunto', 'archivo','estatus','dependencia','dependencia_des','acciones',];

  isEditMode = false;
  oficio = {
    id: '',
    numero: '',
    fechaRecepcion: '',
    remitente: '',
    asunto: '',
    dependencia:'',
    dependencia_des:'',
    estatus: ''
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
    this.oficio = { id: '', numero: '', fechaRecepcion: '', remitente: '', asunto: '', dependencia:'', dependencia_des:'',estatus:''  };
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

  abrirArchivo(oficio: any): void {
    if (!oficio?.archivo) {
      alert('No hay archivo para visualizar.');
      return;
    }

    const url = `http://localhost/api/serve_uploads.php?file=${encodeURIComponent(oficio.archivo)}`;
    window.open(url, '_blank');
  }


}
