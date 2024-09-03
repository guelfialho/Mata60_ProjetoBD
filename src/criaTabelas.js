const pool = require("./db");

class Tabelas {
  async criar() {
    await this.criaTabelaCategorias();
    await this.criaTabelaProdutos();
    await this.criaTabelaFornecedores();
    await this.criaTabelaClientes();
    await this.criaTabelaProdutosFornecedores();
    await this.criaTabelaVendas();
    await this.criaTabelaAvaliacoes();
    await this.criaTabelaInteresses();
    await this.criaTabelaEnderecos();
  }
  async criaTabelaCategorias() {
    await pool.query(`
      CREATE TABLE tbl_categorias (
        id_categoria SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        deleted BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Tabela tbl_categorias criada com sucesso!");
    return;
  }

  async criaTabelaProdutos() {
    await pool.query(`
      CREATE TABLE tbl_produtos (
        id_produto SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        ce_categoria INT NOT NULL REFERENCES tbl_categorias(id_categoria),
        marca TEXT NOT NULL,
        descricao TEXT NOT NULL,
        preco FLOAT NOT NULL,
        deleted BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Tabela tbl_produtos criada com sucesso");
    return;
  }

  async criaTabelaFornecedores() {
    await pool.query(`
      CREATE TABLE tbl_fornecedores (
        id_fornecedor SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        cnpj TEXT NOT NULL,
        avaliacao INT CHECK(avaliacao >= 1 AND avaliacao <= 5) NOT NULL,
        deleted BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Tabela tbl_fornecedores criada com sucesso");
    return;
  }

  async criaTabelaClientes() {
    await pool.query(`
      CREATE TABLE tbl_clientes (
        id_cliente SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        realizou_compra BOOLEAN DEFAULT FALSE,
        sexo CHAR(1) NOT NULL CHECK(sexo IN ('M', 'F')),
        deleted BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Tabela tbl_clientes criada com sucesso");
    return;
  }
  async criaTabelaProdutosFornecedores() {
    await pool.query(`
      CREATE TABLE tbl_produtos_fornecedores (
        id_produto_fornecedor SERIAL PRIMARY KEY,
        ce_id_produto INT NOT NULL REFERENCES tbl_produtos(id_produto),
        ce_id_fornecedor INT NOT NULL REFERENCES tbl_fornecedores(id_fornecedor),
        quantidade_em_estoque INT NOT NULL,
        preco_fornecimento FLOAT NOT NULL,
        deleted BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Tabela tbl_produtos_fornecedores criada com sucesso");
    return;
  }
  async criaTabelaVendas() {
    await pool.query(`
      CREATE TABLE tbl_vendas (
        id_venda SERIAL PRIMARY KEY,
        ce_id_produto_fornecedor INT NOT NULL REFERENCES tbl_produtos_fornecedores(id_produto_fornecedor),
        ce_id_cliente INT NOT NULL REFERENCES tbl_clientes(id_cliente),
        quantidade INT NOT NULL,
        valor_total FLOAT NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Tabela tbl_vendas criada com sucesso");
    return;
  }

  async criaTabelaAvaliacoes() {
    await pool.query(`
      CREATE TABLE tbl_avaliacoes (
        id_avaliacao SERIAL PRIMARY KEY,
        ce_id_produto INT NOT NULL REFERENCES tbl_produtos(id_produto),
        ce_id_cliente INT NOT NULL REFERENCES tbl_clientes(id_cliente),
        nota INT CHECK(nota >= 1 AND nota <= 5) NOT NULL,
        comentario TEXT
      );
    `);
    console.log("Tabela tbl_avaliacoes criada com sucesso");
    return;
  }
  async criaTabelaInteresses() {
    await pool.query(`
      CREATE TABLE tbl_interesses (
        id_interesse SERIAL PRIMARY KEY,
        ce_id_cliente INT NOT NULL REFERENCES tbl_clientes(id_cliente),
        ce_id_categoria INT NOT NULL REFERENCES tbl_categorias(id_categoria),
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Tabela tbl_interesses criada com sucesso");
    return;
  }

  async criaTabelaEnderecos() {
    await pool.query(`
      CREATE TABLE tbl_enderecos (
        id_endereco SERIAL PRIMARY KEY,
        ce_id_cliente INT NOT NULL REFERENCES tbl_clientes(id_cliente),
        logradouro TEXT NOT NULL,
        numero TEXT NOT NULL,
        complemento TEXT,
        bairro TEXT NOT NULL,
        cidade TEXT NOT NULL,
        estado TEXT NOT NULL,
        cep TEXT NOT NULL,
        deleted BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Tabela tbl_enderecos criada com sucesso");
    return;
  }
}

const tabelas = new Tabelas();

tabelas.criar();
