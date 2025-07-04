import { Injectable } from '@angular/core';
import { OpenRouterService } from '../open-router/open-router';
import { ElectronService } from '../electron/electron.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        private openRouterService: OpenRouterService,
        private electronService: ElectronService,
    ) {
    }

    async getCompletion(messages: { role: string, content: string }[], model: string|null|undefined): Promise<string> {
        if (!model) {
            return Promise.reject('Model is not specified');
        }

        const apiKey: string = await this.electronService.invoke('get-api-key');

        return await this.openRouterService.getChatCompletion(messages, {key: apiKey, model: model});
    }
}
