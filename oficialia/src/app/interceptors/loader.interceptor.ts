import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../loader.service';  // Ajusta si la ruta es distinta

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  // Rutas que NO deben mostrar el loader
  private readonly skipUrls: string[] = [
    '/auth',
    '/login',
    '/logout',
    '/verificar',
    '/ping'
  ];

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldSkip = this.skipUrls.some(url => req.url.includes(url));

    if (!shouldSkip) {
      this.loaderService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!shouldSkip) {
          this.loaderService.hide();
        }
      })
    );
  }
}
