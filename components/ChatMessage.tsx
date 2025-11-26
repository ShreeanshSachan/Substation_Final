
import React from 'react';
import { Message } from '../types';
import { Icon } from './Icon';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 p-2 bg-slate-700 rounded-full mt-1">
          <Icon name="bot" className="w-6 h-6 text-sky-400" />
        </div>
      )}
      <div
        className={`max-w-xl lg:max-w-3xl px-4 py-3 rounded-2xl ${
          isBot ? 'bg-slate-700 rounded-tl-none' : 'bg-sky-800 rounded-br-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.groundingSources && message.groundingSources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-600">
            <p className="text-xs font-semibold text-slate-400 mb-1">Sources:</p>
            <ul className="space-y-1">
              {message.groundingSources.map((source, idx) => (
                <li key={idx} className="text-xs">
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"
                  >
                    <span className="truncate max-w-[200px]">{source.title || source.uri}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
       {!isBot && (
        <div className="flex-shrink-0 p-2 bg-slate-700 rounded-full mt-1">
          <Icon name="user" className="w-6 h-6 text-slate-400" />
        </div>
      )}
    </div>
  );
};