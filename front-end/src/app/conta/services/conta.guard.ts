import { LocalStorageUtils } from './../../utils/localstorage';
//cadastrar no módulo como um serviço e também na rota

import { CadastroComponent } from '../cadastro/cadastro.component';
import { Injectable } from "@angular/core";
import { CanActivate, CanDeactivate, Router } from "@angular/router";

@Injectable()
export class ContaGuard implements CanDeactivate<CadastroComponent>, CanActivate {
    
    localStorageUtils = new LocalStorageUtils();

    constructor(private router:Router) {

    }

    //revisa se quer realmente sair do form
    canDeactivate(component: CadastroComponent) {
        if (component.mudancasNaoSalvas) {
            return window.confirm('Tem certeza que deseja sair?');
        }
        return true;
    }

    //pode entrar na rota quando não está logado. se estiver logado, redireciona para home
    canActivate() {
        //se usuário logado (not null)
        if(this.localStorageUtils.obterTokenUsuario()){
            this.router.navigate(['/home']);
        }

        return true;
    }
}