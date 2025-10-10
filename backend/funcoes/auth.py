from flask import Blueprint, json, jsonify, request
from dotenv import load_dotenv
import os

from utils.utils import fetch_db


auth = Blueprint("auth", __name__)


@auth.route("/auth", methods=["POST"])
def teste():
    body = request.get_data()
    body = json.loads(body)
    user = fetch_db("SELECT * FROM tb_funcionario WHERE email = %s", (body["email"],))

    if len(user) == 0:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    return json.dumps(user), 200
