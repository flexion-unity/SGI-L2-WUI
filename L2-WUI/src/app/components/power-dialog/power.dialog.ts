import { Component, inject } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
    templateUrl: 'power.dialog.html',
    styles: ['.response { list-style: none; overflow: auto; }']
})

export class PowerDialog {
    constructor() { }

    backendSVC = inject(BackendService);

    btnPower(up: boolean): void {
        let strConfirm = up ? 'Power up all bricks?' : 'Power down all bricks?';
        if (!confirm(strConfirm)) return;
        this.backendSVC.cmd_power(up).then(
            (data: any) => {
                let strAct = up ? 'Starting up' : 'Shutting down';
                let msg = data.success ? strAct : 'Failed to execute command';
                this.backendSVC.printNotification(msg);
            },
            (err: any) => { this.backendSVC.stdErrorHandler(err) }
        );
    }

}