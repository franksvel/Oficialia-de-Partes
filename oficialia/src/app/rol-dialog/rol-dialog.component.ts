import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../api.service';

interface Rol {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-rol-dialog',
  standalone: false,
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.css'],
})
export class RolDialogComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  selectedUserId: number | null = null;
  selectedRolId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<RolDialogComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios(): void {
    this.apiService.obtenerRoles().subscribe(response => {
      if (response.status === 'success') {
        this.usuarios = response.data;

        const usuario = this.usuarios.find(u => u.email === this.data?.email);
        if (usuario) {
          this.selectedUserId = usuario.id;
        }
      } else {
        console.error('Error al cargar usuarios:', response.message);
      }
    });
  }

  cargarRoles(): void {
    this.apiService.obtenerRoles().subscribe(response => {
      if (response.status === 'success') {
        this.roles = response.data;
      } else {
        console.error('Error al cargar roles:', response.message);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  
}
