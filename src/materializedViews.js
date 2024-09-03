const pool = require("./db");

class MaterializedViews {
  async criar() {
    await this.criaMaterializedViewQuantidadeEstoquePorCategoria();
    await this.criaMaterializedViewPerfilDemograficoClientesCompras();
  }

  async criaMaterializedViewQuantidadeEstoquePorCategoria() {
    const query = `
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_quantidade_estoque_por_categoria AS
      SELECT
          c.nome AS categoria,
          SUM(pf.quantidade_em_estoque) AS quantidade_total_estoque
      FROM
          tbl_categorias c
      JOIN
          tbl_produtos p ON c.id_categoria = p.ce_categoria
      JOIN
          tbl_produtos_fornecedores pf ON p.id_produto = pf.ce_id_produto
      WHERE
          c.deleted = FALSE
          AND p.deleted = FALSE
          AND pf.deleted = FALSE
      GROUP BY
          c.nome
      ORDER BY
          quantidade_total_estoque DESC;
    `;
    await pool.query(query);
    console.log(
      "Materialized View mv_quantidade_estoque_por_categoria criada com sucesso!"
    );
  }

  async criaMaterializedViewPerfilDemograficoClientesCompras() {
    const query = `
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_perfil_demografico_clientes_compras AS
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
      "Materialized View mv_perfil_demografico_clientes_compras criada com sucesso!"
    );
  }
}

const materializedViews = new MaterializedViews();

materializedViews.criar();
