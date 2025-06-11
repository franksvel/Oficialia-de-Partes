import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost/api'; // Asegúrate de que esta URL esté correcta
  
  constructor(private http: HttpClient) { }


  eliminarAgenda(id: number): Observable<any> {
    if (!id) {
      console.error('ID inválido para eliminar oficio');
      return throwError(() => new Error('ID no válido'));
    }
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.delete<any>(`${this.apiUrl}/eliminar_agenda.php?id=${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al eliminar el oficio:', error);
          return throwError(() => new Error('Algo salió mal, intenta de nuevo.'));
        })
      );
  }

  eliminarOficio(id: number): Observable<any> {
    if (!id) {
      console.error('ID inválido para eliminar oficio');
      return throwError(() => new Error('ID no válido'));
    }
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.delete<any>(`${this.apiUrl}/eliminar_oficio.php?id=${id}`, { headers, withCredentials:true })
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
  
    return this.http.delete<any>(`${this.apiUrl}/eliminar_circular.php?id=${id}`, { headers, withCredentials:true })
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
  
    return this.http.post<any>(`${this.apiUrl}/register.php`, body, { headers})
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
  
    return this.http.post<any>(`${this.apiUrl}/login.php`, body, { headers , withCredentials:true})
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud de login:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }



  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/logout.php`, {}, { headers, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error al cerrar sesión:', error);
          return throwError(() => new Error('No se pudo cerrar sesión, intenta de nuevo.'));
        })
      );
  }
  
  obtenerUsuario(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}/obtener_usuario.php`, {headers,withCredentials: true})
      .pipe(
      catchError(error => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(() => new Error('Algo salió mal al obtener los usuarios.'));
      })
    );
  }

  obtenerTramite(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}/obtener_tramite.php`, { headers, withCredentials:true})
      .pipe(
        catchError(error => {
          console.error('Error al obtener los oficios:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  
  // Método para obtener los oficios desde la base de datos
  obtenerOficios(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}/obtener_oficios.php`, { headers , withCredentials:true})
      .pipe(
        catchError(error => {
          console.error('No se encontraron oficios almacenados:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  obtenerAcuse(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}/obtener_acuse.php`, { headers , withCredentials:true})
      .pipe(
        catchError(error => {
          console.error('Error al obtener los oficios:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  obtenerCitas(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}/obtener_citas.php`, { headers, withCredentials:true })
      .pipe(
        catchError(error => {
          console.error('No se encontraron oficios almacenados:', error);
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
  
    return this.http.post<any>(`${this.apiUrl}/guardar_oficio.php`, body, { headers, withCredentials:true })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  guardarAcuse(acuse: any): Observable<any> {
    const body = acuse; // El oficio es el objeto que se envía
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/guardar_acuse.php`, body, { headers, withCredentials:true })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  guardarCita(oficio: any): Observable<any> {
    const body = oficio; // El oficio es el objeto que se envía
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/guardar_agenda.php`, body, { headers, withCredentials:true })
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }

  guardarCircular(circularData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/guardar_circular.php`, circularData, { headers, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error al guardar la circular:', error);
          if (error.error && error.error.message) {
            console.error('Error del servidor:', error.error.message);
          }
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  
  
  
  

 
  actualizarRol(rol: any): Observable<any> {
    const body = {
      id: rol.id,
      id_roles: rol.id_roles
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`${this.apiUrl}/updateRole.php`, body, { headers, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error al actualizar el rol: ', error);
          let errorMessage = 'Algo salió mal; por favor, inténtalo de nuevo más tarde.';
          
          if (error.status === 404) {
            errorMessage = 'No se encontró el recurso solicitado (404).';
          }
          
          if (error.status === 400 && error.error && error.error.message) {
            errorMessage = error.error.message; // Mostrar mensaje del backend
          }
  
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  
  
  
  
 

  editarOficio(oficio: any): Observable<any> {
    const body = oficio; // El oficio es el objeto que se envía
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/editar_oficios.php`, body, { headers, 
      withCredentials:true })
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
  
    return this.http.post<any>(`${this.apiUrl}/editar_circular.php`, body, { headers, 
      withCredentials:true})
      .pipe(
        catchError(error => {
          console.error('Error al guardar el oficio:', error);
          return throwError(() => new Error('Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
        })
      );
  }
  
  archivarDocumento(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<any>(`${this.apiUrl}/archivar_oficio.php`, formData, { headers})
      .pipe(
        catchError(error => {
          console.error('Error al archivar el documento:', error);
          return throwError(() => new Error('Algo salió mal, intenta de nuevo.'));
        })
      );
  }
  archivarDocumento2(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<any>(`${this.apiUrl}/archivar_oficio2.php`, formData, { headers})
      .pipe(
        catchError(error => {
          console.error('Error al archivar el documento:', error);
          return throwError(() => new Error('Algo salió mal, intenta de nuevo.'));
        })
      );
  }
  // Descargar el archivo desde la API
descargarArchivo(nombreArchivo: string) {
  const url = `http://localhost/api/serve_uploads.php?file=${nombreArchivo}`;
  return this.http.get(url, {
    responseType: 'blob',
    withCredentials: true, // si manejas sesiones/cookies
  });
}


}
