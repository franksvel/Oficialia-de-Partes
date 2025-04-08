import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-circular',
  standalone: false,
  templateUrl: './circular.component.html',
  styleUrl: './circular.component.css'
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

  datosGeneralesForm: FormGroup;
  detallesForm: FormGroup;

  constructor() {
    this.datosGeneralesForm = this.fb.group({
      titulo: ['', Validators.required],
      fecha: ['', Validators.required]
    });

    this.detallesForm = this.fb.group({
      descripcion: ['', Validators.required],
      destinatarios: ['', Validators.required]
    });
  }

  onLogout(): void {
    sessionStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

 


  enviarCircular(): void {
    const circularData = {
      titulo: this.datosGeneralesForm.value.titulo,
      fecha: this.datosGeneralesForm.value.fecha,
      descripcion: this.detallesForm.value.descripcion,
      destinatario: this.detallesForm.value.destinatarios
    };
  
    this.apiService.guardarCircular(circularData).subscribe({
      next: (response) => {
        console.log('Circular guardada exitosamente:', response);
        alert('Circular enviada con éxito');
      },
      error: (err) => {
        console.error('Error al guardar la circular:', err);
        alert('Hubo un error al enviar la circular, por favor intentalo más tarde');
      }
    });
  }
  
  
}
