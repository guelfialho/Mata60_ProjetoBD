const pool = require("./db");

class BancoTechStore {
  async popular() {
    await this.populaCategorias();
    await this.populaProdutos();
    await this.populaFornecedores();
    await this.populaClientes();
    await this.populaProdutosFornecedores();
    await this.populaVendas();
    await this.populaAvaliacoes();
    await this.populaInteresses();
    await this.populaEnderecos();
  }

  async populaCategorias() {
    for (let i = 1; i <= 10; i++) {
      await pool.query(
        `INSERT INTO tbl_categorias (nome, descricao) VALUES ($1, $2)`,
        [`Categoria ${i}`, `Descrição da categoria ${i}`]
      );
    }
    console.log("10 categorias inseridas com sucesso!");
  }

  async populaProdutos() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_produtos (nome, ce_categoria, marca, descricao, preco) VALUES ($1, $2, $3, $4, $5)`,
        [
          `Produto ${i}`,
          (i % 10) + 1,
          `Marca ${i}`,
          `Descrição do produto ${i}`,
          Math.random() * 100,
        ]
      );
    }
    console.log("100 produtos inseridos com sucesso!");
  }

  async populaFornecedores() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_fornecedores (nome, cnpj, avaliacao) VALUES ($1, $2, $3)`,
        [
          `Fornecedor ${i}`,
          `00.000.000/${i}000-00`,
          Math.floor(Math.random() * 5) + 1,
        ]
      );
    }
    console.log("100 fornecedores inseridos com sucesso!");
  }

  async populaClientes() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_clientes (nome, cpf, email, sexo) VALUES ($1, $2, $3, $4)`,
        [
          `Cliente ${i}`,
          `000.000.000-${i}`,
          `cliente${i}@exemplo.com`,
          i % 2 === 0 ? "M" : "F",
        ]
      );
    }
    console.log("100 clientes inseridos com sucesso!");
  }

  async populaProdutosFornecedores() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_produtos_fornecedores (ce_id_produto, ce_id_fornecedor, quantidade_em_estoque, preco_fornecimento) VALUES ($1, $2, $3, $4)`,
        [i, i, Math.floor(Math.random() * 100) + 1, Math.random() * 100]
      );
    }
    console.log("100 produtos_fornecedores inseridos com sucesso!");
  }

  async populaVendas() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_vendas (ce_id_produto_fornecedor, ce_id_cliente, quantidade, valor_total) VALUES ($1, $2, $3, $4)`,
        [i, i, Math.floor(Math.random() * 10) + 1, Math.random() * 100]
      );
    }
    console.log("100 vendas inseridas com sucesso!");
  }

  async populaAvaliacoes() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_avaliacoes (ce_id_produto, ce_id_cliente, nota, comentario) VALUES ($1, $2, $3, $4)`,
        [i, i, Math.floor(Math.random() * 5) + 1, `Comentário ${i}`]
      );
    }
    console.log("100 avaliações inseridas com sucesso!");
  }

  async populaInteresses() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_interesses (ce_id_cliente, ce_id_categoria) VALUES ($1, $2)`,
        [i, (i % 10) + 1]
      );
    }
    console.log("100 interesses inseridos com sucesso!");
  }

  async populaEnderecos() {
    for (let i = 1; i <= 100; i++) {
      await pool.query(
        `INSERT INTO tbl_enderecos (ce_id_cliente, logradouro, numero, complemento, bairro, cidade, estado, cep) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          i,
          `Rua ${i}`,
          `${i}`,
          `Complemento ${i}`,
          `Bairro ${i}`,
          `Cidade ${i}`,
          `Estado ${i}`,
          `00000-${i}`,
        ]
      );
    }
    console.log("100 endereços inseridos com sucesso!");
  }
}

const banco = new BancoTechStore();

banco.popular();
