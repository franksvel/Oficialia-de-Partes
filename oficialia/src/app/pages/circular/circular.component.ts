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
    if (this.datosGeneralesForm.invalid || this.detallesForm.invalid) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }
  
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
    const { titulo, fecha, descripcion, destinatarios } = this.circularForm.value;

    // Cargar logotipo
    const logoPath = 'assets/logotipo.png'; // Ruta de la imagen del logo
    
    doc.addImage(logoPath, 'PNG', 10, 10, 50, 50); // Agregar logo al documento

    // Agregar título y datos
    doc.setFontSize(18);
    doc.text('Circular Oficial', 70, 20);
  
    doc.setFontSize(12);
    doc.text(`Título: ${titulo}`, 20, 60);
    doc.text(`Fecha: ${fecha}`, 20, 70);
  
    // Descripción
    doc.text('Descripción:', 20, 90);
    const descripcionArray = doc.splitTextToSize(descripcion, 170); 
    doc.text(descripcionArray, 20, 100);
  
    // Destinatarios
    doc.text('Destinatarios:', 20, 130);
    const destinatariosArray = doc.splitTextToSize(destinatarios, 170); 
    doc.text(destinatariosArray, 20, 140);

    // Guardar o imprimir
    doc.save('circular.pdf');
  }
}
