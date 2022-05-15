import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxUploaderModule } from 'ngx-uploader';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxUploaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
