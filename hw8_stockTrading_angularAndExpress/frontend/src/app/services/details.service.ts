import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private http: HttpClient) { }

  getDescription(ticker) {
    return this.http.get('https://tradingapp-294407.wl.r.appspot.com/api/description/' + ticker);
  }

  getLatestPrice(tickers) {
    return this.http.get('https://tradingapp-294407.wl.r.appspot.com/api/latestPrice/' + tickers);
  }

  getLatestNews(ticker) {
    return this.http.get('https://tradingapp-294407.wl.r.appspot.com/api/latestNews/' + ticker);
  }

  getHistoryCharts(ticker) {
    return this.http.get('https://tradingapp-294407.wl.r.appspot.com/api/history/' + ticker);
  }

  getDailyCharts(date, ticker) {
    return this.http.get('https://tradingapp-294407.wl.r.appspot.com/api/daily/' + date + "/ticker/" + ticker);
  }
}
