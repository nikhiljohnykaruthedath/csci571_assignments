import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable, of, Subscription } from "rxjs";
import { ReactiveFormsModule } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: any;
  selectedTicker = "";

  searchMoviesCtrl = new FormControl();
  filteredMovies: any;
  errorMsg: string;

  // Get loading stream from service
  loading$: Observable<boolean> = this.searchService.loading$;
  constructor(private searchService: SearchService, private router: Router, private http: HttpClient) {

  }



  ngOnInit() {

    this.myControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredMovies = [];
        }),
        switchMap(value => this.searchService.getData(value)
          .pipe(
            finalize(() => {
            }),
          )
        )
      )
      .subscribe((data: any) => {
        if (data.length == 0) {
          return EMPTY;
        }

        let temp = data.filter(el => el.ticker && el.name);
        data = temp.slice(0, 10);

        this.filteredOptions = data;
        if (data['Search'] == undefined) {
          this.errorMsg = data['Error'];
          this.filteredMovies = [];
        } else {
          this.errorMsg = "";
          this.filteredMovies = data['Search'];
        }

      });
  }

  emptyOptions() {
    return;
  }

  displayOptions(option) {
    return option.ticker + " | " + option.name
  }

  getTicker(ticker) {
    this.selectedTicker = ticker;
  }

  openDetailsPage() {
    if (this.myControl.value)
      this.router.navigateByUrl('/details/' + this.selectedTicker);
  }
}