import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'heroes', component: HeroListComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' }
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard,
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
