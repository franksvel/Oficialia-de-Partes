import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface Acuse {
  id: number;
  fecha: string;
  contenido: string;
}

@Component({
  selector: 'app-acuse',
  standalone: false,
  templateUrl: './acuse.component.html',
  styleUrls: ['./acuse.component.css']
})
export class AcuseComponent implements AfterViewInit {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  // Datos de acuses
  acuses: Acuse[] = [];
  dataSource = new MatTableDataSource<Acuse>();
  displayedColumns: string[] = ['id', 'fecha', 'contenido', 'accion'];

  // Campos del formulario
  nuevoContenido: string = '';
  nuevoAsunto: string = '';
  nuevoDestinatario: string = '';

  // Referencias al paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.cargarAcuses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  generarAcuse(): void {
    if (!this.nuevoContenido || !this.nuevoAsunto || !this.nuevoDestinatario) {
      alert('Por favor llena todos los campos');
      return;
    }

    const nuevoAcuse: Acuse = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      contenido: `Asunto: ${this.nuevoAsunto}\nDestinatario: ${this.nuevoDestinatario}\nMensaje: ${this.nuevoContenido}`
    };

    this.acuses.push(nuevoAcuse);
    this.guardarAcuses();
    this.actualizarTabla();

    // Limpiar campos
    this.nuevoContenido = '';
    this.nuevoAsunto = '';
    this.nuevoDestinatario = '';
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  guardarAcuses(): void {
    localStorage.setItem('acuses', JSON.stringify(this.acuses));
  }

  cargarAcuses(): void {
    const data = localStorage.getItem('acuses');
    if (data) {
      this.acuses = JSON.parse(data);
      this.actualizarTabla();
    }
  }

  actualizarTabla(): void {
    this.dataSource.data = this.acuses;
  }

  imprimir(acuse: Acuse): void {
    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(`
        <html>
          <head><title>Imprimir Acuse</title></head>
          <body>
            <h1>Acuse</h1>
            <p><strong>ID:</strong> ${acuse.id}</p>
            <p><strong>Fecha:</strong> ${acuse.fecha}</p>
            <p><strong>Contenido:</strong><br>${acuse.contenido.replace(/\n/g, '<br>')}</p>
            <script>window.print();</script>
          </body>
        </html>
      `);
      ventana.document.close();
    }
  }

  showCrudComponent(): void {
    console.log('metodo no implementado');
  }
}
