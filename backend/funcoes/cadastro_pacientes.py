from datetime import datetime
from flask import Blueprint, json, jsonify, request
from dotenv import load_dotenv
import os
import psycopg
from psycopg.rows import dict_row
from utils.utils import fetch_db, manage_sensitive


cadastro_pacientes = Blueprint("cadastroPaciente", __name__)


@cadastro_pacientes.route("/cadastroPaciente", methods=["POST"])
def teste():
    body = request.get_data()
    body = json.loads(body)

    if "paciente" not in body or "leito" not in body:
        return jsonify({"message": "Campos faltando"}), 400

    database_url = manage_sensitive("DATABASE_URL")
    print("aqui", database_url)
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()

    data = datetime.now()

    cur.execute(
        "INSERT INTO rl_paciente_terminal_beiraleito (id_paciente, id_terminal, dt_ativacao,ativo) VALUES (%s, %s, %s, %s)",
        (body["paciente"], body["leito"], data, True),
    )
    conn.commit()
    conn.close()

    return jsonify({"message": body}), 200


@cadastro_pacientes.route("/cadastroPaciente", methods=["GET"])
def resgatar():
    database_url = manage_sensitive("DATABASE_URL")
    print("aqui", database_url)
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()
    leitos = cur.execute("SELECT * FROM vw_leitos_disponiveis").fetchall()
    pacientes = cur.execute("SELECT * FROM vw_pacientes_livres").fetchall()
    conn.close()

    return jsonify({"leitos": leitos, "pacientes": pacientes}), 200


@cadastro_pacientes.route("/cadastroPaciente/controle", methods=["GET"])
def resgatar_controle():
    database_url = manage_sensitive("DATABASE_URL")
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()
    paciente_leitos = cur.execute(
        "SELECT * FROM vw_pacientes_leitos WHERE ativo is true"
    ).fetchall()
    print(paciente_leitos)
    return jsonify({"data": paciente_leitos}), 200


@cadastro_pacientes.route("/cadastroPaciente/controle", methods=["POST"])
def saida_pacientes():
    body = request.get_data()
    body = json.loads(body)

    if "id" not in body:
        return jsonify({"message": "Missing fields"}), 400

    print(body)

    database_url = manage_sensitive("DATABASE_URL")
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    conn = psycopg.connect(database_url, row_factory=dict_row)
    cur = conn.cursor()

    cur.execute(
        "UPDATE rl_paciente_terminal_beiraleito SET ativo = false, dt_desativacao = %s WHERE id = ANY(%s)",
        (datetime.now(), body["id"]),
    )
    conn.commit()
    conn.close()

    return jsonify({"message": body}), 200
