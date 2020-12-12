import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DetailsService } from 'src/app/services/details.service';
import { DescriptionModelServer, LatestPriceModelServer, LatestNewsModelServer } from '../../models/details.model';

import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";

import HighchartsData from "highcharts/modules/data";
import HighchartsDragPanes from "highcharts/modules/drag-panes";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import Indicators from "highcharts/indicators/indicators";
import VBP from "highcharts/indicators/volume-by-price";

HighchartsData(Highcharts);
HighchartsDragPanes(Highcharts);
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);
HighchartsAccessibility(Highcharts);
Indicators(Highcharts);
VBP(Highcharts);

import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/services/util.service';
import { NewsDialogComponent } from '../news-dialog/news-dialog.component';
import { BuyDialogComponent } from '../buy-dialog/buy-dialog.component';
import { BuyDetailsDialogComponent } from '../buy-details-dialog/buy-details-dialog.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  isValidTicker: any;
  description: any;
  latestPrice: any;
  articles: any;
  latestNews: any;
  history: any;

  dailyChartJSON: any;
  historyDataJSON: any;

  selectedTicker: any;
  isMarketOpen: any;
  currentDateTime: any = {};
  summaryData: any;
  arrowFlag: any;

  DailyCharts: typeof Highcharts = Highcharts;
  dailyChartsOptions: any;
  HistoricalCharts: typeof Highcharts = Highcharts;
  historicalChartsOptions: any;

  isInWatchlist: boolean;
  watchlist: any;

  modalQuantity: any;
  modalTotal: any;
  modalCurrentPrice: any;
  modalBuyIsDisabled: any;

  isHistoryChartLoaded: any = false;
  isLoading: any = true;

  isDailyChartLoaded: any = false;

  constructor(private detailsService: DetailsService, private router: Router, private modalService: NgbModal, private utilService: UtilService) {
    this.selectedTicker = this.router.url.substr(9);
    this.watchlist = JSON.parse(localStorage.getItem('watchlist'));

    if (this.watchlist) {
      if (this.watchlist.find(el => el.ticker.toUpperCase() === this.selectedTicker.toUpperCase())) {
        this.isInWatchlist = true;
      }
      else {
        this.isInWatchlist = false;
      }
    } else {
      this.isInWatchlist = false;
    }
  }

  ngOnInit(): void {
    this.getCurrentDateTime();
    this.callDescriptionAPI();
    this.callLatestPriceAPI();
    this.callLatestNewsAPI();
  }

  callDescriptionAPI() {
    this.detailsService.getDescription(this.selectedTicker).subscribe(
      (json) => {
        this.isValidTicker = true;
        this.description = json;
        if (this.description.error == "/description/:ticker not found") {
          this.isValidTicker = false;
        }
      },
      (error) => {
        console.log("API error");
        console.log(error);
      }
    );
  }

  callLatestPriceAPI() {
    this.detailsService.getLatestPrice(this.selectedTicker).subscribe(
      (json: any) => {
        this.latestPrice = json[0];
        this.getCurrentDateTime();
        this.calculateMarketOpen();
        this.setSummaryData();
        this.callDailyChartsAPI();
      },
      (error) => {
        console.log("API error");
        console.log(error);
      }
    );
    setInterval(() => {
      this.detailsService.getLatestPrice(this.selectedTicker).subscribe(
        (json: any) => {
          this.latestPrice = json[0];
          this.getCurrentDateTime();
          this.calculateMarketOpen();
          this.setSummaryData();
          this.callDailyChartsAPI();
        },
        (error) => {
          console.log("API error");
          console.log(error);
        }
      );
    }, 15000);

  }

  callDailyChartsAPI() {
    this.detailsService.getDailyCharts(this.summaryData.timestamp.value.substr(0, 10), this.selectedTicker).subscribe(
      (json: any) => {
        this.dailyChartJSON = json;
        this.generateSummaryChart();
      },
      (error) => {
        console.log("API error");
        console.log(error);
      }
    );
  }

  callLatestNewsAPI() {
    this.detailsService.getLatestNews(this.selectedTicker).subscribe(
      (json: LatestNewsModelServer) => {
        this.latestNews = json;
        this.articles = this.latestNews.articles;
        let temp = this.articles.filter(el => el.source.name && el.publishedAt && el.title && el.description && el.url && el.urlToImage);

        this.articles = temp.slice(0, 20);
        this.latestNews.articles = this.articles
        this.isLoading = false;
      },
      (error) => {
        console.log("API error");
        console.log(error);
      }
    );
  }

  callHistoryChartAPI() {
    let data = [];
    this.detailsService.getHistoryCharts(this.selectedTicker).subscribe(
      (json) => {
        this.historyDataJSON = json;
        this.historyDataJSON.forEach(el => {
          data.push([new Date(el.date).valueOf(), el.open, el.high, el.low, el.close, el.volume]);
        });
        this.getSMAChart(data);
      },
      (error) => {
        console.log("API error");
        console.log(error);
      }
    );
  }

  toggleWatchlist() {
    this.watchlist = JSON.parse(localStorage.getItem('watchlist'));
    if (!this.isInWatchlist && this.watchlist === null) {
      let ticker = this.description.ticker;
      let name = this.description.name;
      let temp = [];
      temp.push({ "ticker": ticker, "name": name });
      localStorage.setItem('watchlist', JSON.stringify(temp));
      this.isInWatchlist = true;
      this.appendAlert("success", ticker.toUpperCase() + " added to Watchlist.");
    }
    else if (!this.isInWatchlist) {
      let ticker = this.description.ticker;
      let name = this.description.name;
      let temp = { "ticker": ticker, "name": name };
      let temp2 = this.watchlist.filter(el => el.ticker !== this.selectedTicker.toUpperCase());
      temp2.push(temp);
      localStorage.setItem('watchlist', JSON.stringify(temp2));
      this.isInWatchlist = true;
      this.appendAlert("success", ticker.toUpperCase() + " added to Watchlist.");
    }
    else if (this.isInWatchlist) {
      let ticker = this.description.ticker;
      let name = this.description.name;
      let temp = [];
      temp = this.watchlist.filter(el => el.ticker !== this.selectedTicker.toUpperCase());
      if (temp.length == 0) {
        localStorage.removeItem('watchlist');
      }
      else {
        localStorage.setItem('watchlist', JSON.stringify(temp));
      }
      this.isInWatchlist = false;
      this.appendAlert("danger", ticker.toUpperCase() + " removed from Watchlist.");
    }
  }

  convertDateTimeToPST(date) {
    let offset = 420;
    let offsetMillis = offset * 60 * 1000;
    let millis = date.getTime();
    let timeZoneOffset = (date.getTimezoneOffset() * 60 * 1000);

    let pst = millis - timeZoneOffset + offsetMillis;
    let currentDate = new Date(pst);

    return currentDate;
  }

  getCurrentDateTime() {
    let currentDate = new Date();
    currentDate = this.convertDateTimeToPST(currentDate);
    let now = new Date(currentDate);
    let currentDateEpoch = now.valueOf();

    let year: any = currentDate.getFullYear();
    let month: any = currentDate.getMonth() + 1;
    let day: any = currentDate.getDay();
    let date: any = currentDate.getDate();
    let hour: any = currentDate.getHours();
    let minute: any = currentDate.getMinutes();
    let second: any = currentDate.getSeconds();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (date.toString().length == 1) {
      date = '0' + date;
    }
    if (hour.toString().length == 1) {
      hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    if (second.toString().length == 1) {
      second = '0' + second;
    }
    let dateTime = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;

    this.currentDateTime.epoch = currentDateEpoch;
    this.currentDateTime.year = year;
    this.currentDateTime.month = month;
    this.currentDateTime.day = day;
    this.currentDateTime.date = date;
    this.currentDateTime.hour = hour;
    this.currentDateTime.min = minute;
    this.currentDateTime.sec = second;

    return dateTime;
  }

  calculateMarketOpen() {
    let timestampAPI = new Date(this.latestPrice.timestamp);
    timestampAPI = this.convertDateTimeToPST(timestampAPI);
    let timestampEpoch = timestampAPI.valueOf();
    if (this.currentDateTime.epoch - timestampEpoch < 60000) {
      this.isMarketOpen = true;
    }
    else {
      this.isMarketOpen = false;
    }
  }

  setSummaryData() {
    if (this.isMarketOpen) {
      this.summaryData = {
        highPrice: {
          title: "High Price: ",
          value: this.latestPrice.high ? this.latestPrice.high.toFixed(3) : '0',
        },
        lowPrice: {
          title: "Low Price: ",
          value: this.latestPrice.low ? this.latestPrice.low.toFixed(3) : '0',
        },
        openPrice: {
          title: "Open Price: ",
          value: this.latestPrice.open ? this.latestPrice.open.toFixed(3) : '0',
        },
        prevClose: {
          title: "Prev. Close: ",
          value: this.latestPrice.prevClose ? this.latestPrice.prevClose.toFixed(3) : '0',
        },
        volume: {
          title: "Volume: ",
          value: this.latestPrice.volume ? this.latestPrice.volume : '0',
        },
        midPrice: {
          title: "Mid Price: ",
          value: this.latestPrice.mid ? this.latestPrice.mid.toFixed(3) : '-',
        },
        askPrice: {
          title: "Ask Price: ",
          value: this.latestPrice.askPrice ? this.latestPrice.askPrice.toFixed(3) : '0',
        },
        askSize: {
          title: "Ask Size: ",
          value: this.latestPrice.askSize ? this.latestPrice.askSize.toFixed(3) : '0',
        },
        bidPrice: {
          title: "Bid Price: ",
          value: this.latestPrice.bidPrice ? this.latestPrice.bidPrice.toFixed(3) : '0',
        },
        bidSize: {
          title: "Bid Size: ",
          value: this.latestPrice.bidSize ? this.latestPrice.bidSize.toFixed(3) : '0',
        }
      }
    }
    else {
      this.summaryData = {
        highPrice: {
          title: "High Price: ",
          value: this.latestPrice.high ? this.latestPrice.high.toFixed(3) : '0',
        },
        lowPrice: {
          title: "Low Price: ",
          value: this.latestPrice.low ? this.latestPrice.low.toFixed(3) : '0',
        },
        openPrice: {
          title: "Open Price: ",
          value: this.latestPrice.open ? this.latestPrice.open.toFixed(3) : '0',
        },
        prevClose: {
          title: "Prev. Close: ",
          value: this.latestPrice.prevClose ? this.latestPrice.prevClose.toFixed(3) : '0',
        },
        volume: {
          title: "Volume: ",
          value: this.latestPrice.volume ? this.latestPrice.volume : '0',
        },
        midPrice: null,
        askPrice: null,
        askSize: null,
        bidPrice: null,
        bidSize: null,
      }
    }

    this.summaryData.timestamp = {
      title: "timestamp",
      value: this.latestPrice.timestamp ? this.latestPrice.timestamp : null,
    }
    this.summaryData.lastPrice = {
      title: "lastPrice",
      value: this.latestPrice.last ? this.latestPrice.last.toFixed(3) : '0',
    }
    this.summaryData.close = {
      title: "close",
      value: this.latestPrice.close ? this.latestPrice.close.toFixed(3) : '0',
    }
    this.summaryData.change = {
      title: "change",
      value: this.calculateChange(),
    }
    this.summaryData.changePercent = {
      title: "changePercent",
      value: this.calculateChangePercent(),
    }
    this.summaryData.currentDateTime = {
      title: "currentDateTime",
      value: this.currentDateTime.year + '-' + this.currentDateTime.month + '-' + this.currentDateTime.date + ' ' + this.currentDateTime.hour + ':' + this.currentDateTime.min + ':' + this.currentDateTime.sec
    }
    this.summaryData.color = {
      title: "color",
      value: this.getColor()
    }

  }

  getColor() {
    let color = this.utilService.calculateColor(this.calculateChange());
    return color;
  }

  calculateChange() {
    let diff = this.summaryData.lastPrice.value - this.summaryData.prevClose.value;
    return diff.toFixed(2);
  }

  calculateChangePercent() {
    let diff = this.summaryData.lastPrice.value - this.summaryData.prevClose.value;

    let diffPercent = (diff / this.summaryData.prevClose.value) * 100;
    return "(" + diffPercent.toFixed(2) + "%)";
  }

  getChangeValue(last, prevClose) {
    return this.utilService.calculateChange(last, prevClose);
  }

  getChangePercentValue(last, prevClose) {
    return this.utilService.calculateChangePercent(last, prevClose);
  }

  getColorValue(value) {
    let color = this.utilService.calculateColor(value);
    return color;
  }

  getIcon(value) {
    let color = this.utilService.calculateColor(value);
    if (color === "redColor") this.arrowFlag = -1;
    else if (color === "greenColor") this.arrowFlag = 1;
    else if (color === "blackColor") this.arrowFlag = 0;
    return this.arrowFlag;
  }

  getMarketStatusText() {
    if (this.isMarketOpen) {
      return "Market is Open";
    }
    else {
      let marketClosedDate = this.convertDateTimeToPST(new Date(this.summaryData.timestamp.value));

      let year: any = marketClosedDate.getFullYear();
      let month: any = marketClosedDate.getMonth() + 1;
      let day: any = marketClosedDate.getDay();
      let date: any = marketClosedDate.getDate();
      let hour: any = marketClosedDate.getHours();
      let minute: any = marketClosedDate.getMinutes();
      let second: any = marketClosedDate.getSeconds();
      if (month.toString().length == 1) {
        month = '0' + month;
      }
      if (date.toString().length == 1) {
        date = '0' + date;
      }
      if (hour.toString().length == 1) {
        hour = '0' + hour;
      }
      if (minute.toString().length == 1) {
        minute = '0' + minute;
      }
      if (second.toString().length == 1) {
        second = '0' + second;
      }
      let marketClosedOn = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
      return "Market Closed on " + marketClosedOn;
    }
  }

  generateSummaryChart() {
    let graphColor = "";
    if (this.summaryData.color.value === "redColor")
      graphColor = "#ff0000";
    else if (this.summaryData.color.value === "greenColor")
      graphColor = "#008000";
    else
      graphColor = "#000000";

    let chartData = [];

    if (this.dailyChartJSON) {
      this.dailyChartJSON.forEach(el => {
        chartData.push([new Date(el.date).valueOf(), el.close]);
        this.dailyChartsOptions = {
          time: {
            timezoneOffset: 420,
          },
          rangeSelector: {
            enabled: false
          },
          exporting: { enabled: false },
          title: {
            text: this.selectedTicker.toUpperCase()
          },
          series: [{
            type: "line",
            name: this.selectedTicker.toUpperCase(),
            data: chartData.length !== 0 ? chartData : null,
            color: graphColor
          }],
          navigator: {
            series: {
              fillOpacity: 1
            }
          },
        };
        this.isDailyChartLoaded = true;
      });
    }
  }

  getSMAChart(data) {
    let ohlc = [];
    let volume = [];
    let dataLength = data.length;
    let groupingUnits = [[
      'week',
      [1]
    ], [
      'month',
      [1, 2, 3, 4, 6]
    ]];

    let i = 0;

    for (i; i < dataLength; i += 1) {
      ohlc.push([
        data[i][0], // the date
        data[i][1], // open
        data[i][2], // high
        data[i][3], // low
        data[i][4] // close
      ]);

      volume.push([
        data[i][0], // the date
        data[i][5] // the volume
      ]);
    }

    this.historicalChartsOptions = {
      rangeSelector: {
        selected: 2
      },

      title: {
        text: this.selectedTicker.toUpperCase() + ' Historical'
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },


      exporting: { enabled: false },
      series: [{
        type: 'candlestick',
        name: 'AAPL',
        id: 'aapl',
        zIndex: 2,
        data: ohlc
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: 'aapl',
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    }
  }

  // --MODAL--

  openBuyModal(content) {
    this.modalService.open(content);
  }

  buyFromDetailsPage() {
    this.modalService.dismissAll();
    this.appendAlert("success", this.selectedTicker.toUpperCase() + " bought successfully!")
    this.addToLocalStorage();
  }

  getTotal() {
    this.modalCurrentPrice = this.summaryData.lastPrice.value;
    this.modalTotal = this.modalCurrentPrice * this.modalQuantity;
    if (this.modalTotal < 0)
      return '0.00';
    return this.modalTotal ? (this.modalTotal).toFixed(3) : '0.00';
  }

  setTotal(event) {
    this.modalQuantity = event.target.value;
    this.modalCurrentPrice = this.summaryData.lastPrice.value;
    this.modalTotal = this.modalCurrentPrice * this.modalQuantity;
    if (this.modalQuantity > 0) this.modalBuyIsDisabled = false;
    else this.modalBuyIsDisabled = true;
  }

  appendAlert(classType, message) {
    let alertContainer = document.getElementById("alertContainer");
    let alertDiv = document.createElement('div');
    alertDiv.innerHTML = message;
    alertDiv.setAttribute("class", "alertDiv text-center alert alert-" + classType);
    alertDiv.setAttribute("role", "alert");
    alertDiv.setAttribute("style", "margin: 10px 0;");
    let closeButton = document.createElement('button');
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("class", "close");
    closeButton.setAttribute("data-dismiss", "alert");
    closeButton.setAttribute("aria-label", "Close");
    let closeSpan = document.createElement('span');
    closeSpan.setAttribute("aria-hidden", "true");
    closeSpan.innerHTML = "&times;";
    closeButton.appendChild(closeSpan);
    alertDiv.appendChild(closeButton);
    alertContainer.prepend(alertDiv);
    setTimeout(
      function () {
        alertDiv.style.display = "none";
      }, 5000);
  }


  addToLocalStorage() {
    let portfolio = JSON.parse(localStorage.getItem('portfolio'));

    let ticker = this.selectedTicker.toUpperCase();
    let name = this.description.name;
    let quanityValue = this.modalQuantity;
    let currentPrice = this.modalCurrentPrice;
    let totalCost = quanityValue * currentPrice;

    if (portfolio) {
      if (portfolio.find(el => el.ticker.toUpperCase() === ticker.toUpperCase())) {
        let temp = portfolio.map(el => {
          if (el.ticker.toUpperCase() === ticker.toUpperCase()) {
            (el);
            el.quanityValue = parseInt(el.quanityValue) + parseInt(quanityValue);
            el.totalCost += totalCost;
            return el;
          }

        });
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
      }
      else {
        portfolio.push({ "ticker": ticker, "name": name, "quanityValue": quanityValue, "totalCost": totalCost });
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
      }
    }
    else {
      portfolio = [{ "ticker": ticker, "name": name, "quanityValue": quanityValue, "totalCost": totalCost }];
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }

  }

  openNewsDialog(news) {
    const newsModal = this.modalService.open(NewsDialogComponent);
    newsModal.componentInstance.source = news.source.name;
    newsModal.componentInstance.pubishedAt = this.utilService.convertDateFormat(news.publishedAt);
    newsModal.componentInstance.title = news.title;
    newsModal.componentInstance.newsDescription = news.description;
    newsModal.componentInstance.url = news.url;
  }

  displayHistoryChart(event) {
    if (event.index == 2 && !this.isHistoryChartLoaded) {
      this.callHistoryChartAPI();
      this.isHistoryChartLoaded = true;
    }
  }
}