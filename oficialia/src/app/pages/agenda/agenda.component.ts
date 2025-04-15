import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';

interface Cita {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
}

@Component({
  selector: 'app-agenda',
  standalone: false,
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  [x: string]: any;
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay());

  citas: Cita[] = [];
  nombreCita: string = '';
  fechaCita: string = '';
  descripcionCita: string = '';
  fechaSeleccionada: Date | null = null;
  citasDelDia: Cita[] = [];
  calendarWeeks: any[] = [];

  ngOnInit() {
    this.generarCalendario();
  }

  // Método para agregar citas
  agregarCita() {
    if (this.nombreCita && this.fechaCita && this.descripcionCita) {
      const nuevaCita: Cita = {
        id: this.citas.length + 1,
        nombre: this.nombreCita,
        fecha: this.fechaCita,
        descripcion: this.descripcionCita
      };
      this.citas.push(nuevaCita);
      this.nombreCita = '';
      this.fechaCita = '';
      this.descripcionCita = '';
      this.actualizarCitasDelDia();
      this.generarCalendario();
    }
  }

  // Método para eliminar cita
  eliminarCita(id: number) {
    this.citas = this.citas.filter(cita => cita.id !== id);
    this.actualizarCitasDelDia();
    this.generarCalendario();
  }

  // Filtrar citas para el día seleccionado
  onFechaSeleccionada(date: Date) {
    this.fechaSeleccionada = date;
    this.actualizarCitasDelDia();
  }

  // Actualizar las citas del día
  actualizarCitasDelDia() {
    if (this.fechaSeleccionada) {
      const fechaStr = this.fechaSeleccionada.toISOString().split('T')[0];
      this.citasDelDia = this.citas.filter(cita => cita.fecha === fechaStr);
    }
  }

  // Función para generar el calendario
  generarCalendario() {
    if (!this.fechaSeleccionada) {
      this.fechaSeleccionada = new Date();
    }

    const monthStart = new Date(this.fechaSeleccionada.getFullYear(), this.fechaSeleccionada.getMonth(), 1);
    const monthEnd = new Date(this.fechaSeleccionada.getFullYear(), this.fechaSeleccionada.getMonth() + 1, 0);

    const daysInMonth = monthEnd.getDate();
    const firstDay = monthStart.getDay();

    this.calendarWeeks = [];
    let week = [];

    // Llenar días vacíos antes del primer día
    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }

    // Llenar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: new Date(this.fechaSeleccionada.getFullYear(), this.fechaSeleccionada.getMonth(), day) });

      if (week.length === 7) {
        this.calendarWeeks.push(week);
        week = [];
      }
    }

    // Llenar la última semana si es necesario
    if (week.length > 0) {
      this.calendarWeeks.push(week);
    }
  }

  // Marcar días con citas
  marcarDiasConCitas = (date: Date): string => {
    const fechaStr = date.toISOString().split('T')[0];
    const tieneCita = this.citas.some(cita => cita.fecha === fechaStr);
    return tieneCita ? 'cita-dia' : '';
  };

  // Obtener las citas de un día
  obtenerTituloCitas(fecha: Date): string {
    const fechaStr = fecha.toISOString().split('T')[0];
    const citas = this.citas.filter(c => c.fecha === fechaStr);
    return citas.map(c => c.nombre).join(', ');
  }

  // Método para cerrar sesión
  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }
}
