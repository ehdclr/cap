import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HomecustomerComponent } from './components/homecustomer/homecustomer.component';
import { HomestoreComponent } from './components/homestore/homestore.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'homecustomer',
    component: HomecustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'homestore',
    component: HomestoreComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'qrcode',
    component: QrcodeComponent,
    canActivate: [AuthGuard],
  },
  { path: 'navbar', component: NavbarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
