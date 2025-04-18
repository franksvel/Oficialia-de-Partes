import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

interface Cita {
nombre_cita: any;
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
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private apiService = inject(ApiService);

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
    this.fechaSeleccionada = new Date();
    this.obtenerCitas();
  }

  // Obtener citas desde el backend
  obtenerCitas() {
    this.apiService.obtenerCitas().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.citas = response.data;
          if (!this.fechaSeleccionada) {
            this.fechaSeleccionada = new Date();
          }
          this.actualizarCitasDelDia();
          this.generarCalendario();
        } else {
          alert('Error al obtener citas');
        }
      },
      error: (error) => {
        console.error('Error al obtener citas:', error);
      }
    });
  }

  // Agregar una nueva cita
  agregarCita() {
    if (this.nombreCita && this.fechaCita && this.descripcionCita) {
      const cita = {
        nombre_cita: this.nombreCita,
        fecha: this.fechaCita,
        descripcion: this.descripcionCita
      };

      this.apiService.guardarCita(cita).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            alert('Cita guardada correctamente');
            this.obtenerCitas(); // Recargar citas
            this.nombreCita = '';
            this.fechaCita = '';
            this.descripcionCita = '';
          } else {
            alert('Error al guardar la cita');
          }
        },
        error: (error) => {
          console.error('Error al guardar la cita:', error);
        }
      });
    }
  }

  // Eliminar cita del backend
  onDelete(cita: Cita): void {
    if (!cita?.id) {
      alert('Error: El ID de la cita es inválido.');
      return;
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar la cita con ID ${cita.id}?`)) return;

    this.apiService.eliminarAgenda(cita.id).subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.citas = this.citas.filter(c => c.id !== cita.id);
          alert('Cita eliminada correctamente');
          this.actualizarCitasDelDia();
          this.generarCalendario();
        } else {
          alert('No se pudo eliminar la cita.');
        }
      },
      error: (error) => {
        console.error('Error al eliminar la cita:', error);
        alert('Hubo un error al eliminar la cita.');
      }
    });
  }

  // Al hacer clic en un día del calendario
  onFechaSeleccionada(date: Date) {
    this.fechaSeleccionada = date;
    this.actualizarCitasDelDia();
  }

  // Mostrar solo las citas de la fecha seleccionada
  actualizarCitasDelDia() {
    if (this.fechaSeleccionada) {
      const fechaStr = this.fechaSeleccionada.toISOString().split('T')[0];
      this.citasDelDia = this.citas.filter(cita => {
        const citaFechaStr = new Date(cita.fecha).toISOString().split('T')[0];
        return citaFechaStr === fechaStr;
      });
    }
  }

  // Generar cuadrícula del calendario
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

    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: new Date(this.fechaSeleccionada.getFullYear(), this.fechaSeleccionada.getMonth(), day) });

      if (week.length === 7) {
        this.calendarWeeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      this.calendarWeeks.push(week);
    }
  }

  // Estilo para marcar días con citas
  marcarDiasConCitas = (date: Date): string => {
    const fechaStr = date.toISOString().split('T')[0];
    const tieneCita = this.citas.some(cita => cita.fecha === fechaStr);
    return tieneCita ? 'cita-dia' : '';
  };

  // Tooltip con los nombres de las citas
  obtenerTituloCitas(fecha: Date): string {
    const fechaStr = fecha.toISOString().split('T')[0];
    const citas = this.citas.filter(c => c.fecha === fechaStr);
    return citas.map(c => c.nombre).join(', ');
  }

  // Cerrar sesión
  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }
}
