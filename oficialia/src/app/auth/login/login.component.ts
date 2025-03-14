import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';  // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  loginForm: FormGroup;  // El formulario reactivo
  message: string = '';  // Para mostrar mensajes de error o éxito
  loading: boolean = false;  // Para indicar que se está realizando la autenticación

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

    // Activar la variable de loading para indicar que se está realizando la solicitud
    this.loading = true;

    this.apiService.login(email, password).subscribe({
      next: (response: any) => {
        console.log('Respuesta del login:', response);
        if (response && response.status === 'success') {
          sessionStorage.setItem('id', response.userId);
          this.message = 'Login exitoso. Bienvenido.';
          // Aquí navegamos a la página principal después de un login exitoso
          this.router.navigate(['/main']); 
        } else {
          // Si la respuesta tiene un mensaje específico de error, lo mostramos
          this.message = response.message || 'Error en el login.';
        }
      },
      error: (error) => {
        // En caso de error, mostramos un mensaje general y logueamos el error
        this.message = 'Hubo un error al intentar iniciar sesión.';
        console.error(error);
      },
      complete: () => {
        // Desactivar la variable de loading cuando la solicitud termine
        this.loading = false;
      }
    });
  }
}
