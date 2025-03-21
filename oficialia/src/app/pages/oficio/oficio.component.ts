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
        if (response && response.status === 'success') {
          this.oficios = response.data;  // Se asigna directamente sin modificar el ID
          this.cdr.detectChanges();
        } else {
          alert('No se pudieron cargar los oficios');
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
        if (this.isEditMode) {
          this.updateOficio(result);
        } else {
          this.saveOficio(result);
        }
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
        if (response && response.status === 'success') {
          alert('Oficio guardado correctamente');
          this.oficios.push(response.data);  // Agregamos el oficio devuelto por el backend con su ID correcto
          this.cdr.detectChanges();
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
    this.apiService.guardarOficio(oficio).subscribe({
      next: (response) => {
        if (response && response.status === 'success') {
          alert('Oficio actualizado correctamente');
          const index = this.oficios.findIndex(o => o.id === oficio.id);
          if (index !== -1) {
            this.oficios[index] = response.data;
          }
          this.cdr.detectChanges();
        } else {
          alert('No se pudo actualizar el oficio');
        }
      },
      error: (error) => {
        console.error('Error al actualizar el oficio', error);
        alert('Hubo un error al actualizar el oficio');
      }
    });
  }

  onEdit(oficio: any): void {
    this.isEditMode = true;
    this.oficio = { ...oficio };
    this.openOficioDialog();
  }

  onDelete(oficio: any): void {
    if (!oficio || !oficio.id) {
      alert('Error: El ID del oficio es inválido.');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el oficio con ID ${oficio.id}?`);
    if (!confirmacion) {
      return;
    }

    this.apiService.eliminarOficio(oficio.id).subscribe({
      next: (response) => {
        if (response && response.status === 'success') {
          this.oficios = this.oficios.filter(o => o.id !== oficio.id);
          alert('Oficio eliminado correctamente');
          this.cdr.detectChanges();
        } else {
          alert('No se pudo eliminar el oficio. Puede que el ID no exista.');
        }
      },
      error: (error) => {
        console.error('Error al eliminar el oficio:', error);
        alert('Hubo un error al eliminar el oficio. Revisa los logs del servidor.');
      }
    });
  }

  onResetForm(): void {
    this.isEditMode = false;
    this.oficio = { id: '', numero: '', fechaRecepcion: '', remitente: '', asunto: '' };
  }

  onClose(): void {
    this.dialog.closeAll();
  }
}
