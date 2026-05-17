import { Component, Input } from '@angular/core';

@Component({
    selector: 'brick-router',
    templateUrl: './router.component.html',
    styleUrls: ['./router.component.scss', '../bricks.scss']
})

export class BrickRouterComponent {
    constructor() { }
    @Input() sysid!: string;
    @Input() brick!: any;
}
