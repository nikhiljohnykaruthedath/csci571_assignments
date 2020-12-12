import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isSearchActive;
  isWatchlistActive;
  isPortfolioActive;
  isSearchButtonSelected;
  isWatchlistButtonSelected;
  isPortfolioButtonSelected;

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (ev.url === "/") {
          this.isSearchActive = "active";
          this.isWatchlistActive = "";
          this.isPortfolioActive = "";
          this.isSearchButtonSelected = "btnSelected";
          this.isWatchlistButtonSelected = "";
          this.isPortfolioButtonSelected = ""
        }
        else if (ev.url === "/watchlist") {
          this.isSearchActive = "";
          this.isWatchlistActive = "active";
          this.isPortfolioActive = "";
          this.isSearchButtonSelected = "";
          this.isWatchlistButtonSelected = "btnSelected";
          this.isPortfolioButtonSelected = "";
        }
        else if (ev.url === "/portfolio") {
          this.isSearchActive = "";
          this.isWatchlistActive = "";
          this.isPortfolioActive = "active";
          this.isSearchButtonSelected = "";
          this.isWatchlistButtonSelected = "";
          this.isPortfolioButtonSelected = "btnSelected";
        }
        else {
          this.isSearchActive = "";
          this.isWatchlistActive = "";
          this.isPortfolioActive = "";
          this.isSearchButtonSelected = "";
          this.isWatchlistButtonSelected = "";
          this.isPortfolioButtonSelected = "";
        }
      }
    });
  }
}
