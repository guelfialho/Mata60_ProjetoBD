const pool = require("./db");

class StoredProcedures {
  async criar() {
    await this.criaProcedureProcessarVenda();
    await this.criaProcedureAtualizarMaterializedViews();
  }

  async criaProcedureProcessarVenda() {
    const query = `
      CREATE OR REPLACE PROCEDURE sp_processar_venda(
          IN p_id_produto INT,
          IN p_id_cliente INT,
          IN p_quantidade INT
      )
      LANGUAGE plpgsql
      AS $$
      DECLARE
          v_id_produto_fornecedor INT;
          v_quantidade_disponivel INT;
          v_valor_total FLOAT;
          v_preco_produto FLOAT;
      BEGIN
          SELECT
              id_produto_fornecedor,
              quantidade_em_estoque
          INTO
              v_id_produto_fornecedor,
              v_quantidade_disponivel
          FROM
              tbl_produtos_fornecedores
          WHERE
              ce_id_produto = p_id_produto
              AND quantidade_em_estoque >= p_quantidade
          ORDER BY
              quantidade_em_estoque DESC
          LIMIT 1;

          IF v_id_produto_fornecedor IS NULL THEN
              RAISE EXCEPTION 'Estoque insuficiente para o produto % com a quantidade %',
              p_id_produto,
              p_quantidade;
          END IF;

          SELECT preco INTO v_preco_produto
          FROM tbl_produtos
          WHERE id_produto = p_id_produto;

          v_valor_total := v_preco_produto * p_quantidade;

          INSERT INTO tbl_vendas (
              ce_id_produto_fornecedor,
              ce_id_cliente,
              quantidade,
              valor_total
          )
          VALUES (v_id_produto_fornecedor, p_id_cliente, p_quantidade, v_valor_total);

          UPDATE tbl_clientes
          SET realizou_compra = TRUE
          WHERE id_cliente = p_id_cliente;

          UPDATE tbl_produtos_fornecedores
          SET quantidade_em_estoque = quantidade_em_estoque - p_quantidade
          WHERE id_produto_fornecedor = v_id_produto_fornecedor;

          COMMIT;
      END;
      $$;
    `;
    await pool.query(query);
    console.log("Stored procedure sp_processar_venda criada com sucesso!");
  }

  async criaProcedureAtualizarMaterializedViews() {
    const query = `
    CREATE OR REPLACE PROCEDURE sp_atualizar_materialized_views()
    LANGUAGE plpgsql
    AS $$

    BEGIN

    REFRESH MATERIALIZED VIEW mv_quantidade_estoque_por_categoria;
    RAISE NOTICE 'Materialized View mv_quantidade_estoque_por_categoria atualizada com sucesso!';

    REFRESH MATERIALIZED VIEW mv_perfil_demografico_clientes_compras;
    RAISE NOTICE 'Materialized View mv_perfil_demografico_clientes_compras atualizada com sucesso!';
END;
$$;
`;
    await pool.query(query);
    console.log(
      "Stored procedure sp_atualizar_materialized_views criada com sucesso!"
    );
  }
}

const storedProcedures = new StoredProcedures();
storedProcedures.criar();
