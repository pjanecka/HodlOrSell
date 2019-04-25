import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrencyInfo } from './currency-info';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {
  private url = '---';

  constructor(private http: HttpClient) { }

  private handleError(err: any) {
    if (isDevMode()) {
      console.error(err);
    }
    return throwError(err);
  }

  private formatData(item: any): CurrencyInfo {
    const currency = {
      code: item['Code'].toUpperCase(),
      name: item['Name'].toUpperCase(),
      hodl: item['Hodl']
    };
    return currency;
  }

  public updateData(): Observable<CurrencyInfo[]> {
    // load stuff and store into cryptos
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<CurrencyInfo[]>(this.url, { headers: headers })
      .pipe(
        map(data => data.map(item => this.formatData(item))),
        catchError(this.handleError)
      );
  }
}
