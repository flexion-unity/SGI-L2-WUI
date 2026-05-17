import { Component, inject } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    templateUrl: './rackinfo.component.html',
    styleUrls: ['./rackinfo.component.scss']
})

export class RackInfoComponent {
    constructor() { }
    backendSVC = inject(BackendService);
    lstConfig: any = []; // [{"ltype":"L2","addr":"172.16.9.1:","id":"001"},{"ltype":"L1","addr":"172.16.9.1:0:0","id":"001r20"},{"ltype":"L1","addr":"172.16.9.1:1:0","id":"001c04"},{"ltype":"L1","addr":"172.16.9.1:2:0","id":"001c01"}];

    btnGetConfig(): void {
        this.backendSVC.cmd_config().then(
            (data: any) => {
                if (data.success) this.lstConfig = data.config || [];
            },
            (err: any) => { this.backendSVC.stdErrorHandler(err) }
        );
    }
    btnPower(up: boolean): void {
        let strConfirm = up ? 'Power up all bricks?' : 'Power down all bricks?';
        if (!confirm(strConfirm)) return;
        this.backendSVC.cmd_power(up).then(
            (data: any) => {
                let strAct = up ? 'Starting up' : 'Shutting down';
                let msg = data.success ? strAct : 'Failed to execute comman';
                this.backendSVC.printNotification(msg);
            },
            (err: any) => { this.backendSVC.stdErrorHandler(err) }
        );
    }

}
