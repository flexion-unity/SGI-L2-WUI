import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { BrickDialog } from '../brick-dialog/brick.dialog';

/*  Note:
    - Only R and C bricks are supported 
    - Only one rack supported at the moment. All bricks will be rendered in the same rack.
*/

@Component({
    templateUrl: './vrack.component.html',
    styleUrls: ['./vrack.component.scss']
})

export class VRackComponent implements OnInit {
    constructor() { }
    backendSVC = inject(BackendService);
    dialog = inject(MatDialog);
    loading = false;
    lstBrick: any = [];

    bricksTest: any = [
        { "id": "001c01", "rack": "001", "slot": "01", "partition": "none", "productLabel": "", "type": "C (IP45) [2MB flash]", "serial": "NCC120", "source": "EEPROM", "brickType": "C", "skin": "o300", "display": { "id": "001c01", "revision": "2.0", "line1": "001c01     /", "line2": "Powered Up", "leds": { "pwr": true, "service": true, "fault": true } } },
        { "id": "001c03", "rack": "001", "slot": "01", "partition": "none", "productLabel": "silicon graphics tezro", "type": "C (IP45) [2MB flash]", "serial": "NCC120", "source": "EEPROM", "brickType": "C", "skin": "tezro", "display": { "id": "001c01", "revision": "2.0", "line1": "001c03     |", "line2": "Powered Down", "leds": { "pwr": false, "service": false, "fault": false } } },
        { "id": "001c02", "rack": "001", "slot": "01", "partition": "none", "productLabel": "sgi onyx 350", "type": "C (IP45) [2MB flash]", "serial": "NCC120", "source": "EEPROM", "brickType": "C", "skin": "o350", "display": { "id": "001c01", "revision": "2.0", "line1": "001c02     \\", "line2": "Powered Down", "leds": { "pwr": true, "service": true, "fault": true } } },
        { "id": "001r20", "rack": "001", "slot": "20", "partition": "N/A", "type": "R [1MB flash]", "serial": "NEA799", "source": "EEPROM", "brickType": "R", "skin": "router", "display": { "id": "001r20", "revision": "2.0", "line1": "001r20     |", "line2": "Powered Down", "leds": { "pwr": false, "service": false, "fault": true } } }
    ];

    ngOnInit(): void {
        this.btnGetConfig(false);
        // this.lstBrick = this.bricksTest; // for local testing
    }
    btnShowTestRack(): void {
        this.lstBrick = this.bricksTest; // for local testing
    }
    btnGetConfig(forceReload: boolean): void {
        this.loading = true;
        this.backendSVC.getRackSummary(forceReload).then(
            (data: any) => {
                if (data.success) {
                    this.lstBrick = data.racksummary || [];
                }
                this.loading = false;
            },
            (err: any) => {
                this.backendSVC.stdErrorHandler(err);
                this.loading = false;
            }
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
    btnBrickDialog(brick: any): void {
        this.dialog.open(BrickDialog, { data: { sysid: brick.id, brick } });
    }
}
