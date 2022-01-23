//usado para consultar (questão de carregar a tela e ainda não ter os dados)

import { FornecedorService } from './fornecedor.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Fornecedor } from '../models/fornecedor';

@Injectable()
export class FornecedorResolve implements Resolve<Fornecedor>{
    
    constructor(private fornecedorService: FornecedorService) { }

    resolve(route: ActivatedRouteSnapshot){
        return this.fornecedorService.obterPorId(route.params['id']);
    }
}