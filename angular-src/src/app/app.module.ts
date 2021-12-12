import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { HomecustomerComponent } from './components/homecustomer/homecustomer.component';

import { FormsModule } from '@angular/forms';
import { ValidateService } from './services/validate.service';
import {
  FlashMessagesModule,
  FlashMessagesService,
} from 'angular2-flash-messages';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './components/profile/profile.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth.guard';
import { HomestoreComponent } from './components/homestore/homestore.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HomecustomerComponent,
    ProfileComponent,
    HomestoreComponent,
    QrcodeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FlashMessagesModule,
    HttpClientModule,
    NgbModule,
    NgxQRCodeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('authToken');
        },
      },
    }),
  ],
  providers: [ValidateService, FlashMessagesService, AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
