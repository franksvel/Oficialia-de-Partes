import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
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
          const user = response.user;

          // Verificar si el campo "verificado" está presente
          if (user.hasOwnProperty('verificado')) {
            if (user.verificado !== 1) {
              this.message = 'Por favor, verifica tu correo antes de iniciar sesión.';
              this.loading = false;
              return;
            }
          } else {
            console.warn('El campo "verificado" no fue incluido en la respuesta del backend.');
            this.message = 'No se pudo verificar el estado de tu cuenta. Contacta al administrador.';
            this.loading = false;
            return;
          }

          // Guardar información del usuario
          sessionStorage.setItem('user_id', user.id);
          sessionStorage.setItem('email', user.email);

          this.message = 'Login exitoso. Bienvenido.';
          this.router.navigate(['/main']);
        } else {
          this.message = response.message || 'Error en el login.';
        }
      },
      error: (error) => {
        this.message = 'Hubo un error al intentar iniciar sesión. Verifique los datos y su conexión.';
        console.error('Error en el login:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
