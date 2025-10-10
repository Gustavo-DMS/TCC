from datetime import datetime
from flask import Blueprint, json, jsonify, request
from dotenv import load_dotenv
import os
import psycopg
from psycopg.rows import dict_row
from utils.utils import fetch_db, manage_sensitive


saida_medicamentos = Blueprint("saida_medicamentos", __name__)


@saida_medicamentos.route("/saidaMedicamentos", methods=["POST"])
def cadastro():
    body = request.get_data()
    body = json.loads(body)
    print(body)

    if (
        "medicamento" not in body
        or "quantidade" not in body
        or "leito" not in body
        or "caixa" not in body
        or "funcionario_responsavel" not in body
        or "funcionario_registro" not in body
    ):
        return jsonify({"message": "Missing fields"}), 400

    database_url = manage_sensitive("DATABASE_URL")
    print("aqui", database_url)
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()

    data = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cur.execute(
        "INSERT INTO tb_historico_estoque (id_estoque,id_funcionario_responsavel,id_terminal_origem,id_terminal_destino,quantidade,dt_saida_farmacia,id_caixa_transporte,id_funcionario_registro) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (
            body["medicamento"],
            body["funcionario_responsavel"],
            1,
            body["leito"],
            body["quantidade"],
            data,
            body["caixa"],
            body["funcionario_registro"],
        ),
    )
    cur.execute(
        "UPDATE tb_estoque SET quantidade_atual = quantidade_atual - %s WHERE id = %s",
        (body["quantidade"], body["medicamento"]),
    )
    conn.commit()
    conn.close()

    return jsonify({"message": body}), 200


@saida_medicamentos.route("/saidaMedicamentos", methods=["GET"])
def resgate():
    database_url = manage_sensitive("DATABASE_URL")
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()
    leitos = cur.execute(
        "SELECT CONCAT(tb_paciente.nome,' - ', tb_terminal.descricao) as descricao, rl_paciente_terminal_beiraleito.id FROM rl_paciente_terminal_beiraleito left join tb_paciente on rl_paciente_terminal_beiraleito.id_paciente = tb_paciente.id left join tb_terminal on rl_paciente_terminal_beiraleito.id_terminal = tb_terminal.id where rl_paciente_terminal_beiraleito.ativo is true"
    ).fetchall()
    caixas = cur.execute(
        "SELECT * from tb_caixa_transporte where ativo is true "
    ).fetchall()
    funcionarios = cur.execute(
        "SELECT id,nome from tb_funcionario where ativo = true"
    ).fetchall()

    conn.close()

    return (
        jsonify({"leitos": leitos, "caixas": caixas, "funcionarios": funcionarios}),
        200,
    )


@saida_medicamentos.route("/saidaMedicamentos/caixa", methods=["GET"])
def verificar():

    id_estoque = request.args.get("id")
    if id_estoque is None:
        return jsonify({"error": "Campos Faltando"}), 400

    if not id_estoque.isdigit():
        return jsonify({"error": "Indentificador da caixa deve sem um numero"}), 400

    database_url = manage_sensitive("DATABASE_URL")
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()
    medicamentos = cur.execute(
        "SELECT * from vw_estoque_medicamento where id = %s", (id_estoque,)
    ).fetchone()

    conn.close()

    return jsonify({"medicamentos": medicamentos}), 200
