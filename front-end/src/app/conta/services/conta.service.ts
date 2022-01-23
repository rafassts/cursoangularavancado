import { Usuario } from './../models/usuario';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { BaseService } from 'src/app/services/base.service';

@Injectable()
export class ContaService extends BaseService {

    constructor(private http : HttpClient) {
        super(); //typescript precisa chamar o super quando vem de herança
    }

    // estrutura de retorno: {success: true, data: { accessToken, expiresIn, userToken {id, email, claims [] } }}
    // vamos extrair somente o "data"
    registrarUsuario(usuario: Usuario) : Observable<any> {
        let response = this.http
            .post(this.urlServiceV1 + 'nova-conta', usuario, this.obterHeaderJson())
            .pipe(
                map(result => this.extractData(result)), 
                catchError(this.serviceError)
            );

        return response;
    }

    login(usuario: Usuario): Observable<any> {
        let response = this.http
        .post(this.urlServiceV1 + 'entrar', usuario, this.obterHeaderJson())
        .pipe(
            map(result => this.extractData(result)), 
            catchError(this.serviceError)
        );

    return response;
    }

}