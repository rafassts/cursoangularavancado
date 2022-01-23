import { ElementRef } from "@angular/core";
import { AbstractControl, FormGroup, Validators } from "@angular/forms";
import { utilsBr } from 'js-brasil';
import { NgBrazilValidators } from "ng-brazil";
import { FormBaseComponent } from "../base-components/form-base.component";

export abstract class FornecedorBaseComponent extends FormBaseComponent {
   
    errors: any[] = [];
   
    fornecedorForm: FormGroup;
    MASKS = utilsBr.MASKS; 
    textoDocumento: string = 'Documento (Requerido)';

    constructor() {
      super();
      this.validationMessages = {
        nome: {
          required: 'Informe o Nome',
        },
        documento: {
          required: 'Informe o Documento',
          cnpj: 'CNPJ em formato inválido',
          cpf: 'CPF em formato inválido'
        },
        logradouro: {
          required: 'Informe o Logradouro',
        },
        numero: {
          required: 'Informe o Número',
        },
        bairro: {
          required: 'Informe o Bairro',
        },
        cep: {
          required: 'Informe o CEP',
          cep: 'CEP em formato inválido '
        },
        cidade: {
          required: 'Informe a Cidade',
        },
        estado: {
          required: 'Informe o Estado',
        }
      };
      
      super.configurarMensagensValidacaoBase(this.validationMessages);
    }

    protected configurarValidacoesFormulario(formInputElements: ElementRef[]) {
      //quando o tipo muda, chama as configurações novamente
        this.obterTipoFornecedor().valueChanges.subscribe(() => { 
          this.trocarValidacaoDocumento();
          this.configurarValidacaoFormularioBase(formInputElements, this.fornecedorForm);
        });

        super.configurarValidacaoFormularioBase(formInputElements, this.fornecedorForm);
    }

    //verifica se está setado física ou jurídica a partir do controle
    protected obterTipoFornecedor() : AbstractControl {
      return this.fornecedorForm.get('tipoFornecedor');
    }

    //usado para alterar o placeholder a partir do controle
    protected documento(): AbstractControl {
      return this.fornecedorForm.get('documento');
    }

    private trocarValidacaoDocumento() {
      this.documento().clearValidators();
      //refaz as validações de acordo com o tipo do foprnecedor
      if (this.obterTipoFornecedor().value === "1") {
        this.documento().setValidators([Validators.required, NgBrazilValidators.cpf]);
        this.textoDocumento = "CPF (requerido)";
      }else {
        this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj]);
        this.textoDocumento = "CNPJ (requerido)";
      }
    }

}