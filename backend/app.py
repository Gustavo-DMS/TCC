from flask import Flask
from funcoes.auth import auth
import psycopg

from utils.utils import manage_sensitive

app = Flask(__name__)


@app.route("/")
def hello_geek():
    sql_result = ""
    database_url = manage_sensitive("DATABASE_URL")
    if database_url is None:
        raise ValueError("DATABASE_URL not set")
    with psycopg.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM tb_paciente")
            sql_result = cur.fetchall()
    return {"teste": sql_result}, 200


app.register_blueprint(auth)
