from flask import Flask
from os import environ
import psycopg

app = Flask(__name__)


def manage_sensitive(name):
    secret_fpath = f"/run/secrets/{name}"
    if environ.get("FLASK_DEBUG") == "1":
        return environ.get(name)

    v2 = open(secret_fpath).read().rstrip("\n")
    return v2


@app.route("/")
def hello_geek():
    sql_result = ""
    with psycopg.connect(manage_sensitive("DATABASE_URL")) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM tb_paciente")
            sql_result = cur.fetchall()
    return {"teste": sql_result}, 200
