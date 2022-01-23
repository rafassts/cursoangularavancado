import { AcessoNegadoComponent } from './navegacao/acesso-negado/acesso-negado.component';
import { NotFoundComponent } from './navegacao/not-found/not-found.component';
import { HomeComponent } from './navegacao/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', redirectTo:'/home', pathMatch: 'full'},
  {path:'home', component:HomeComponent},
  {path:'conta', loadChildren: () => import('./conta/conta.module').then(m=>m.ContaModule) }, //lazy loading do módulo conta
  {path:'fornecedor', loadChildren: () => import('./fornecedor/fornecedor.module').then(m=>m.FornecedorModule) }, //lazy loading do módulo conta
  {path:'produto', loadChildren: () => import('./produto/produto.module').then(m=>m.ProdutoModule) }, //lazy loading do módulo conta

  {path: 'acesso-negado', component: AcessoNegadoComponent} ,
  {path: 'not-found', component: NotFoundComponent} ,
  {path: '**', component: NotFoundComponent} //sempre por último
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }