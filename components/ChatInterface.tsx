
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { Icon } from './Icon';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSendMessage(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-center space-x-3 animate-pulse">
                <div className="p-2 bg-slate-700 rounded-full">
                    <Icon name="bot" className="w-6 h-6 text-sky-400" />
                </div>
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 md:p-6 bg-slate-800/50 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-4xl mx-auto">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe the issue... (Shift+Enter for new line)"
            className="flex-1 p-3 bg-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-slate-400"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="p-3 bg-sky-600 rounded-full text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 focus:outline-none"
          >
            <Icon name="send" className="w-6 h-6"/>
          </button>
        </form>
      </div>
    </div>
  );
};
