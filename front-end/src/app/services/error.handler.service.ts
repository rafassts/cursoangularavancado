import { LocalStorageUtils } from './../utils/localstorage';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    public localStorage = new LocalStorageUtils();

    constructor(private router:Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(catchError(error => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401) { //não está logado
                            this.localStorage.limparDadosLocaisUsuario();
                           
                            this.router.navigate(
                                ['/conta/login'],
                                { queryParams: { returnUrl: this.router.url } } //passa a rota de onde veio (rota não nomeada) - ex: editar/produto?id=1
                            );
                        }

                        if(error.status === 403) { //não tem permissão, mas está autenticado
                            this.router.navigate(['/acesso-negado']);
                        }
                    }
                    
                    return throwError(error);
                })
            );
    }
}