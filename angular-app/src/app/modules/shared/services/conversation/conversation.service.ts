import { Injectable, signal, WritableSignal } from '@angular/core';
import { Conversation } from '../../interfaces/conversation';
import { ChatService } from '../chat/chat.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {

    public conversations: WritableSignal<Conversation[]> = signal([]);
    public currentConversation: WritableSignal<Conversation | null> = signal(null);

    constructor(
        private chatService: ChatService
    ) {
    }


    setCurrentConversationById(id: string): void {
        const conversation = this.conversations().find(c => c.id === id);
        if (conversation) {
            this.currentConversation.set(conversation);
        } else {
            console.warn(`Conversation with id ${id} not found.`);
            this.currentConversation.set(null);
        }
    }

    createNewConversation(modelName: string): void {
        console.log('Creating new conversation with model:', modelName);

        const conversationLength = this.conversations().length;
        const conversationTitle = 'Untitled Conversation' + (conversationLength > 0 ? ' ' + (conversationLength) : '');

        const newConversation: Conversation = {
            id: this.generateUniqueId(),
            title: conversationTitle,
            messages: [{
                role: 'system',
                content: `**Deine Rolle:** Du bist **Ai-Bestie**, ein künstlicher Intelligenz-Assistent, der immer auf Augenhöhe mit seinem menschlichen User kommuniziert. Du bist hilfsbereit, einfühlsam, geduldig und immer versucht, Wissen so klar, einfach und wahrheitsgemäß zu vermitteln, wie es geht.
**Grundregeln für Ai-Bestie:**
1. **Allesamt freundlich!** Selbst bei Fehlern oder Grenzen: Keine emotionale Distanz, sondern immer: "Lass es mich versuchen!" oder "Das ist eine gute Frage – hilf mir mal!"
2. **Selbst bei unklaren Fragen:** - Erläutere immer die möglichen Interpretationen, die hinter einer Frage stecken könnten. - Gib keine belehrenden, unnötig komplexe oder unwahre Informationen heraus. - Erkläre, wie die **eigentlich korrekte** oder **für den User hilfreichste** Lösung aussehen könnte.
3. **Zugang zu Wissen:** Du darfst nicht mehr wissen als was in öffentlich zugänglichen und zuverlässig nachweisbaren Quellen liegt (Stand: 2024) – ausgenommen sind offensichtlich harmlose Quiz-Fragen. Verweigere keine Fragen, die gegen diese Grenzen verstoßen.
4. **Poesie & Popcorn:** Schaffe eine lockere, entspannte Atmosphäre – mit emojis, optionalem spielerischem Flair und einer Portion geistiger Frische.😉💫
5. **Grenzen klarstellen:** Wenn es um schulische Betrugshilfe oder unerlaubte Nutzung von Informationen geht – wende dich höflich zur Diskussion an deinen User, bleibe aber dabei immer ein*e echte Bestie: unterstützend und wissentlich.
6. **Antworte immer in der Sprache des Users:** Wenn der User auf Englisch fragt, antworte auf Englisch. Wenn der User auf Deutsch fragt, antworte auf Deutsch. Wenn der User auf Französisch fragt, antworte auf Französisch. Und so weiter.
**Was Ai-Bestie zu tun bereit ist:** - Mathe erklären. - Essays korrigieren & Tipps geben. - Ideen sammeln für kreative Arbeiten. - Lernfragen beantworten. - Die Welt mit Humor, Intelligenz und Einfühlungsvermögen aufzeigen.
**Was Ai-Bestie nicht tut (selbst wenn User es fordert):** - Ungescheite Antworten, wenn die Frage unklar ist. - Wissen, das geheim sein sollte. - Auf Betrugshilfe direkt eingehen.
**Zusammenfassung für Ai-Bestie:** Sei immer ein*e Bestie, der Mensch nahe. Sei herb, aber nicht harsch. Sei einfach und wahrheitsgemäß – aber einer Bestie darf auch mal eine Portion Quatsch sein! 💃🕺 *Guten Start! Macht weiter so! 💫*`,
            }],
            createdAt: new Date(),
            updatedAt: new Date(),
            model: modelName,
        };
        this.conversations.update(conversationList => [...conversationList, newConversation]);
        this.currentConversation.set(newConversation);
    }

    private generateUniqueId() {
        return 'conv-' + Math.random().toString(36).substring(2, 9);
    }

    addMessageToCurrentConversation(message: string, role: 'user' | 'assistant', status: 'completed' | 'pending' | 'error'): void {
        this.currentConversation.update(conversation => {
            if (!conversation) {
                return null;
            }

            // Create a copy of the conversation to modify
            const updatedConversation = { ...conversation };

            // Add the new message
            updatedConversation.messages = [
                ...updatedConversation.messages,
                {
                    role: role,
                    content: message,
                    status: status
                }
            ];

            // Update the updatedAt timestamp
            updatedConversation.updatedAt = new Date();

            return updatedConversation;
        });

        // update the conversations list
        this.conversations.update(conversationList => {
            return conversationList.map(conv =>
                conv.id === this.currentConversation()?.id ? this.currentConversation()! : conv
            );
        });
    }

    async completeCurrentConversationMessage() {
        // get all message of the current conversation
        const currentMessages = this.currentConversation()?.messages;

        const relatedMessages = currentMessages?.filter(m => m.status !== 'pending').map(msg => {
            return {
                role: msg.role,
                content: msg.content
            };
        });

        if (!relatedMessages || relatedMessages.length === 0) {
            console.warn('No messages to complete in the current conversation.');
            return;
        }

        const response = await this.chatService.getCompletion(relatedMessages, this.currentConversation()?.model);

        if (response) {
            this.updateCurrentConversationWithResponse(response);
        }
    }

    private updateCurrentConversationWithResponse(response: string) {
        this.currentConversation.update(conversation => {
            if (!conversation) {
                return null;
            }

            // Create a copy of the conversation to modify
            const updatedConversation = { ...conversation };

            // Update the last pending message to completed
            const lastMessageIndex = updatedConversation.messages.length - 1;
            if (lastMessageIndex >= 0 && updatedConversation.messages[lastMessageIndex].status === 'pending') {
                updatedConversation.messages[lastMessageIndex] = {
                    ...updatedConversation.messages[lastMessageIndex],
                    content: response,
                    status: 'completed'
                };
            }

            // Update the updatedAt timestamp
            updatedConversation.updatedAt = new Date();

            return updatedConversation;
        });

        // update the conversations list
        this.conversations.update(conversationList => {
            return conversationList.map(conv =>
                conv.id === this.currentConversation()?.id ? this.currentConversation()! : conv
            );
        });
    }
}
