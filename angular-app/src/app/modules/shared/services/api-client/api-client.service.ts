import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiClientService {

    constructor(
        @Inject('apiUrl') private apiUrl: string,
        private http: HttpClient
    ) {
    }

    private buildUrl(concatPath?: string): string {
        let baseApiUrl = this.apiUrl;
        if (typeof concatPath !== 'undefined' && concatPath.length > 0 && !concatPath.startsWith('/')) {
            baseApiUrl += '/' + concatPath;
        }

        if (typeof concatPath !== 'undefined' && concatPath.length > 0 && concatPath.startsWith('/')) {
            baseApiUrl += concatPath;
        }

        return baseApiUrl;
    }

    getUrl(concatPath?: string): string {
        return this.buildUrl(concatPath);
    }

    get<T>(endPoint: string, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        return this.http.get<T>(this.buildUrl(endPoint), options);
    }

    post<T>(endPoint: string, body: T|unknown, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        const passByOptions = Object.assign({}, this.getDefaultRequestOptions(), options);
        const payload = JSON.stringify(body);

        return this.http.post<T>(this.buildUrl(endPoint), payload, passByOptions);
    }

    put<T>(endPoint: string, body: any | null, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        const passByOptions = Object.assign({}, this.getDefaultRequestOptions(), options);
        const payload = JSON.stringify(body);

        return this.http.put<T>(this.buildUrl(endPoint), payload, passByOptions);
    }

    patch<T>(endPoint: string, body: any | null, options?: {headers?: HttpHeaders, params?: HttpParams}): Observable<T> {
        const passByOptions = Object.assign({}, this.getDefaultRequestOptions(), options);
        const payload = JSON.stringify(body);

        return this.http.patch<T>(this.buildUrl(endPoint), payload, passByOptions);
    }

    delete(endPoint: string, body: any | null, options?: any): Observable<any> {
        options = Object.assign({}, options, {body: body});
        const passByOptions = Object.assign({}, this.getDefaultRequestOptions(), options);

        return this.http.delete(this.buildUrl(endPoint), passByOptions);
    }

    private getDefaultRequestOptions(): {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        context?: HttpContext;
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } {
        return {
            observe: 'body',
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
    }
}
