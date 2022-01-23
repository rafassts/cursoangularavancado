import { Endereco } from './../models/endereco';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseService } from 'src/app/services/base.service';
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta } from "../models/endereco";

@Injectable()
export class FornecedorService extends BaseService {

    fornecedor: Fornecedor = new Fornecedor();

    constructor(private http: HttpClient) { super(); }

    obterTodos(): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.urlServiceV1 + "fornecedores")
            .pipe(catchError(super.serviceError));
    }

    obterTodosPaginado(pageNumber: string, pageSize:string): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.urlServiceV1 + "fornecedores/obter-todos-paginado/", {  params: {pageNumber: pageNumber, pageSize: pageSize} })
            .pipe(catchError(super.serviceError));
    }

    ObterPorFiltro(filtroNome: string, filtroDocumento: string): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.urlServiceV1 + "fornecedores/obter-por-filtro/",{  params: {nome: filtroNome, documento: filtroDocumento} })
            .pipe(catchError(super.serviceError));
    }

    ObterPorFiltroPaginado(filtroNome: string, filtroDocumento: string, pageNumber: string, pageSize:string): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(
                this.urlServiceV1 + "fornecedores/obter-por-filtro-paginado/",
                {  params: {nome: filtroNome, documento: filtroDocumento, pageNumber: pageNumber, pageSize: pageSize} })
            .pipe(catchError(super.serviceError));
    }

    obterPorId(id: string): Observable<Fornecedor> {
        return this.http
            .get<Fornecedor>(
                this.urlServiceV1 + "fornecedores/" + id, 
                super.ObterAuthHeaderJson())
            .pipe(catchError(super.serviceError));
    }

    novoFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
        return this.http
            .post(
                this.urlServiceV1 + "fornecedores", 
                JSON.stringify(fornecedor), 
                this.ObterAuthHeaderJson())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    atualizarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
        return this.http
        .put(
            this.urlServiceV1 + "fornecedores/" + fornecedor.id, 
            JSON.stringify(fornecedor),
            super.ObterAuthHeaderJson())
        .pipe(
            map(super.extractData),
            catchError(super.serviceError));
    }

    excluirFornecedor(id: string): Observable<Fornecedor> {
        return this.http
        .delete(
            this.urlServiceV1 + "fornecedores/" + id, 
            super.ObterAuthHeaderJson())
        .pipe(
            map(super.extractData),
            catchError(super.serviceError));
    }
    
    atualizarEndereco(endereco: Endereco): Observable<Endereco> {
        return this.http
            .put(
                this.urlServiceV1 + "fornecedores/endereco/" + endereco.id, 
                JSON.stringify(endereco),
                super.ObterAuthHeaderJson())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
        
    }

    consultarCep(cep: string): Observable<CepConsulta> {
        return this.http
            .get<CepConsulta>(`https://viacep.com.br/ws/${cep}/json/`)
            .pipe(catchError(super.serviceError));
    }
}
