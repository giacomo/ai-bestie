import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SettingsDialogComponent } from '../../../shared/components/settings.dialog';
import { Dialog } from '@angular/cdk/dialog';
import { ConversationService } from '../../../shared/services/conversation/conversation.service';
import { Conversation } from '../../../shared/interfaces/conversation';
import { ElectronService } from '../../../shared/services/electron/electron.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-chat-view',
    standalone: false,
    templateUrl: './chat-view.html',
    styleUrl: './chat-view.scss'
})
export class ChatView implements OnInit {
    isSidebarOpen = false;
    modelNameInUse = 'undefined'; // Placeholder for the model name in use
    messageForm!: FormGroup;

    @ViewChild('chatContainer') chatContainer!: ElementRef;

    constructor(
        // get cdk to open settings dialog
        private dialog: Dialog,
        private electronService: ElectronService,
        private formBuilder: FormBuilder,
        public conversationService: ConversationService,
    ) {}


    ngOnInit(): void {
        // Initialize the message form
        this.messageForm = this.formBuilder.group({
            message: this.formBuilder.control<string>('', [Validators.required])
        });

        // Initialize the model name in use from the conversation service
        this.electronService.invoke('get-api-model').then((modelName: string) => {
            this.modelNameInUse = modelName || 'undefined';
        });
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    openSettings(): void {
        const ref = this.dialog.open<{action: string, model: string}>(SettingsDialogComponent, {
            width: '500px',
            autoFocus: true
        });

        ref.closed.subscribe({
            next: (result: {action: string, model: string} | undefined) => {
                if (result?.action === 'updated') {
                    this.modelNameInUse = result.model;
                }
            }
        });
    }

    async sendMessage() {
        if (this.messageForm.invalid) {
            return;
        }

        const message = this.messageForm.value.message;

        // add the message to the conversation
        this.conversationService.addMessageToCurrentConversation(message, 'user', 'completed');
        this.messageForm.reset();
        this.conversationService.addMessageToCurrentConversation('Loading...', 'assistant', 'pending');


        // scroll to the bottom of the chat container
        setTimeout(() => {
            if (this.chatContainer) {
                if (this.chatContainer && this.chatContainer.nativeElement) {
                    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
                }
            }
        });

        await this.conversationService.completeCurrentConversationMessage();


        // scroll to the bottom of the chat container
        setTimeout(() => {
            if (this.chatContainer) {
                if (this.chatContainer && this.chatContainer.nativeElement) {
                    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
                }
            }
        });
    }

    selectConversation(conversation: Conversation) {
        this.conversationService.setCurrentConversationById(conversation.id);
    }

    startNewConversation() {
        this.conversationService.createNewConversation(this.modelNameInUse);
    }

    conversationEnabled() {
        if (!this.conversationService.currentConversation()) {
            return false;
        }

        if (this.messageForm.invalid) {
            return false;
        }

        return this.conversationService.currentConversation()?.messages.some(message => message.status === 'pending') === false;
    }
}
