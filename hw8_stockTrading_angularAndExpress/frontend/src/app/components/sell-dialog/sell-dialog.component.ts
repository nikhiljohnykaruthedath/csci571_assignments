import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sell-dialog',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.css']
})
export class SellDialogComponent {
  @Input() currentPrice;
  @Input() ticker;
  @Input() name;
  @Input() quantity;
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
    if (this.quanityValue > 0 && parseInt(this.quanityValue) <= parseInt(this.quantity))
      this.isDisabled = false;
    else
      this.isDisabled = true;
  }

  getTotal() {
    if (this.total < 0)
      return '0.00';
    return this.total ? (this.total).toFixed(3) : '0.00';
  }

  updatePortfolio() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio'));
    this.updatedPortfolio.emit(this.portfolio);
  }

  sellFromLocalStorage() {
    this.portfolio = JSON.parse(localStorage.getItem('portfolio'));

    let ticker = this.ticker;
    let name = this.name;
    let quanityValue = this.quanityValue;
    let currentPrice = this.currentPrice;
    let totalCost = quanityValue * currentPrice;

    if (this.portfolio) {
      if (this.portfolio.find(el => el.ticker.toUpperCase() === this.ticker.toUpperCase())) {
        this.portfolio.map(el => {
          if (el.ticker.toUpperCase() === ticker.toUpperCase()) {
            el.quanityValue = parseInt(el.quanityValue) - parseInt(quanityValue);
            el.totalCost -= totalCost;
            return el;
          }
        });
        this.portfolio = this.portfolio.filter(el => el.quanityValue !== 0);
        localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
        if (this.portfolio.length == 0) {
          localStorage.removeItem('portfolio');
        }
      }
    }
    this.updatePortfolio();
  }

  sell() {
    this.activeModal.close();
    this.sellFromLocalStorage();
  }
}