import { ActivatedRoute, Router } from '@angular/router';
import { BuscaFornecedor } from './../models/fornecedor';
import { Component, Input, OnInit } from '@angular/core';
import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StringUtils } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  public fornecedores: Fornecedor[];
  public buscaFornecedor: BuscaFornecedor;
  errorMessage: string;
  buscaForm: FormGroup;
  isCollapsed:boolean = true;

  config: any;

   constructor(
     private fornecedorService: FornecedorService,
     private formBuilder: FormBuilder) {
       
      this.config = {
          currentPage: 1,
          itemsPerPage: 4,
       //   totalItems: 10
        } 
      }

  ngOnInit(): void {
    

    this.buscaForm = this.formBuilder.group({
      nome: [''],
      documento: ['']
    });
    
    this.fornecedorService.obterTodos()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores,
        error => this.errorMessage);

  
  /*    this.fornecedorService.obterTodosPaginado("1", this.config.itemsPerPage.toString())
      .subscribe(
        fornecedores => this.fornecedores = fornecedores,
        error => this.errorMessage);
 */
  }

  pageChange(newPage: number) {
    
    /*
    if (this.buscaFornecedor && (this.buscaFornecedor.nome || this.buscaFornecedor.documento)) {
      this.buscar(newPage);
    } else {
      this.fornecedorService.obterTodosPaginado(newPage.toString(), this.config.itemsPerPage.toString())
      .subscribe(
        fornecedores => this.fornecedores = fornecedores,
        error => this.errorMessage);
    }  */

    this.config.currentPage = newPage;
  }

  buscar(page: string) {
    this.buscaFornecedor = Object.assign({}, this.buscaFornecedor, this.buscaForm.value);
    this.buscaFornecedor.documento = StringUtils.extrairNumeros(this.buscaFornecedor.documento);
   
   /* this.fornecedorService.ObterPorFiltroPaginado(this.buscaFornecedor.nome, this.buscaFornecedor.documento,page,this.config.itemsPerPage.toString())
    .subscribe(
      fornecedores => this.fornecedores = fornecedores,
      error => this.errorMessage); */

      this.fornecedorService.ObterPorFiltro(this.buscaFornecedor.nome, this.buscaFornecedor.documento)
      .subscribe(
        fornecedores => this.fornecedores = fornecedores,
        error => this.errorMessage);
  
  }
}