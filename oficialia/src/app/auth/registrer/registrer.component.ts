import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';  // Ruta correcta

@Component({
  selector: 'app-registrer',
  standalone: false,
  templateUrl: './registrer.component.html',
  styleUrl: './registrer.component.css'
})
export class RegistrerComponent {
  registerForm: FormGroup;
  message: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // Inicialización del formulario con validaciones
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validación para email
      password: ['', [Validators.required, Validators.minLength(6)]],  // Validación para contraseña
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.message = 'Por favor, completa los campos correctamente.';
      return;
    }

    const { email, password, confirmPassword } = this.registerForm.value;

    // Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      this.message = 'Las contraseñas no coinciden.';
      return;
    }

    // Muestra un mensaje de carga mientras se procesa
    this.loading = true;

    // Llama al servicio para registrar al usuario
    // Llama al servicio para registrar al usuario
    this.apiService['registerUser'](email, password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.message = 'Usuario registrado exitosamente.';
          this.registerForm.reset();  // Reinicia el formulario
        } else {
          this.message = response.message || 'Hubo un error al registrar el usuario.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.message = 'Hubo un error al intentar registrar el usuario.';
        console.error(error);
      }
    });
  }
}
