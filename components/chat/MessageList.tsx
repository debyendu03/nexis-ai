'use client';
 
import { Message } from '@/types';
import { MessageItem } from './MessageItem'; 



interface MessageListProps { messages: Message[];}

export function MessageList({ messages }: MessageListProps) { 

 
  return (
    <div className="overflow-y-auto w-full max-w-4xl mx-auto flex flex-col pt-13">
      {messages.map((message, index) => {
        return (
          <MessageItem key={message.id || index} message={message} />
        );
      })} 
    </div>
  );
}