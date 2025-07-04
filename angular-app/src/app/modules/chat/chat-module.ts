import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing-module';
import { ChatView } from './pages/chat-view/chat-view';
import { SharedModule } from '../shared/shared-module';

@NgModule({
    declarations: [
        ChatView
    ],
    imports: [
        CommonModule,
        SharedModule,
        ChatRoutingModule,
    ]
})
export class ChatModule {
}
