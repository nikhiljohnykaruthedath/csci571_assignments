import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetailsService } from 'src/app/services/details.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchlist: any;
  tickerList = "";
  watchlistItems: any;
  arrow: any;

  isLoading: any = true;

  constructor(private detailsService: DetailsService, private utilService: UtilService, private router: Router) {
    this.getLocalStorage();
  }

  ngOnInit(): void {
  }

  getLocalStorage() {
    this.watchlist = JSON.parse(localStorage.getItem('watchlist'));
    this.getWatchlist();
  }

  getWatchlist() {
    if (!this.watchlist) {
      this.isLoading = false;
      return;
    }


    this.watchlist.sort((a, b) => {
      var tickerA = a.ticker.toUpperCase(); // ignore upper and lowercase
      var tickerB = b.ticker.toUpperCase(); // ignore upper and lowercase
      if (tickerA < tickerB) {
        return -1;
      }
      if (tickerA > tickerB) {
        return 1;
      }
      return 0;
    });
    let watchlist = this.watchlist;
    this.tickerList = "";
    watchlist.forEach(item => {
      this.tickerList += item.ticker + ","
    });

    this.detailsService.getLatestPrice(this.tickerList).subscribe(
      (json) => {
        this.watchlistItems = json;

        this.watchlistItems.sort((a, b) => {
          var tickerA = a.ticker.toUpperCase(); // ignore upper and lowercase
          var tickerB = b.ticker.toUpperCase(); // ignore upper and lowercase
          if (tickerA < tickerB) {
            return -1;
          }
          if (tickerA > tickerB) {
            return 1;
          }
          return 0;
        });

        this.isLoading = false;
      },
      (error) => {
        console.log("API error");
        console.log(error);
      }
    );
  }

  getWatchlistCount() {
    return this.watchlist ? this.watchlist.length : 0;
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
    if (color === "redColor") this.arrow = -1;
    else if (color === "greenColor") this.arrow = 1;
    else if (color === "blackColor") this.arrow = 0;
    return this.arrow;
  }

  removeFromWatchlist(item) {
    let temp = this.watchlistItems.filter(el => el.ticker !== item.ticker)
    let temp2 = this.watchlist.filter(el => el.ticker !== item.ticker)
    this.watchlistItems = temp;
    this.watchlist = temp2;
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    if (this.watchlist.length == 0) {
      localStorage.removeItem('watchlist');
    }
    this.watchlist = JSON.parse(localStorage.getItem('watchlist'));
    this.getWatchlist();
  }

  openDetailsPage(item) {
    this.router.navigateByUrl('/details/' + item.ticker);
  }
}
