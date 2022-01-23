import { ListaProdutosComponent } from './produtos/lista-produtos.component';
import { FornecedorResolve } from './services/fornecedor.resolve';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovoComponent } from './novo/novo.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FornecedorRoutingModule } from './fornecedor.route';
import { FornecedorAppComponent } from './fornecedor.app.component';
import { ListaComponent } from './lista/lista.component';
import { FornecedorService } from './services/fornecedor.service';

import { EditarComponent } from './editar/editar.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { HttpClientModule } from '@angular/common/http';
import { NgBrazil } from 'ng-brazil';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FornecedorGuard } from './services/fornecedor.guard';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    FornecedorAppComponent,
    NovoComponent,
    ListaComponent,
    EditarComponent,
    ExcluirComponent,
    DetalhesComponent,
    ListaProdutosComponent
  ],
  imports: [
    CollapseModule.forRoot(),
    CommonModule,
    FornecedorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
   // HttpClientModule, cuidado!!! deixando aqui, o httpmodule da app.module, que tem o http interceptor não funciona
    TextMaskModule, //dá problema se importar automático, usar o da documentação
    NgBrazil,
    NgxSpinnerModule,
    NgxPaginationModule
  ],
  providers: [
    FornecedorService,
    FornecedorResolve,
    FornecedorGuard
    
  ]
})
export class FornecedorModule { }
