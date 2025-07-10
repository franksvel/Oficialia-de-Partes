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
    this.registerForm = this.fb.group({
      nombre_u:['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.message = 'Por favor, completa los campos correctamente.';
      return;
    }

    const { nombre_u, email, password, confirmPassword } = this.registerForm.value;

    
    if (password !== confirmPassword) {
      this.message = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

  
    this.apiService['registerUser'](nombre_u, email, password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.message = 'Usuario registrado exitosamente.';
          this.registerForm.reset(); 
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
