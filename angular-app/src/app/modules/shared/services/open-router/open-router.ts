import { Injectable } from '@angular/core';
import { ApiClientService } from '../api-client/api-client.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { TOOL_MAPPING, tools } from '../../agents/tools';

@Injectable({
    providedIn: 'root'
})
export class OpenRouterService {

    constructor(
        private apiService: ApiClientService,
    ) {
    }

    getModels(): Observable<any> {
        return this.apiService.get('models').pipe(
            // transform the response to match the expected format from {data: any} to model.id
            map((response: any) => response.data.map((model: any) => model.id))
        );
    }



    async getChatCompletion(messages: any[], options: {key: string, model: string}): Promise<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${options.key}`
        });

        const response: {choices: {message: {role: string, content: string, tool_calls?: any}}[]} = await firstValueFrom(this.apiService.post('chat/completions', {
                model: options.model,
                messages: messages,
                // tools: tools,
                stream: false // Set to true if you want streaming responses
            }, { headers })
        );

        const message = response.choices[0]?.message;

        // @TODO: add support for tool calls

        // check if the response contains a tool call
        if (message.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            const toolName = toolCall.function.name;
            const { search_params } = JSON.parse(toolCall.function.arguments);
            const toolResponse: string = TOOL_MAPPING[toolName as keyof typeof TOOL_MAPPING](search_params);

            console.log('Tool response:', toolResponse);

            return toolResponse;
        }

        return response.choices[0]?.message.content;
    }
}
