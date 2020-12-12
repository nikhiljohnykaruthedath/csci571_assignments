import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  url: any;

  constructor(private router: Router) { }

  calculateChange(last, prevClose) {
    let diff = last - prevClose;
    return diff.toFixed(2);
  }

  calculateChangePercent(last, prevClose) {
    let diff: any = this.calculateChange(last, prevClose);

    let diffPercent = (diff / prevClose) * 100;
    return diffPercent.toFixed(2);
  }

  calculateColor(value) {
    if (value < 0)
      return 'redColor';
    else if (value > 0)
      return 'greenColor';
    else
      return 'blackColor';
  }

  createAutoClosingAlert(selector, delay) {
    window.setTimeout(function () { selector.alert('close') }, delay);
  }

  convertDateFormat(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let d = new Date(date);
    let day = '' + d.getDate();
    let year = '' + d.getFullYear();

    if (day.length < 2)
      day = '0' + day;

    return `${monthNames[d.getMonth()]} ${day}, ${year}`;
  }
}
