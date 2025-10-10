from datetime import datetime
from flask import Blueprint, json, jsonify, request, make_response
import psycopg
from psycopg.rows import dict_row
from utils.utils import fetch_db, manage_sensitive, gerar_pdf_etiquetas

cadastro_farmacos = Blueprint("cadastro_farmacos", __name__)


@cadastro_farmacos.route("/cadastroFarmacos", methods=["GET"])
def resgate():
    database_url = manage_sensitive("DATABASE_URL")
    # print("aqui", database_url)
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()
    farmacos = cur.execute(
        "SELECT id,nome,apresentacao FROM tb_medicamento WHERE ativo = true and qtde is not null"
    ).fetchall()
    conn.close()

    return jsonify({"farmacos": farmacos}), 200


@cadastro_farmacos.route("/cadastroFarmacos", methods=["POST"])
def cadastro():
    body = request.get_data()
    body = json.loads(body)

    database_url = manage_sensitive("DATABASE_URL")
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(
        database_url, row_factory=dict_row, cursor_factory=psycopg.ClientCursor
    )
    cur = conn.cursor()

    cur.execute("SELECT qtde FROM tb_medicamento WHERE id = %s", (body["farmaco"],))

    qtde_medicamento = cur.fetchone()

    # Insert multiple rows with a single query
    args_str = ",".join(
        cur.mogrify(
            "(%s, %s, %s, %s, %s)",
            (
                body["farmaco"],
                qtde_medicamento["qtde"],
                datetime.now(),
                body["dt_vencimento"],
                body["lote"],
            ),
        )
        for i in range(body["quantidade"])
    )

    farmacos = cur.execute(
        """INSERT INTO public.tb_estoque
(id_medicamento, quantidade_atual, dt_registro, d_vencimento,lote) VALUES
"""
        + args_str
        + """
RETURNING id""",
    )
    conn.commit()
    conn.close()

    farmacos = farmacos.fetchall()
    print(farmacos)

    pdf = gerar_pdf_etiquetas(farmacos)
    response = make_response(bytes(pdf))
    response.headers["Content-Type"] = "application/pdf"
    return response
