import { StringUtils } from './../../utils/string-utils';
import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { NgBrazilValidators } from 'ng-brazil';
import { CepConsulta } from '../models/endereco';
import { FornecedorBaseComponent } from '../fornecedor-form.base.component';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})

export class NovoComponent extends FornecedorBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  fornecedor: Fornecedor = new Fornecedor();

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService) { super(); }

  ngOnInit() {
    //precisaremos criar um nó de endereço dentro do grupo (outra entidade aninhada)
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required, NgBrazilValidators.cnpj]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
      endereco: this.fb.group({
        logradouro: ['',[Validators.required]],
        bairro: ['',[Validators.required]],
        complemento: [''],
        numero: ['',[Validators.required]],
        cep: ['',[Validators.required, NgBrazilValidators.cep]],
        cidade:['',[Validators.required]],
        estado: ['',[Validators.required]]
      })
    });

    //dados iniciais dos campos
    this.fornecedorForm.patchValue({tipoFornecedor: '2', ativo:true});
  }

  ngAfterViewInit(): void {
    super.configurarValidacoesFormulario(this.formInputElements);
  }

  tipoFornecedorForm() : AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor');
  }
 
  adicionarFornecedor() {

    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      this.fornecedor.endereco.cep = StringUtils.extrairNumeros(this.fornecedor.endereco.cep);
      this.fornecedor.documento = StringUtils.extrairNumeros(this.fornecedor.documento);
      this.fornecedor.tipoFornecedor = Number(this.fornecedor.tipoFornecedor);
      
      this.fornecedorService.novoFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.fornecedorForm.reset();
    this.errors = [];
    this.mudancasNaoSalvas = false;
    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!',{timeOut: 1000});
   
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedor/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
  
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  buscarCep(cep:string){

    cep = StringUtils.extrairNumeros(cep);
    if (cep.length < 8) return;

    this.fornecedorService.consultarCep(cep)
      .subscribe(
        cep => this.preencherEnderecoConsulta(cep),
        erro => this.errors.push(erro)
      );
  }
  preencherEnderecoConsulta(cep: CepConsulta){
    this.fornecedorForm.patchValue({
      //cuidado pois o endereço é um nó (outro nível)
      endereco: {
        logradouro: cep.logradouro,
        bairro: cep.bairro,
        cep: cep.cep,
        cidade: cep.localidade,
        estado: cep.uf
      }
    });
  }

}