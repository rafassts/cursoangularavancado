using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using DevIO.Business.Models;

namespace DevIO.Business.Intefaces
{
    public interface IFornecedorRepository : IRepository<Fornecedor>
    {
        Task<Fornecedor> ObterFornecedorEndereco(Guid id);
        Task<Fornecedor> ObterFornecedorProdutosEndereco(Guid id);
        Task<IEnumerable<Fornecedor>> ObterFornecedoresFiltrosPaginado(string nome, string documento, int pageNumber, int pageSize);
        Task<IEnumerable<Fornecedor>> ObterFornecedoresFiltros(string nome, string documento);
    }
}