import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './components/home/home.component';
import { BackendService } from './services/backend.service';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CmdResponseDialog } from './components/cmd-response-dialog/cmd-response.dialog';
import { AboutDialog } from './components/about/about.dialog';
import { VRackComponent } from './components/vrack/vrack.component';
import { BrickO300Component } from './components/bricks/o300/o300.component';
import { BrickRouterComponent } from './components/bricks/router/router.component';
import { BrickO350Component } from './components/bricks/o350/o350.component';
import { RackInfoComponent } from './components/rackinfo/rackinfo.component';
import { PowerDialog } from './components/power-dialog/power.dialog';
import { OrderByPipe } from './utils/OrderBy.Pipe';
import { BrickDialog } from './components/brick-dialog/brick.dialog';
import { ConsoleComponent } from './components/console/console.component';


@NgModule({
  declarations: [
    AppComponent,
    OrderByPipe,
    HomeComponent,
    RackInfoComponent,
    VRackComponent,
    CmdResponseDialog,
    ConsoleComponent,
    PowerDialog,
    AboutDialog,
    BrickDialog,
    BrickO300Component,
    BrickO350Component,
    BrickRouterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
