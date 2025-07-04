import { Injectable } from '@angular/core';

declare global {
    interface Window {
        api: {
            send: (channel: string, data?: any) => void;
            invoke: (channel: string, data?: any) => Promise<any>;
            getApiKey: () => Promise<string>;
            getModelKey: () => Promise<string>;
        };
    }
}


@Injectable({
    providedIn: 'root'
})
export class ElectronService {

    constructor() {
        // Check if we're running in Electron
        if (!this.isElectron) {
            console.warn('ElectronService: Not running in Electron environment');
        }
    }

    get isElectron(): boolean {
        return !!(window && window.api);
    }

    send(channel: string, data?: any): void {
        if (this.isElectron) {
            window.api.send(channel, data);
        }
    }

    invoke(channel: string, data?: any): Promise<any> {
        if (this.isElectron) {
            return window.api.invoke(channel, data);
        }
        return Promise.reject('Not in Electron environment');
    }
}
