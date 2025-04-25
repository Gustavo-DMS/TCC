from flask import Flask
from os import environ
app = Flask(__name__)

@app.route('/')
def hello_geek():
    NEXT_PUBLIC_TESTE=environ.get("NEXT_PUBLIC_TESTE")
    return {'teste': NEXT_PUBLIC_TESTE} , 500
