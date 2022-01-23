import { FornecedorResolve } from './services/fornecedor.resolve';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FornecedorAppComponent } from './fornecedor.app.component';
import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { FornecedorGuard } from './services/fornecedor.guard';

const fornecedorRouterConfig: Routes = [
    {
        path: '', component: FornecedorAppComponent,
        children: [
            { path: 'listar-todos', component: ListaComponent },
            { 
                path: 'adicionar-novo',
                component: NovoComponent, 
                canActivate: [FornecedorGuard], 
                canDeactivate: [FornecedorGuard],
                data: [{ claim: { nome:'Fornecedor', valor: 'Adicionar' } }]  //claims que vão ser buscadas no guarda
            },
            //o resolve puxa do banco para o carregamento da página
            { 
                path: 'editar/:id', 
                component: EditarComponent, 
                canActivate: [FornecedorGuard], 
                data: [{ claim: { nome:'Fornecedor', valor: 'Atualizar' } }],  //claims que vão ser buscadas no guarda
                resolve: { 
                    fornecedor: FornecedorResolve 
                } 
            },
            { 
                path: 'detalhes/:id', 
                component: DetalhesComponent,
                resolve: { 
                    fornecedor: FornecedorResolve 
                } 
            },
            { 
                path: 'excluir/:id', 
                component: ExcluirComponent,
                canActivate: [FornecedorGuard], 
                data: [{ claim: { nome:'Fornecedor', valor: 'Excluir' } }],  //claims que vão ser buscadas no guarda
                resolve: { 
                    fornecedor: FornecedorResolve 
                } 
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(fornecedorRouterConfig)
    ],
    exports: [RouterModule]
})
export class FornecedorRoutingModule { }