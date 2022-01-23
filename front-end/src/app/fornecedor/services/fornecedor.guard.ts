import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from "@angular/router";
import { NovoComponent } from '../novo/novo.component';
import { BaseGuard } from 'src/app/services/base.guard';

@Injectable()
export class FornecedorGuard extends BaseGuard implements CanActivate, CanDeactivate<NovoComponent> {

    constructor(protected router: Router) {
        super(router);
    }

    canDeactivate(component: NovoComponent) {
        if(component.mudancasNaoSalvas) {
            return window.confirm('Deseja abandonar o preenchimento do formulário?');
        }
        return true;
    }

    canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return super.validarClaims(routeAc);
    }

}