import { Component, inject } from '@angular/core';
import { BackendService } from './services/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { CmdResponseDialog } from './components/cmd-response-dialog/cmd-response.dialog';
import { AboutDialog } from './components/about/about.dialog';
import { PowerDialog } from './components/power-dialog/power.dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
  dialog = inject(MatDialog);
  backendSVC = inject(BackendService);

  btnExecCommand(cmd: string) {
    this.dialog.open(CmdResponseDialog, { data: { cmd } });
  }
  btnAbout(): void {
    this.dialog.open(AboutDialog);
  }
  btnPowerDialog(): void {
    this.dialog.open(PowerDialog);
  }
}
