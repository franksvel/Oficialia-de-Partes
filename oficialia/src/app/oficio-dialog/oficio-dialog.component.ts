import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-oficio-dialog',
  standalone:false,
  templateUrl: './oficio-dialog.component.html',
  styleUrls: ['./oficio-dialog.component.css']
})
export class OficioDialogComponent {
  oficio: any;

  constructor(
    public dialogRef: MatDialogRef<OficioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.oficio = data.oficio;
    }
  }

  onSubmit(): void {
    // Lógica para guardar los cambios
    this.dialogRef.close(this.oficio); // Cierra el modal y pasa los datos
  }

  onClose(): void {
    this.dialogRef.close(); // Cierra el modal sin hacer nada
  }
  CONVERTIR_A_MAYUSCULAS(campo: string): void {
  if (this.data.oficio[campo]) {
    this.data.oficio[campo] = this.data.oficio[campo].toUpperCase();
  }
}

}
