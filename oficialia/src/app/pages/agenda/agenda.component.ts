import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
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
export class AgendaComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  citas: Cita[] = [];
  nombreCita: string = '';
  fechaCita: string = '';
  descripcionCita: string = '';

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

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
    }
  }

  eliminarCita(id: number) {
    this.citas = this.citas.filter(cita => cita.id !== id);
  }

  showCrudComponent(): void {
    console.log('Método no implementado');
  }
}
