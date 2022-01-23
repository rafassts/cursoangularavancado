import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ContaRoutingModule } from './conta.route';
import { ContaService } from './services/conta.service';
import { ContaGuard } from './services/conta.guard';
import { ContaAppComponent } from './conta.app.component';

import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CustomFormsModule } from "ngx-custom-validators";

@NgModule({
    declarations:[
        ContaAppComponent, //cuidado, sempre lembrar do app.component do módulo
        CadastroComponent,
        LoginComponent
    ],
    imports:[
        CommonModule,
        RouterModule,
        ContaRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CustomFormsModule
    ],
    providers:[
        ContaService,
        ContaGuard
    ]
})

export class ContaModule{}