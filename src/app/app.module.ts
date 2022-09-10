import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgMagnizoomModule } from '../../projects/ng-magnizoom/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgMagnizoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
