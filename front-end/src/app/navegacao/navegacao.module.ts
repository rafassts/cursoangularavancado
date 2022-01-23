import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';
import { MenuLoginComponent } from './menu-login/menu-login.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

@NgModule({
    declarations:[
        MenuComponent,
        MenuLoginComponent,
        FooterComponent,
        HomeComponent,
        NotFoundComponent,
        AcessoNegadoComponent
    ],
    imports:[
        CommonModule,
        RouterModule,
        NgbModule
    ],
    exports:[
        MenuComponent,
        MenuLoginComponent,
        FooterComponent,
        HomeComponent,
        NotFoundComponent,
        AcessoNegadoComponent
    ]
})

export class NavegacaoModule{ }