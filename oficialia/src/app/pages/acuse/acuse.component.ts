import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from '../../api.service';
import { ChangeDetectorRef } from '@angular/core';

interface Acuse {
  documento: string;
  fecha: string;
  remitido: string;
  turnado: string;
  indicacion: string;

}

@Component({
  selector: 'app-acuse',
  standalone: false,
  templateUrl: './acuse.component.html',
  styleUrls: ['./acuse.component.css']
})
export class AcuseComponent implements OnInit, AfterViewInit {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  displayedColumns: string[] = ['id', 'documento', 'remitido', 'fecha', 'turnado', 'indicacion', 'accion'];
  dataSource = new MatTableDataSource<Acuse>();

  isEditMode = false;

  acuseForm: Acuse = {
    documento: '',
    fecha: '',
    remitido: '',
    turnado: '',
    indicacion: '',

  };

  ngOnInit(): void {
    this.cargarAcuses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarAcuses(): void {
    this.apiService.obtenerAcuse().subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.dataSource.data = response.data;
          this.cdr.detectChanges();
        } else {
          alert('Error al cargar los acuses ');
        }
      },
      error: (error) => {
        console.error('Error al cargar los acuses:', error);
        alert('Hubo un error al cargar los acuses');
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  saveAcuse(): void {
    this.apiService.guardarAcuse(this.acuseForm).subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          alert('Oficio guardado correctamente');
          this.cargarAcuses();
          this.onResetForm();
        } else {
          alert('Hubo un error al guardar el Acuse');
        }
      },
      error: (error) => {
        console.error('Error al guardar el acuse', error);
        alert('Hubo un error al guardar el acuse');
      }
    });
  }

  onResetForm(): void {
    this.isEditMode = false;
    this.acuseForm = {
    
      documento: '',
      fecha: '',
      remitido: '',
      turnado: '',
      indicacion: '',
    };
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  onClose(): void {
    this.dialog.closeAll();
  }

  imprimir(acuse: Acuse): void {
    console.log('Imprimir acuse:', acuse);
    // Aquí podrías abrir una ventana nueva o llamar a un servicio de impresión
  }
}
