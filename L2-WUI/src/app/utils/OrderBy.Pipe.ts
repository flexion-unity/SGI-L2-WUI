import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })

export class OrderByPipe implements PipeTransform {
    transform(records: Array<any>, args?: any): any {
        return records.sort((a, b) => {
            const iA = a[args.property] || '';
            const iB = b[args.property] || '';
            if (iA < iB) {
                return -1 * args.direction;
            } else if (iA > iB) {
                return 1 * args.direction;
            } else {
                return 0;
            }
        });
    }
}
