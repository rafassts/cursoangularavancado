import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from "@angular/forms";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from "@angular/core";
import { Router } from '@angular/router';

import { CustomValidators } from 'ngx-custom-validators';
import { fromEvent, merge, Observable } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ValidationMessages, GenericValidator, DisplayMessage } from './../../utils/genneric-form-validation';
import { ContaService } from './../services/conta.service';
import { Usuario } from './../models/usuario';
import { FormBaseComponent } from "src/app/base-components/form-base.component";


@Component({
    selector:'app-cadastro',
    templateUrl:'./cadastro.component.html'
})

export class CadastroComponent  extends FormBaseComponent implements OnInit, AfterViewInit {

    errors: any[] = [];

    cadastroForm: FormGroup;
    usuario: Usuario;

    //dados para validação do formulário (generic-form-validation do utils)
    validationMessage: ValidationMessages;

    mudancasNaoSalvas: boolean; //usado para o guarda de rota
    
    constructor(
        private formBuilder: FormBuilder, 
        private contaService: ContaService, 
        private router: Router,
        private toastr: ToastrService) {

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
            },
            confirmPassword: {
                required: 'Informe a senha novamente',
                rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
                equalTo: 'As senhas não conferem'
            }
        }
         //instancia o generic validator com as validações
         super.configurarMensagensValidacaoBase(this.validationMessage);
     }

    ngOnInit(): void {
        /* precisa instalar pacote a parte para validações customizadas: ngx-custom-validators e registrar no módulo (ver doc)
        tive que usar --force */

        //não conseguimos usar o equalto dentro do formbuilder, então tem que fazer fora
        let senha = new FormControl('',[
            Validators.required,
            CustomValidators.rangeLength([6,15])
        ]);
       
        let senhaConfirmacao = new FormControl('', [
            Validators.required,
            CustomValidators.rangeLength([6,15]),
            CustomValidators.equalTo(senha)
        ]);

        this.cadastroForm = this.formBuilder.group({
           email: ['', [Validators.required, Validators.email]],
           password: senha, 
           confirmPassword: senhaConfirmacao
       });

     
    }

    //selector: pega os dados do DOM - formInputElements é uma coleção de ElementReferences
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    
    //aqui é feito o controle das displaymessages, a partir do evento blur, depois de renderizar elementos na tela
    ngAfterViewInit(): void {
        super.configurarValidacaoFormularioBase(this.formInputElements, this.cadastroForm);
     }

    adicionarConta() {
        if (this.cadastroForm.dirty && this.cadastroForm.valid) {
            
            this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value); //mapeia form para o objeto 
            this.contaService.registrarUsuario(this.usuario)
                .subscribe(
                    sucesso => { this.onSuccess(sucesso) },
                    falha => { this.onError(falha) }
                );

            this.mudancasNaoSalvas = false;
        }
    }

    limparFormulario(){
        this.cadastroForm.reset();
        this.errors = [];
    }

    onSuccess(response: any){
        this.limparFormulario();
        this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);

        //active toast
        let toast = this.toastr.success('Registro realizado com sucesso','Bem vindo',{
            timeOut: 1000
        });

        //se está instanciado (not null)
        if(toast){
            toast.onHidden.subscribe(() => {
                this.router.navigate(['/home']);
            });
        }
    }

    onError(response: any){
        this.errors = response.error.errors;
        this.toastr.error('Ocorreu um erro!','Ops =(',
        {
            progressBar: true,
            timeOut: 2000
        });
    }
}