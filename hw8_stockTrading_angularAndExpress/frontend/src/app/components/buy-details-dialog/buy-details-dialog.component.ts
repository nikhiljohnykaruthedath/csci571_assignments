import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buy-details-dialog',
  templateUrl: './buy-details-dialog.component.html',
  styleUrls: ['./buy-details-dialog.component.css']
})
export class BuyDetailsDialogComponent implements OnChanges {

  @Input() parent;
  @Input() currentPrice;
  @Input() ticker;
  @Output() updatedPortfolio = new EventEmitter<any>();

  quanityValue: any;
  total: any;
  price: any;
  portfolio: any;
  isDisabled: any;

  constructor(public activeModal: NgbActiveModal) {
    this.price = this.currentPrice;
    this.isDisabled = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    for (const propName in changes) {
      this.currentPrice = changes.currentPrice.currentValue;
    }
  }

  setQuantityValue(event) {
    this.quanityValue = event.target.value;
  }

  getQuantityValue() {
    return this.quanityValue;
  }

  getCurrentPrice() {
    return this.currentPrice;
  }

  setTotal(event) {
    this.quanityValue = event.target.value;
    this.total = this.currentPrice * this.quanityValue;
    if (this.quanityValue > 0) this.isDisabled = false;
    else this.isDisabled = true;
  }

  getTotal() {
    return this.total ? (this.total).toFixed(3) : '0.00';
  }


  appendAlert(classType, message) {
    let alertContainer = document.getElementById("alertContainer");
    let alertDiv = document.createElement('div');
    alertDiv.innerHTML = message;
    alertDiv.setAttribute("class", "text-center alert alert-" + classType);
    alertDiv.setAttribute("role", "alert");
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
    alertContainer.appendChild(alertDiv);
    setTimeout(
      function () {
        alertDiv.style.display = "none";
      }, 5000);
  }


  addToLocalStorage() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio'));

    let ticker = this.ticker;
    let quanityValue = this.quanityValue;
    let currentPrice = this.currentPrice;
    let totalCost = quanityValue * currentPrice;

    if (this.portfolio) {
      if (this.portfolio.find(el => el.ticker === this.ticker.toUpperCase())) {
        let temp = this.portfolio.map(el => {
          el.quanityValue = parseInt(el.quanityValue) + parseInt(quanityValue);
          el.totalCost += totalCost;
          return el;
        });
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
      }
      else {
        this.portfolio.push({ "ticker": ticker, "quanityValue": quanityValue, "totalCost": totalCost });
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
      }
    }
    else {
      this.portfolio = [{ "ticker": ticker, "quanityValue": quanityValue, "totalCost": totalCost }];
      localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
    }

  }

  buyFromPortfolio() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio'));

    let ticker = this.ticker;
    let quanityValue = this.quanityValue;
    let currentPrice = this.currentPrice;
    let totalCost = quanityValue * currentPrice;

    if (this.portfolio) {
      if (this.portfolio.find(el => el.ticker === this.ticker.toUpperCase())) {
        let temp = this.portfolio.map(el => {
          if (el.ticker === this.ticker.toUpperCase()) {
            el.quanityValue = parseInt(el.quanityValue) + parseInt(quanityValue);
            el.totalCost += totalCost;
            return el;
          }
        });
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
      }
    }
    this.updatePortfolio();
  }

  updatePortfolio() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio'));
    this.updatedPortfolio.emit(this.portfolio);
  }

  buy() {
    this.activeModal.close('Saveddd click');
    if (this.parent === "details") {
      this.appendAlert("success", this.ticker + " bought successfully!")
      this.addToLocalStorage();
    }
    else if (this.parent === "portfolio") {
      this.buyFromPortfolio();
      this.updatePortfolio();
    }
  }
}

