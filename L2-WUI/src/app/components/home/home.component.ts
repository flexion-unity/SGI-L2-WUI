import { Component, inject } from '@angular/core';
import { PowerDialog } from '../power-dialog/power.dialog';
import { MatDialog } from '@angular/material/dialog';
@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent {
    constructor() { }
    dialog = inject(MatDialog);
    
    btnPowerDialog(): void {
        this.dialog.open(PowerDialog);
    }
}
