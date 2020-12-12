import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;
const tokenKey = "fad45d1f2c44255694e0a1097dd26c53562adb96";
const newsAPIKey = "dfe7691dc1b4454b95fb3ad8e103a673";

app.use(bodyParser.json());
app.use(cors());

app.get('/api/description/:ticker', (req, res) => {
    axios.get('https://api.tiingo.com/tiingo/daily/' + req.params.ticker + '?token=' + tokenKey)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.json({ "error": "/description/:ticker not found" });
        })
});

app.get('/api/latestPrice/:ticker', (req, res) => {
    axios.get('https://api.tiingo.com/iex/' + req.params.ticker + '?token=' + tokenKey)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
});

function addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = '' + date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

app.get('/api/history/:ticker', (req, res) => {
    let sixMonthFromToday = addMonths(new Date(), -24);
    let resampleFreq = "daily";
    let request = 'https://api.tiingo.com/tiingo/daily/' + req.params.ticker + '/prices?startDate=' + sixMonthFromToday + '&token=' + tokenKey;
    axios.get(request)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
});

app.get('/api/daily/:date/ticker/:ticker', (req, res) => {
    let resampleFreq = "4min";
    let columns = "close"
    let request = 'https://api.tiingo.com/iex/' + req.params.ticker + '/prices?columns=' + columns + '&startDate=' + req.params.date + '&resampleFreq=' + resampleFreq + '&token=' + tokenKey;
    axios.get(request)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
});

app.get('/api/autocomplete/:searchString', (req, res) => {
    let request = 'https://api.tiingo.com/tiingo/utilities/search?query=' + req.params.searchString + '&limit=20' + '&token=' + tokenKey;
    axios.get(request)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
});

app.get('/api/latestNews/:searchString', (req, res) => {
    let request = 'https://newsapi.org/v2/everything?apiKey=' + newsAPIKey + '&q=' + req.params.searchString + "&pageSize=40";
    axios.get(request)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

