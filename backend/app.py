from flask import Flask, request
from flask_cors import CORS
from werkzeug.datastructures import headers
from funcoes.saida_medicamentos import saida_medicamentos
from funcoes.cadastro_farmacos import cadastro_farmacos
from funcoes.cadastro_pacientes import cadastro_pacientes
from funcoes.caixa_medicamentos import caixa_medicamentos
from funcoes.auth import auth

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_geek():
    data = {}
    for i in request.headers.keys():
        data[i] = request.headers.get(i)

    return {"teste": data}, 200


app.register_blueprint(auth)
app.register_blueprint(cadastro_pacientes)
app.register_blueprint(cadastro_farmacos)
app.register_blueprint(saida_medicamentos)
app.register_blueprint(caixa_medicamentos)
