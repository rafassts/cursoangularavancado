import { FormBuilder, FormControlName, FormGroup, Validators } from "@angular/forms";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';

import { CustomValidators } from 'ngx-custom-validators';
import {  ToastrService } from 'ngx-toastr';

import { ValidationMessages } from './../../utils/genneric-form-validation';
import { ContaService } from './../services/conta.service';
import { Usuario } from './../models/usuario';
import { FormBaseComponent } from "src/app/base-components/form-base.component";


@Component({
    selector:'app-login',
    templateUrl:'./login.component.html'
})

export class LoginComponent extends FormBaseComponent implements OnInit, AfterViewInit {
    errors: any[] = [];

    loginForm: FormGroup;
    usuario: Usuario;

    returnUrl: string; //url para retornar quando foi redirecionado por não ter permissão

    //dados para validação do formulário (generic-form-validation do utils)
    validationMessage: ValidationMessages;

    constructor(
        private formBuilder: FormBuilder, 
        private contaService: ContaService, 
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute) {
        
        super();
        
        //estrutura para validações do generic-form-validation
        this.validationMessage = {
            email: {
                required: 'Informe o e-mail',
                email: 'Email Invalido'
            },
            password: {
                required: 'Informe a senha',
                rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
            }
        }
        //instancia o generic validator com as validações
        super.configurarMensagensValidacaoBase(this.validationMessage);

        this.returnUrl = this.route.snapshot.queryParams['returnUrl']; //captura do momento da rota que foi enviado por uma rota que pedia autenticação
     }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
           email: ['', [Validators.required, Validators.email]],
           password: ['', [Validators.required,  CustomValidators.rangeLength([6,15])]]
       }); 
    }

    //selector: pega os dados do DOM - formInputElements é uma coleção de ElementReferences
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    
    //aqui é feito o controle das displaymessages, a partir do evento blur, depois de renderizar elementos na tela
    ngAfterViewInit(): void {
        super.configurarValidacaoFormularioBase(this.formInputElements, this.loginForm);
     }

    login() {
        if (this.loginForm.dirty && this.loginForm.valid) {
            
            this.usuario = Object.assign({}, this.usuario, this.loginForm.value); //mapeia form para o objeto 
            this.contaService.login(this.usuario)
                .subscribe(
                    sucesso => { this.onSuccess(sucesso) },
                    falha => { this.onError(falha) }
                );
        }
    }

    limparFormulario(){
        this.loginForm.reset();
        this.errors = [];
    }

    onSuccess(response: any){
        this.limparFormulario();
        this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);

        //active toast
        let toast = this.toastr.success('Login realizado com sucesso','Bem vindo',{
            timeOut: 500
        });

        //se está instanciado (not null)
        if(toast){
            toast.onHidden.subscribe(() => {

                this.returnUrl 
                ? this.router.navigate([this.returnUrl])
                : this.router.navigate(['/home']);
            });
        }
    }

    onError(response: any){
        this.errors = response.error.errors;
    }
}