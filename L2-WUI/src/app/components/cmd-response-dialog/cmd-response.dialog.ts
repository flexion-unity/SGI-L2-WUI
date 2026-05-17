import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    templateUrl: 'cmd-response.dialog.html',
    styles: ['.response { list-style: none; overflow: auto; }']
})

export class CmdResponseDialog implements OnInit {
    constructor(
        public backendSVC: BackendService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    inProgress = true;
    errorMessage = '';
    response = [];
    cmd = '';

    ngOnInit(): void {
        this.cmd = this.data.cmd || '';
        if (this.cmd !== '') this.executeCmd(this.cmd);
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
}