import { Component, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject, Subscription } from "rxjs";
import {
  tap,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  delay,
  map
} from "rxjs/operators";
import { EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISearchResponse, Search } from '../ticker.class';

@Injectable({
  providedIn: "root"
})
export class SearchService {

  // Loading stream
  private readonly loading = new Subject<boolean>();
  get loading$(): Observable<boolean> {
    return this.loading;
  }


  constructor(private http: HttpClient) { }

  opts = [];

  getData(searchValue) {
    return this.http.get("https://tradingapp-294407.wl.r.appspot.com/api/autocomplete/" + searchValue).pipe(
      tap(() => this.loading.next(true)),
      delay(1000),
      map((res) => {
        this.loading.next(false);
        return res;
      }),
    );
  }

  // Cleanup.
  ngOnDestroy() {
    this.loading.unsubscribe();
  }
}