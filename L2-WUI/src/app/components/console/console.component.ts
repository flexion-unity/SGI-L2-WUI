import { Component, Inject } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    templateUrl: 'console.component.html',
    styleUrls: ['console.component.scss']
})

export class ConsoleComponent {
    constructor(
        public backendSVC: BackendService
    ) { }

    inProgress = false;
    console: any = [];
    cmd = '';
    prompt = 'L2> ';

    btnSendCmd(): void {
        if (this.cmd === '') return;
        if (this.cmd.toLowerCase() === 'clear') {
            this.console = [];
            this.console.push(this.prompt + this.cmd);
            this.cmd = '';
            return;
        }
        this.sendCommand(this.cmd);
    }
    termKeyDown(ev: any): void {
        if (ev.keyCode === 13) this.btnSendCmd();
    }
    sendCommand(cmd: string): void {
        this.console.push(this.prompt + cmd);
        this.cmd = '';
        this.backendSVC.loading = true;
        this.backendSVC.cmd('rawcmd/' + cmd).then(
            (data: any) => {
                if (data.success) {
                    if (data.response) {
                        data.response.forEach((row: any) => { this.console.push(row) });
                    }
                } else {
                    this.backendSVC.printNotification('Failed to execute command');
                }
                this.backendSVC.loading = false;
                setTimeout( ()=> {this.scrollBottom()}, 500);
            },
            (err: any) => {
                this.backendSVC.stdErrorHandler(err);
                this.backendSVC.loading = false;
            }
        );
    }
    scrollBottom(): void {
        let sposElem = window.document.getElementById('scrollTarget');
        if (sposElem) sposElem.scrollIntoView({ behavior: "smooth" });
    }
}