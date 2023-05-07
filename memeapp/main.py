import json

import flask, requests, json
from flask import Flask, request, make_response, jsonify

app = Flask(__name__)


@app.get("/get_memes")
def get_memes():
    response = requests.get("https://api.imgflip.com/get_memes")
    memes = response.json()['data']['memes']
    output = jsonify(memes[:10])
    return output, 200

@app.get("/logo.png")
def plugin_logo():
    filename = 'logo.png'
    return flask.send_file(filename, mimetype='image/png')

@app.get("/.well-known/ai-plugin.json")
def plugin_manifest():
    host = request.headers['Host']
    with open("./.well-known/ai-plugin.json") as f:
        text = f.read()
        response = make_response(text, 200)
        response.mimetype = "text/json"
        return response

@app.get("/openapi.yaml")
def openapi_spec():
    host = request.headers['Host']
    with open("openapi.yaml") as f:
        text = f.read()
        response = make_response(text, 200)
        response.mimetype = "text/plain"
        return response

def main():
    app.run(debug=True, host="0.0.0.0", port=5003)

if __name__ == "__main__":
    main()