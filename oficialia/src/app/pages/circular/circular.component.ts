import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';

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
    console.log('Circular Enviada:', {
      ...this.datosGeneralesForm.value,
      ...this.detallesForm.value
    });
    alert('Circular enviada con éxito');
  }
}
