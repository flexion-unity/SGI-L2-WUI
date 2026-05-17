import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    templateUrl: 'brick.dialog.html',
    styleUrls: ['brick.dialog.scss']
})

export class BrickDialog implements OnInit {
    constructor(
        public backendSVC: BackendService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    inProgress = false;
    errorMessage = '';
    response = [];
    sysid = '';
    brick: any = {};

    ngOnInit(): void {
        this.sysid = this.data.sysid || '';
        this.brick = this.data.brick || {};
    }
    executeCmd(cmd: string): void {
        this.inProgress = true;
        this.backendSVC.cmd(cmd).then(
            (data: any) => {
                if (data.success) this.response = data.response || [];
                this.inProgress = false;
            },
            (err: any) => {
                this.backendSVC.stdErrorHandler(err);
                this.inProgress = false;
            }
        );
    }
    onServiceLEDToggle(): void {
        let cmd = this.sysid + " display attention " + (this.brick.display.leds.service===true ? 'on' : 'off');
        this.rawCommand(cmd);
    }
    onFaultLEDToggle(): void {
        let cmd = this.sysid + " display failure " + (this.brick.display.leds.fault===true ? 'on' : 'off');
        this.rawCommand(cmd);
    }
    rawCommand(cmd: string): void {
        this.inProgress = true;
        this.backendSVC.cmd('rawcmd/' + cmd).then(
            (data: any) => {
                if (!data.success) this.backendSVC.printNotification('Failed to execute command');
                this.inProgress = false;
            },
            (err: any) => {
                this.backendSVC.stdErrorHandler(err);
                this.inProgress = false;
            }
        );
    }
    btnPower(): void {
        let up = !this.brick?.display?.leds?.pwr;
        let strConfirm = (up ? 'Power up ' : 'Power down ') + this.sysid + '?';
        if (!confirm(strConfirm)) return;
        this.inProgress = true;
        let cmd = 'rawcmd/' + this.sysid + " power " + (up ? 'up' : 'down');
        this.backendSVC.cmd(cmd).then(
            (data: any) => {
                let strAct = up ? 'Starting up' : 'Shutting down';
                let msg = data.success ? strAct : 'Failed to execute command';
                this.backendSVC.printNotification(msg);
                this.inProgress = false;
                if (data.success) setTimeout(() => { this.btnRefresh() }, 1000);
            },
            (err: any) => {
                this.backendSVC.stdErrorHandler(err);
                this.inProgress = false;
            }
        );
    }
    btnRefresh(): void {
        this.inProgress = true;
        this.backendSVC.getBrickSummary(this.sysid).then(
            (data: any) => {
                if (data.success) {
                    let bs = data.bricksummary || [];
                    if (bs[0] && bs[0].id === this.sysid) this.brick = bs[0];
                } else {
                    this.backendSVC.printNotification('Failed to execute command');
                }
                this.inProgress = false;
            },
            (err: any) => {
                this.backendSVC.stdErrorHandler(err);
                this.inProgress = false;
            }
        );
    }
}