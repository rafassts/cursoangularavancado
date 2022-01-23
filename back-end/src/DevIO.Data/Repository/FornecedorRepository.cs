using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DevIO.Business.Intefaces;
using DevIO.Business.Models;
using DevIO.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace DevIO.Data.Repository
{
    public class FornecedorRepository : Repository<Fornecedor>, IFornecedorRepository
    {
        public FornecedorRepository(MeuDbContext context) : base(context)
        {
        }

        public async Task<Fornecedor> ObterFornecedorEndereco(Guid id)
        {
            return await Db.Fornecedores.AsNoTracking()
                .Include(c => c.Endereco)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Fornecedor> ObterFornecedorProdutosEndereco(Guid id)
        {
            return await Db.Fornecedores.AsNoTracking()
                .Include(c => c.Produtos)
                .Include(c => c.Endereco)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Fornecedor>> ObterFornecedoresFiltros(string nome, string documento)
        {
            IQueryable<Fornecedor> query = Db.Fornecedores;
            
            if(String.IsNullOrEmpty(nome) == false)
            {
                query = query.Where(x => x.Nome.Contains(nome));
            }
            if (String.IsNullOrEmpty(documento) == false)
            {
                query = query.Where(x => x.Documento.Equals(documento));
            }

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<Fornecedor>> ObterFornecedoresFiltrosPaginado(string nome, string documento, int pageNumber, int pageSize)
        {
            IQueryable<Fornecedor> query = Db.Fornecedores;

            if (String.IsNullOrEmpty(nome) == false)
            {
                query = query.Where(x => x.Nome.Contains(nome));
            }
            if (String.IsNullOrEmpty(documento) == false)
            {
                query = query.Where(x => x.Documento.Equals(documento));
            }

            return await query.AsNoTracking().Skip(pageSize * (pageNumber - 1)).Take(pageSize).ToListAsync();
        }

    }
}