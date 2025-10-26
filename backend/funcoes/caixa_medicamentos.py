from datetime import datetime
from flask import Blueprint, json, jsonify, request
import psycopg
from psycopg.rows import dict_row
from utils.utils import fetch_db, manage_sensitive


caixa_medicamentos = Blueprint("caixa_medicamentos", __name__)


@caixa_medicamentos.route("/caixa_medicamentos", methods=["POST"])
def cadastro():
    body = request.get_data()
    body = json.loads(body)
    print(body)

    if "id_caixa" not in body or "uid_tag" not in body:
        return jsonify({"message": "Missing fields"}), 400

    database_url = manage_sensitive("DATABASE_URL")
    print("aqui", database_url)
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()

    result = cur.execute(
        "SELECT * FROM vw_historico_estoque_beiraleito where id_caixa = %s and uuid_terminal = %s",
        (body["id_caixa"], body["uid_tag"]),
    ).fetchone()

    response = None

    if result:
        cur.execute(
            "UPDATE tb_historico_estoque SET dt_consumo_beiraleito = %s WHERE id = %s",
            (datetime.now(), result["id"]),
        )

        response = jsonify(), 200
    else:
        response = jsonify({"message": "Unauthorized"}), 401

    conn.commit()
    conn.close()

    return response
