import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/search/search.component';
import { DetailsComponent } from './components/details/details.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HighchartsChartModule } from "highcharts-angular";
import { NewsDialogComponent } from './components/news-dialog/news-dialog.component';
import { BuyDialogComponent } from './components/buy-dialog/buy-dialog.component';
import { SellDialogComponent } from './components/sell-dialog/sell-dialog.component';
import { SellDialogclearComponent } from './components/sell-dialogclear/sell-dialogclear.component';
import { BuyDetailsDialogComponent } from './components/buy-details-dialog/buy-details-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    DetailsComponent,
    WatchlistComponent,
    PortfolioComponent,
    NewsDialogComponent,
    BuyDialogComponent,
    SellDialogComponent,
    SellDialogclearComponent,
    BuyDetailsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatTabsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    HighchartsChartModule,
    MatProgressSpinnerModule
  ],
  providers: [NgbActiveModal, NgbModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
