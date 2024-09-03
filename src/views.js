const pool = require("./db");

class ViewsCreator {
  async criarViews() {
    await this.criarVwDistribuicaoNotasAvaliacoes();
    await this.criarVwPerfilDemograficoClientesCompras();
    await this.criarVwProporcaoInteressesCategorias();
    await this.criarVwTicketMedioPorCategoria();
    await this.criarVwClientesCompraramVsTotal();
    await this.criarVwQuantidadeTotalEstoqueProduto();
    await this.criarVwCustoTotalEstoque();
    await this.criarVwQuantidadeEstoquePorCategoria();
    await this.criarVwCustoMedioAquisicaoPorProduto();
    await this.criarVwTotalVendasPorCliente();
  }

  async criarVwDistribuicaoNotasAvaliacoes() {
    const query = `
      CREATE OR REPLACE VIEW vw_distribuicao_notas_avaliacoes AS
      SELECT nota, COUNT(*) AS quantidade
      FROM tbl_avaliacoes
      GROUP BY nota
      ORDER BY nota;
    `;
    await pool.query(query);
    console.log("View vw_distribuicao_notas_avaliacoes criada com sucesso!");
  }

  async criarVwPerfilDemograficoClientesCompras() {
    const query = `
      CREATE OR REPLACE VIEW vw_perfil_demografico_clientes_compras AS
        SELECT
          c.sexo,
          COUNT(v.id_venda) AS quantidade_compras
        FROM
          tbl_clientes c
        JOIN
         tbl_vendas v ON c.id_cliente = v.ce_id_cliente
        WHERE
          c.deleted = FALSE
        GROUP BY
         c.sexo
        ORDER BY
          quantidade_compras DESC;
    `;
    await pool.query(query);
    console.log(
      "View vw_perfil_demografico_clientes_compras criada com sucesso!"
    );
  }

  async criarVwProporcaoInteressesCategorias() {
    const query = `
      CREATE OR REPLACE VIEW vw_proporcao_interesses_categorias AS
      SELECT c.nome AS categoria, COUNT(i.id_interesse) AS quantidade_clientes,
      ROUND(COUNT(i.id_interesse)::numeric / (SELECT COUNT(*) FROM tbl_clientes) * 100, 2) AS proporcao
      FROM tbl_interesses i
      JOIN tbl_categorias c ON c.id_categoria = i.ce_id_categoria
      GROUP BY c.nome
      ORDER BY proporcao DESC;
    `;
    await pool.query(query);
    console.log("View vw_proporcao_interesses_categorias criada com sucesso!");
  }

  async criarVwTicketMedioPorCategoria() {
    const query = `
      CREATE OR REPLACE VIEW vw_ticket_medio_por_categoria AS
      SELECT c.nome AS categoria, AVG(v.valor_total) AS ticket_medio
      FROM tbl_vendas v
      JOIN tbl_produtos_fornecedores pf ON pf.id_produto_fornecedor = v.ce_id_produto_fornecedor
      JOIN tbl_produtos p ON p.id_produto = pf.ce_id_produto
      JOIN tbl_categorias c ON c.id_categoria = p.ce_categoria
      GROUP BY c.nome
      ORDER BY ticket_medio DESC;
    `;
    await pool.query(query);
    console.log("View vw_ticket_medio_por_categoria criada com sucesso!");
  }

  async criarVwClientesCompraramVsTotal() {
    const query = `
    CREATE OR REPLACE VIEW vw_clientes_compraram_vs_total AS
    SELECT
      COUNT(DISTINCT v.ce_id_cliente) AS clientes_compraram,
      COUNT(*) AS total_clientes,
      ROUND(COUNT(DISTINCT v.ce_id_cliente)::numeric / COUNT(*) * 100, 2) AS proporcao
    FROM
      tbl_clientes c
    LEFT JOIN
      tbl_vendas v ON c.id_cliente = v.ce_id_cliente
    WHERE
      c.deleted = FALSE;
  `;
    await pool.query(query);
    console.log("View vw_clientes_compraram_vs_total criada com sucesso!");
  }

  async criarVwQuantidadeTotalEstoqueProduto() {
    const query = `
      CREATE OR REPLACE VIEW vw_quantidade_total_estoque_produto AS
      SELECT p.nome AS produto, SUM(pf.quantidade_em_estoque) AS quantidade_total_estoque
      FROM tbl_produtos p
      JOIN tbl_produtos_fornecedores pf ON p.id_produto = pf.ce_id_produto
      GROUP BY p.nome
      ORDER BY quantidade_total_estoque DESC;
    `;
    await pool.query(query);
    console.log("View vw_quantidade_total_estoque_produto criada com sucesso!");
  }

  async criarVwCustoTotalEstoque() {
    const query = `
      CREATE OR REPLACE VIEW vw_custo_total_estoque AS
      SELECT p.nome AS produto, SUM(pf.quantidade_em_estoque * pf.preco_fornecimento) AS custo_total_estoque
      FROM tbl_produtos p
      JOIN tbl_produtos_fornecedores pf ON p.id_produto = pf.ce_id_produto
      GROUP BY p.nome
    `;
    await pool.query(query);
    console.log("View vw_custo_total_estoque criada com sucesso!");
  }

  async criarVwQuantidadeEstoquePorCategoria() {
    const query = `
      CREATE OR REPLACE VIEW vw_quantidade_estoque_por_categoria AS
      SELECT c.nome AS categoria, SUM(pf.quantidade_em_estoque) AS quantidade_total_estoque
      FROM tbl_categorias c
      JOIN tbl_produtos p ON c.id_categoria = p.ce_categoria
      JOIN tbl_produtos_fornecedores pf ON p.id_produto = pf.ce_id_produto
      GROUP BY c.nome;
    `;
    await pool.query(query);
    console.log("View vw_quantidade_estoque_por_categoria criada com sucesso!");
  }

  async criarVwCustoMedioAquisicaoPorProduto() {
    const query = `
    CREATE OR REPLACE VIEW vw_custo_medio_aquisicao_por_produto AS
    SELECT
      p.nome AS produto,
      AVG(pf.preco_fornecimento) AS custo_medio_aquisicao
    FROM
      tbl_produtos p
    JOIN
      tbl_produtos_fornecedores pf ON p.id_produto = pf.ce_id_produto
    GROUP BY
      p.nome
    ORDER BY
      custo_medio_aquisicao DESC;
  `;
    await pool.query(query);
    console.log(
      "View vw_custo_medio_aquisicao_por_produto criada com sucesso!"
    );
  }

  async criarVwTotalVendasPorCliente() {
    const query = `
      CREATE OR REPLACE VIEW vw_total_vendas_por_cliente AS
      SELECT
          c.nome AS nome_cliente,
          SUM(v.valor_total) AS total_vendas
      FROM
          tbl_clientes c
      JOIN
          tbl_vendas v ON c.id_cliente = v.ce_id_cliente
      WHERE
          c.deleted = FALSE
      GROUP BY
          c.nome
      ORDER BY
          total_vendas DESC;
    `;
    await pool.query(query);
    console.log("View vw_total_vendas_por_cliente criada com sucesso!");
  }
}

const viewsCreator = new ViewsCreator();
viewsCreator.criarViews();
