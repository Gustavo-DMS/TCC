from flask import Flask
from os import environ
import psycopg
app = Flask(__name__)

@app.route('/')
def hello_geek():
    sql_result = ''
    with psycopg.connect(environ.get("DATABASE_URL")) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM tb_paciente")
            sql_result = cur.fetchall()
    return {'teste': sql_result} , 500
