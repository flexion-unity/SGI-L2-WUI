import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VRackComponent } from './components/vrack/vrack.component';
import { RackInfoComponent } from './components/rackinfo/rackinfo.component';
import { ConsoleComponent } from './components/console/console.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'console', component: ConsoleComponent },
  { path: 'rackinfo', component: RackInfoComponent },
  { path: 'visualrack', component: VRackComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }