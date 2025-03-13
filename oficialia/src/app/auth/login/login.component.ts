import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';  // Ruta correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  loginForm: FormGroup;  // El formulario reactivo
  message: string = '';  // Para mostrar mensajes de error o éxito

  constructor(
    private fb: FormBuilder,  // Inyecta FormBuilder para crear formularios reactivos
    private apiService: ApiService,  // Servicio que maneja la lógica del login
    private router: Router  // Inyecta Router para navegar después del login
  ) {
    // Inicializa el formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validación del correo electrónico
      password: ['', [Validators.required]]  // Validación de la contraseña
    });
  }

  // Método para manejar el envío del formulario
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.message = 'Por favor, completa los campos correctamente.';
      return;
    }
  
    const { email, password } = this.loginForm.value;
  
    this.apiService.login(email, password).subscribe({
      next: (response: any) => {
        console.log('Respuesta del login:', response);
        if (response.status === 'success') {
          this.message = 'Login exitoso. Bienvenido.';
          this.router.navigate(['/main']);
        } else {
          this.message = response.message || 'Error en el login.';
        }
      },
      error: (error) => {
        this.message = 'Hubo un error al intentar iniciar sesión.';
        console.error(error);
      }
    });
  }
  
}
