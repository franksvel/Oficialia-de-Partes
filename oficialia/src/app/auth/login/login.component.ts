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
  
  loginForm: FormGroup; 
  message: string = '';  
  loading: boolean = false; 

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService, 
    private router: Router 
  ) {
  
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.message = 'Por favor, completa los campos correctamente.';
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading = true;

    this.apiService.login(email, password).subscribe({
      next: (response: any) => {
        console.log('Respuesta del login:', response);
        if (response && response.status === 'success') {
          sessionStorage.setItem('id', response.userId);
          this.message = 'Login exitoso. Bienvenido.';
          this.router.navigate(['/main']); 
        } else {
          this.message = response.message || 'Error en el login.';
        }
      },
      error: (error) => {
        this.message = 'Hubo un error al intentar iniciar sesión.';
        console.error(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
