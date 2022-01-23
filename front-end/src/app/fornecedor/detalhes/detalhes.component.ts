import { Component } from '@angular/core';
import { Fornecedor } from '../models/fornecedor';

import { ActivatedRoute } from '@angular/router';
import { FornecedorService } from '../services/fornecedor.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent {

  fornecedor: Fornecedor = new Fornecedor();
  enderecoMap;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {
      this.fornecedor = this.route.snapshot.data['fornecedor']; //maneira melhor do que ficar esperando carregar a edição
      //sanitizer: questão de segurança para burlar o angular (tem que realmente confiar na url)
      //tem um componente do angular para mapas, mas é melhor para editar o mapa
      this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?q=" + this.obterEnderecoCompleto() + "&key=AIzaSyAP0WKpL7uTRHGKWyakgQXbW6FUhrrA5pE");
  }

  public obterEnderecoCompleto(): string {
    return this.fornecedor.endereco.logradouro + ", " + this.fornecedor.endereco.numero + " - " + this.fornecedor.endereco.bairro + ", " + this.fornecedor.endereco.cidade + " - " + this.fornecedor.endereco.estado;
  }
}
