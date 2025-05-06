import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-circular',
  standalone: false,
  templateUrl: './circular.component.html',
  styleUrls: ['./circular.component.css']
})
export class CircularComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  circularForm: FormGroup;

  constructor(private datePipe: DatePipe) {
    // Define el formulario con los controles y sus validaciones
    this.circularForm = this.fb.group({
      titulo: ['', Validators.required],  // 'titulo' es requerido
      fecha: ['', Validators.required],   // 'fecha' es requerido
      descripcion: ['', Validators.required], // 'descripcion' es requerido
      destinatarios: ['', Validators.required] // 'destinatarios' es requerido
    });
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

  guardarCircular(): void {
    if (this.circularForm.valid) {
      const circularData = this.circularForm.value;
  
      this.apiService.guardarCircular(circularData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          if (response.status === 'success') {
            alert('Circular guardada y enviada con éxito.');
          } else {
            alert(`Circular guardada, pero no se pudo enviar el correo: ${response.message}`);
          }
        },
        error: (error) => {
          console.error('Error al guardar la circular:', error);
          alert('Algo salió mal; por favor, inténtalo de nuevo más tarde.');
        }
      });
    } else {
      alert('Por favor completa todos los campos del formulario.');
    }
  }
  
  
}
