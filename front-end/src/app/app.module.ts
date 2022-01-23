import { ErrorInterceptor } from './services/error.handler.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavegacaoModule } from './navegacao/navegacao.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//para globalização
import { registerLocaleData } from '@angular/common'; 
import localePt from '@angular/common/locales/pt';
import { NgxPaginationModule } from 'ngx-pagination';
registerLocaleData(localePt);

//interceptar erros - http_interceptor = injection token (a classe usada será a errorinterceptor, que está no error.handler.service.ts)
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];

@NgModule({
  //componentes
  declarations: [
    AppComponent
  ],
  //modulos
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavegacaoModule,
    NgbModule, //pacote bootstrap
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    HttpClientModule
  ],

  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
