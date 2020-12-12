from flask import Flask, request, render_template, jsonify, make_response
from flask_cors import CORS, cross_origin
import requests

app = Flask(__name__, static_url_path="/static")
app.debug = True

tokenKey = "fad45d1f2c44255694e0a1097dd26c53562adb96"
newsAPIKey = "c5e95bd6233e4f378e05a7f56ceb442e"


@app.route("/companyOutlook", methods=["GET"])
@cross_origin()
def get_company_outlook():
    if request.method == "GET":
        ticker = request.args.get("ticker")
        response = requests.get(
            "https://api.tiingo.com/tiingo/daily/" + ticker + "?token=" + tokenKey
        )
        jsonObject = response.json()
        return jsonify(jsonObject)


@app.route("/stockSummary", methods=["GET"])
@cross_origin()
def get_stock_summary():
    if request.method == "GET":
        ticker = request.args.get("ticker")
        response = requests.get(
            "https://api.tiingo.com/iex/" + ticker + "?token=" + tokenKey
        )
        jsonObject = response.json()
        return jsonify(jsonObject)


@app.route("/charts", methods=["GET"])
@cross_origin()
def get_charts():
    if request.method == "GET":
        ticker = request.args.get("ticker")
        sixMonthFromToday = request.args.get("sixMonthFromToday")
        response = requests.get(
            "https://api.tiingo.com/iex/"
            + ticker
            + "/prices?startDate="
            + sixMonthFromToday
            + "&resampleFreq=12hour&columns=close,volume&token="
            + tokenKey
        )
        jsonObject = response.json()
        return jsonify(jsonObject)


@app.route("/latestNews", methods=["GET"])
@cross_origin()
def get_latest_news():
    if request.method == "GET":
        ticker = request.args.get("ticker")
        response = requests.get(
            "https://newsapi.org/v2/everything?apiKey=" + newsAPIKey + "&q=" + ticker
        )
        jsonObject = response.json()
        return jsonify(jsonObject)


@app.route("/", methods=["GET"])
@cross_origin()
def get_static_files():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)