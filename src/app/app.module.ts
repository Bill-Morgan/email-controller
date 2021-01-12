import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperSelectComponent } from './super-select/super-select.component';
import { EmailApiService } from './email-api.service';
import { AuthInterceptorService } from './auth-intercepter.service';
import { CleanupComponent } from './cleanup/cleanup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SuperSelectComponent,
    CleanupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [EmailApiService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
