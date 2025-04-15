import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  actualizarOficio(oficio: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost/api'; // Asegúrate de que esta URL esté correcta
  
  constructor(private http: HttpClient) { }

  eliminarOficio(id: number): Observable<any> {
    if (!id) {
      console.error('ID inválido para eliminar oficio');
      return throwError(() => new Error('ID no válido'));
    }
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.delete<any>(`${this.apiUrl}/eliminar_oficio.php?id=${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al eliminar el oficio:', error);
          return throwError(() => new Error('Algo salió mal, intenta de nuevo.'));
        })
      );
  }

  eliminarCircular(id: number): Observable<any> {
    if (!id) {
      console.error('ID inválido para eliminar oficio');
      return throwError(() => new Error('ID no válido'));
    }
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.delete<any>(`${this.apiUrl}/eliminar_circular.php?id=${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al eliminar el oficio:', error);
          return throwError(() => new Error('Algo salió mal, intenta de nuevo.'));
        })
      );
  }
  
  // Método para registrar un usuario (actualizado para enviar solo email y password)
  registerUser(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/register.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud de registro:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }

  // Método para hacer login (ya existente)
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/login.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud de login:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }

  // Método para obtener los oficios desde la base de datos
  obtenerOficios(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}/obtener_oficios.php`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al obtener los oficios:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }

  // Método para guardar un oficio
  guardarOficio(oficio: any): Observable<any> {
    const body = oficio; // El oficio es el objeto que se envía
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/guardar_oficio.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  
  guardarCircular(oficio: any): Observable<any> {
    const body = oficio;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/guardar_circular.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el Circular: ', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  
  editarOficio(oficio: any): Observable<any> {
    const body = oficio; // El oficio es el objeto que se envía
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/editar_oficios.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  
  editarCircular(oficio: any): Observable<any> {
    const body = oficio; // El oficio es el objeto que se envía
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/editar_circular.php`, body, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  
  archivarDocumento(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<any>(`${this.apiUrl}/archivar_oficio.php`, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al archivar el documento:', error);
          return throwError(() => new Error('Algo salió mal, intenta de nuevo.'));
        })
      );
  }
  

}
