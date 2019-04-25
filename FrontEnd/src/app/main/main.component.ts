import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CryptoService } from './crypto.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  msg = 'Write a cryptocurrency code or name to see if it\'s worth hodling or not.';

  cryptocurrency = '';
  private cryptoChangeEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private cryptoService: CryptoService) {}

  cryptoChanged(text: string) {
    this.cryptoChangeEmitter.next(text);
  }

  ngOnInit() {
    this.cryptoChangeEmitter.pipe(debounceTime(333), distinctUntilChanged())
      .subscribe(cryptocurrency => {
        this.cryptocurrency = cryptocurrency;
        this.verifyHodl(cryptocurrency);
      });

      this.cryptoService.publicMessage$.subscribe((newMsg: string) => { this.msg = newMsg; });
  }

  verifyHodl(crypto: string): void {
    this.cryptoService.hodlOrNot(crypto);
    // this.msg = message;
  }

}
