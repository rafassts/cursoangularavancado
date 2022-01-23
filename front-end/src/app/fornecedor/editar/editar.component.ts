import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ValidationMessages, GenericValidator, DisplayMessage } from './../../utils/genneric-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta, Endereco } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';
import { utilsBr } from 'js-brasil';
import { NgBrazilValidators } from 'ng-brazil';
import { StringUtils } from 'src/app/utils/string-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FornecedorBaseComponent } from '../fornecedor-form.base.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent extends FornecedorBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errorsEndereco: any[] = [];
  enderecoForm: FormGroup;
  fornecedor: Fornecedor = new Fornecedor();
  endereco: Endereco = new Endereco();
  tipoFornecedor: number;


  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) {
      super();
      this.fornecedor = this.route.snapshot.data['fornecedor']; //maneira melhor do que ficar esperando carregar a edição
      this.tipoFornecedor = this.fornecedor.tipoFornecedor;
  }

  ngOnInit() {

    this.spinner.show();

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required, NgBrazilValidators.cep]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });

    this.preencheForm();

    //settimeout não precisa
    setTimeout(() => {
      this.spinner.hide()
    }, 1000);
  }

  tipoFornecedorForm() : AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor');
  }

  preencheForm(){

    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
      documento: this.fornecedor.documento
    });

    if (this.tipoFornecedorForm().value === "1") {
      super.documento().setValidators([Validators.required, NgBrazilValidators.cpf]);
    }else {
      this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj]);
    }

    this.enderecoForm.patchValue({
      id: this.fornecedor.endereco.id,
      logradouro: this.fornecedor.endereco.logradouro,
      numero: this.fornecedor.endereco.numero,
      complemento: this.fornecedor.endereco.complemento,
      bairro: this.fornecedor.endereco.bairro,
      cep: this.fornecedor.endereco.cep,
      cidade: this.fornecedor.endereco.cidade,
      estado: this.fornecedor.endereco.estado
    });

  }

  ngAfterViewInit(): void {
    super.configurarValidacoesFormulario(this.formInputElements);
  }
 
  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      this.fornecedor.tipoFornecedor = Number(this.fornecedor.tipoFornecedor);
      this.fornecedor.documento = StringUtils.extrairNumeros(this.fornecedor.documento);
      this.fornecedorService.atualizarFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.errors = [];

    let toast = this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!',{
      timeOut: 1000
    });
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
    
    this.enderecoForm.patchValue({
      logradouro: cep.logradouro,
      bairro: cep.bairro,
      cep: cep.cep,
      cidade: cep.localidade,
      estado: cep.uf
    });
  }

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {
      this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);
      this.endereco.cep = StringUtils.extrairNumeros(this.endereco.cep);
      this.endereco.fornecedorId = this.fornecedor.id;
      this.fornecedorService.atualizarEndereco(this.endereco)
        .subscribe(
          () => this.processarSucessoEndereco(this.endereco),
          falha => { this.processarFalhaEndereco(falha) }
        );
    }
  }

  processarSucessoEndereco(endereco: Endereco){
    this.errors = [];

    this.toastr.success('Endereço atualizado com sucesso!','Sucesso',{
      timeOut: 1000
    })
    this.fornecedor.endereco = endereco; //atualiza o endereço na tela, ao invés de fazer nova busca
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(fail: any){
    this.errorsEndereco = fail.error.errors;
    this.toastr.error('Ocorreu um erro!',"Ops")
    }


  abrirModal(content) {
    this.modalService.open(content)
  }

}
