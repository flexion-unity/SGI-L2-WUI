import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class BackendService {
    constructor(
        private http: HttpClient,
        private toaster: MatSnackBar
    ) { }

    RES_BACKEND = environment.API_Endpoint + '/api';

    public loading = false;
    public cmd_config(): Promise<any> {
        this.loading = true;
        return this.http.get(this.RES_BACKEND + '/l2/config').toPromise().then(
            (result: any) => {
                this.loading = false;
                return result || {};
            },
            (err: any) => { this.stdErrorHandler(err) }
        );
    }
    public cmd_brick(): Promise<any> {
        this.loading = true;
        return this.http.get(this.RES_BACKEND + '/l2/brick').toPromise().then(
            (result: any) => {
                this.loading = false;
                return result || {};
            },
            (err: any) => { this.stdErrorHandler(err) }
        );
    }
    public cmd_power(up: boolean): Promise<any> {
        this.loading = true;
        return this.http.get(this.RES_BACKEND + '/l2/power' + (up ? 'up' : 'down')).toPromise().then((result: any) => {
            this.loading = false;
            return result || {};
        });
    }
    public cmd(cmd: string): Promise<any> {
        return this.http.get(this.RES_BACKEND + '/l2/' + cmd).toPromise().then((result: any) => {
            return result || {};
        });
    }
    public getServerVersion(): Promise<any> {
        return this.http.get(this.RES_BACKEND + '/version').toPromise().then((result: any) => {
            return result || {};
        });
    }

    racksummaryCache = [];
    public getRackSummary(force: boolean): Promise<any> {
        if (force || this.racksummaryCache.length < 1) {
            this.loading = true;
            return this.http.get(this.RES_BACKEND + '/l2/racksummary').toPromise().then(
                (result: any) => {
                    this.racksummaryCache = result.racksummary || [];
                    this.loading = false;
                    return { success: true, racksummary: this.racksummaryCache };
                }
            );
        } else {
            return new Promise<any>((resolve, reject) => { resolve({ success: true, racksummary: this.racksummaryCache }); });
        }
    }
    public getBrickSummary(sysid: string): Promise<any> {
        return this.http.get(this.RES_BACKEND + '/l2/bricksummary/' + sysid).toPromise().then((result: any) => {
            return result || {};
        });
    }

    public printNotification(msg: string) {
        this.toaster.open(msg, '', { duration: 4000 });
    }
    public stdErrorHandler(err: any): void {
        console.log(err);
        this.printNotification(err.message || 'Error');
        this.loading = false;
    }
}
