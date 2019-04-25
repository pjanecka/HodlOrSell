import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';
import { AlgorithmComponent } from './algorithm/algorithm.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AboutComponent,
    AlgorithmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: MainComponent },
      { path: 'about', component: AboutComponent },
      { path: 'algorithm', component: AlgorithmComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
