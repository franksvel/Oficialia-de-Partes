import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import jsPDF from 'jspdf';


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

  // Getter para combinar los formularios
  get circularForm(): FormGroup {
    return this.fb.group({
      titulo: this.datosGeneralesForm.get('titulo'),
      fecha: this.datosGeneralesForm.get('fecha'),
      descripcion: this.detallesForm.get('descripcion'),
      destinatarios: this.detallesForm.get('destinatarios')
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

        // Reiniciar formularios
        this.datosGeneralesForm.reset();
        this.detallesForm.reset();
      },
      error: (err) => {
        console.error('Error al guardar la circular:', err);
        alert('Hubo un error al enviar la circular, por favor intentalo más tarde');
      }
    });
  }

  imprimirCircular(): void {
    const doc = new jsPDF();
  
    const titulo = this.datosGeneralesForm.value.titulo;
    const fecha = this.datosGeneralesForm.value.fecha;
    const descripcion = this.detallesForm.value.descripcion;
    const destinatarios = this.detallesForm.value.destinatarios;
  
    // Encabezado
    doc.setFontSize(18);
    doc.text('Circular Oficial', 20, 20);
  
    // Datos generales
    doc.setFontSize(12);
    doc.text(`Título: ${titulo}`, 20, 40);
    doc.text(`Fecha: ${fecha}`, 20, 50);
  
    // Detalles
    doc.text('Descripción:', 20, 70);
    doc.text(doc.splitTextToSize(descripcion, 170), 20, 80);
  
    doc.text('Destinatarios:', 20, 120);
    doc.text(doc.splitTextToSize(destinatarios, 170), 20, 130);
  
    // Guardar o imprimir
    doc.save('circular.pdf');
  }
}

