import { Component, OnInit } from '@angular/core';
import { DetailsService } from 'src/app/services/details.service';
import { UtilService } from 'src/app/services/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyDialogComponent } from '../buy-dialog/buy-dialog.component';
import { SellDialogComponent } from '../sell-dialog/sell-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  portfolio: any;
  tickerList = "";
  portfolioItems: any;
  arrowFlag: any;

  isLoading: any = true;

  constructor(private detailsService: DetailsService, private utilService: UtilService, private modalService: NgbModal, private router: Router) {
    this.getLocalStorage();
  }

  ngOnInit(): void {
  }

  openBuyDialog(data) {
    const buyModal = this.modalService.open(BuyDialogComponent);
    buyModal.componentInstance.parent = "portfolio";
    buyModal.componentInstance.currentPrice = data.last;
    buyModal.componentInstance.ticker = data.ticker;
    buyModal.componentInstance.name = data.name;
    buyModal.componentInstance.updatedPortfolio.subscribe((e) => {
      this.getLocalStorage();
    })
  }

  openSellDialog(data, quantity) {
    const sellModal = this.modalService.open(SellDialogComponent);
    sellModal.componentInstance.currentPrice = data.last;
    sellModal.componentInstance.ticker = data.ticker;
    sellModal.componentInstance.name = data.name;
    sellModal.componentInstance.quantity = quantity;
    sellModal.componentInstance.updatedPortfolio.subscribe((e) => {
      this.getLocalStorage();
    })
  }

  getLocalStorage() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio'));
    this.getPortfolio();
  }

  getPortfolio() {
    if (!this.portfolio) {
      this.isLoading = false;
      return;
    }


    this.portfolio.sort((a, b) => {
      let tickerA = a.ticker.toUpperCase(); // ignore upper and lowercase
      let tickerB = b.ticker.toUpperCase(); // ignore upper and lowercase
      if (tickerA < tickerB) {
        return -1;
      }
      if (tickerA > tickerB) {
        return 1;
      }
      return 0;
    });

    let portfolio = this.portfolio;
    this.tickerList = "";
    portfolio.forEach(item => {
      this.tickerList += item.ticker + ","
    });

    this.detailsService.getLatestPrice(this.tickerList).subscribe(
      (json) => {
        this.portfolioItems = json;
        this.portfolioItems.sort((a, b) => {
          let tickerA = a.ticker.toUpperCase(); // ignore upper and lowercase
          let tickerB = b.ticker.toUpperCase(); // ignore upper and lowercase
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

  getIcon(value) {
    let color = this.utilService.calculateColor(value);
    if (color === "redColor") this.arrowFlag = -1;
    else if (color === "greenColor") this.arrowFlag = 1;
    else if (color === "blackColor") this.arrowFlag = 0;
    return this.arrowFlag;
  }

  getPortfolioCount() {
    return this.portfolio ? this.portfolio.length : 0;
  }

  getAvgCostPerShare(totalCost, quantity) {
    return (totalCost / quantity).toFixed(3);
  }

  getChangeValue(totalCost, quantity, last) {
    let avgCostPerShare = this.getAvgCostPerShare(totalCost, quantity);
    return (last - parseFloat(avgCostPerShare)).toFixed(3);
  }

  getMarketValue(quantity, last) {
    return (quantity * last).toFixed(3);
  }

  getColorValue(value) {
    return this.utilService.calculateColor(value);
  }

  openDetailsPage(item) {
    this.router.navigateByUrl('/details/' + item.ticker);
  }
}
