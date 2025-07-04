export interface Conversation {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
        status?: 'pending' | 'completed' | 'error';
    }>;
    model?: string;
}
