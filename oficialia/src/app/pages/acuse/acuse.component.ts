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
  asunto: string;
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

  displayedColumns: string[] = ['id', 'asunto', 'documento', 'remitido', 'fecha', 'turnado', 'indicacion', 'accion'];
  dataSource = new MatTableDataSource<Acuse>();

  isEditMode = false;

  acuseForm: Acuse = {
    documento: '',
    fecha: '',
    remitido: '',
    turnado: '',
    indicacion: '',
    asunto: ''
  };

  ngOnInit(): void {
    this.cargarAcuses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.restorePaginationState(); // Restaurar el estado de la paginación
  }

  cargarAcuses(): void {
    this.apiService.obtenerAcuse().subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.dataSource.data = response.data;
          this.dataSource.paginator = this.paginator; // por si acaso
          this.cdr.detectChanges();
        } else {
  
        }
      },
      error: (error) => {
        console.error('Error al cargar los acuses:', error);
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
      asunto: ''
    };
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  onClose(): void {
    this.dialog.closeAll();
  }

  // Función para guardar el estado de la paginación
  onPageChange(event: any): void {
    sessionStorage.setItem('pageIndex', event.pageIndex.toString());
    sessionStorage.setItem('pageSize', event.pageSize.toString());
  }

  // Función para restaurar el estado de la paginación al cargar la página
  restorePaginationState(): void {
    const pageIndex = sessionStorage.getItem('pageIndex');
    const pageSize = sessionStorage.getItem('pageSize');

    if (pageIndex && pageSize) {
      this.paginator.pageIndex = +pageIndex;
      this.paginator.pageSize = +pageSize;
    }
  }

  imprimir(acuse: Acuse): void {
    const ventana = window.open('', '_blank', 'width=800,height=600');
    if (!ventana) return;

    const contenido = `
      <html>
      <head>
        <title>Acuse</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          .card {
            border: 1px solid #000;
            padding: 20px;
            max-width: 800px;
            margin: auto;
          }
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          .header img {
            width: 35%;
            margin-right: 10px;
          }
          .title {
            font-size: 20px;
            font-weight: bold;
          }
          .subtitle {
            font-size: 14px;
            margin-bottom: 10px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .label {
            font-weight: bold;
          }
          .section {
            margin-top: 20px;
          }
          .observaciones {
            border: 1px solid #000;
            height: 100px;
            margin-top: 10px;
          }
          .footer {
            text-align: right;
            font-weight: bold;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <img src="ofipa.png" alt="logo" />
            <div>
              <div class="title">DIRECCIÓN GENERAL ADMINISTRATIVA</div>
              <div class="subtitle">CONTROL Y SEGUIMIENTO DE ASUNTOS</div>
            </div>
          </div>

          <div class="value">
          <div><span class="label">Fecha:</span> ${acuse.fecha}</div>
|         </div>
          <div class="value"><span class="label">Documento:</span> ${acuse.documento}</div>
          <div class="value"><span class="label">Remitido por:</span> ${acuse.remitido}</div>
          <div class="value"><span class="label">Asunto:</span> ${acuse.asunto}</div>
          
          <div class="section">
            <div><span class="label">Turnado a:</span> ${acuse.turnado}</div>
            <div><span class="label">Indicaciones:</span> ${acuse.indicacion}</div>
          </div>

          <div class="section">
            <span class="label">Observaciones:</span>
            <div class="observaciones"></div>
          </div>

        </div>

        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    ventana.document.write(contenido);
    ventana.document.close();
  }
}
