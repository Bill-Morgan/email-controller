import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperSelectComponent } from './super-select/super-select.component';
import { EmailApiService } from './email-api.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SuperSelectComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [EmailApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
