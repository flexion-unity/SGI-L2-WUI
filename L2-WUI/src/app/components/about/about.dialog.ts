import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    templateUrl: 'about.dialog.html'
})

export class AboutDialog implements OnInit {
    constructor(
        public backendSVC: BackendService
    ) { }

    inProgress = true;
    serverversion = '';
    uiversion = '20231121-1730';

    ngOnInit(): void {
        this.getServerVersion();
    }
    getServerVersion(): void {
        this.inProgress = true;
        this.backendSVC.getServerVersion().then(
            (data: any) => {
                if (data.success) this.serverversion = data.version || '?';
                this.inProgress = false;
            },
            (err: any) => {
                this.backendSVC.stdErrorHandler(err);
                this.inProgress = false;
            }
        );
    }
}