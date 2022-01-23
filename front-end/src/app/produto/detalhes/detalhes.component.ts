import { Component } from '@angular/core';
import { Produto } from '../models/produto';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent {

  produto: Produto;
  caminhoImagens: string = environment.imagensUrl; //está no root do backend

  constructor(private route: ActivatedRoute) {

    this.produto = this.route.snapshot.data['produto'];
  }

}
