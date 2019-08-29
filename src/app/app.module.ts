import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MagnizoomModule } from 'magnizoom';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MagnizoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
