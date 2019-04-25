import { Injectable } from '@angular/core';

import { CurrencyInfo } from './currency-info';
import { Hodl } from './hodl.enum';
import * as messages from './messages';
import { CommunicatorService } from './communicator.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private timestamp: Date;
  private cryptos: CurrencyInfo[];
  private _publicMessage: string;
  publicMessage$: Observable<string>;
  private messageSubject: Subject<string>;

  constructor(private communicator: CommunicatorService) {
    this.messageSubject = new Subject<string>();
    this.publicMessage$ = this.messageSubject.asObservable();
    this.timestamp = new Date();
    this.communicator.updateData()
      .subscribe(data => this.cryptos = data);
  }

  set publicMessage(newValue: string) {
    this._publicMessage = newValue;
    this.messageSubject.next(newValue);
  }

  private isDefaultMsg(): boolean {
    return this.publicMessage === 'Write a cryptocurrency code or name to see if it\'s worth hodling or not.';
  }

  private fetchData(currency: string): void {
    this.timestamp = new Date();
    if (!this.cryptos && this.isDefaultMsg) {
      this.publicMessage = 'Preheating crystal ball.';
    }
    this.communicator.updateData()
      .subscribe(data => {
        this.cryptos = data;
        this.publicMessage = this.getNewMessage(currency);
      },
      _ => this.publicMessage = this.getNewMessage(currency));
  }

  private getNewMessage(currency: string): string {
    if (currency === '') {
      return 'Write a cryptocurrency code or name to see if it\'s worth hodling or not.';
    } else if (!this.cryptos) {
      return 'Problem fetching data. Probably bad weather or something.';
    }
    const entry: CurrencyInfo = this.cryptos.find(x => x.code === currency || x.name === currency);
    if (entry) {
      return this.randomMessage(entry.hodl);
    } else {
      return this.randomMessage(Hodl.Missing);
    }
  }

  public hodlOrNot(currency: string): void {
    currency = currency.trim().toUpperCase();
    if (!this.cryptos || new Date(this.timestamp.getTime() + 15 * 60000) < new Date()) {
      this.fetchData(currency);
    } else {
      this.publicMessage = this.getNewMessage(currency);
    }
  }

  private randomMessage(hodl: Hodl): string {
    if (hodl === Hodl.Sell) {
      return messages.sellMessages[Math.floor(Math.random() * messages.sellMessages.length)];
    } else if (hodl === Hodl.Hodl) {
      return messages.hodlMessages[Math.floor(Math.random() * messages.hodlMessages.length)];
    } else if (hodl === Hodl.Moon) {
      return messages.moonMessages[Math.floor(Math.random() * messages.moonMessages.length)];
    } else {
      return messages.missingMessages[Math.floor(Math.random() * messages.missingMessages.length)];
    }
  }
}
