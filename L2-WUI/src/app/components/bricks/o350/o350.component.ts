import { Component, Input } from '@angular/core';

@Component({
    selector: 'brick-o350',
    templateUrl: './o350.component.html',
    styleUrls: ['./o350.component.scss', '../bricks.scss']
})

export class BrickO350Component {
    constructor() { }
    @Input() sysid!: string;
    @Input() brick!: any;
    @Input() skin!: string;
}
