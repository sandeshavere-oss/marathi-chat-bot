
import React from 'react';
import { ChatMessage } from '../types';
import GroundingSources from './GroundingSources';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
        isModel 
          ? 'bg-white border border-slate-200 text-slate-800' 
          : 'bg-indigo-600 text-white'
      }`}>
        <div className="flex items-center mb-1">
          <span className="text-[10px] opacity-70 font-semibold uppercase tracking-tight">
            {isModel ? 'Marathi Event AI' : 'You'}
          </span>
          <span className="mx-2 opacity-30 text-[10px]">•</span>
          <span className="text-[10px] opacity-50">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className={`prose prose-sm max-w-none ${isModel ? 'text-slate-700' : 'text-white'}`}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.text}
          </div>
        </div>

        {isModel && message.sources && <GroundingSources sources={message.sources} />}
      </div>
    </div>
  );
};

export default ChatBubble;
