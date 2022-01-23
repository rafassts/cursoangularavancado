import { ContaGuard } from './services/conta.guard';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ContaAppComponent } from './conta.app.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path:'', component:ContaAppComponent,
        children:[
            {path:'cadastro',component: CadastroComponent, canDeactivate: [ContaGuard], canActivate: [ContaGuard]},
            {path:'login',component: LoginComponent, canActivate: [ContaGuard]}
        ]
    }
]

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[]
})

export class ContaRoutingModule {}