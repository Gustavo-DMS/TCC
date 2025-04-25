from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_geek():
    return {'teste': 'lionel2'} , 500
