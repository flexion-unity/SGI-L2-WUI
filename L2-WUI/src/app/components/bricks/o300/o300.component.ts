import { Component, Input } from '@angular/core';

@Component({
    selector: 'brick-o300',
    templateUrl: './o300.component.html',
    styleUrls: ['./o300.component.scss', '../bricks.scss']
})

export class BrickO300Component {
    constructor() { }
    @Input() sysid!: string;
    @Input() brick!: any;
}
