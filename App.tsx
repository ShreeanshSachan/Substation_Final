
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChatInterface } from './components/ChatInterface';
import { getTroubleshootingResponse } from './services/geminiService';
import { Message } from './types';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [knowledgeBase, setKnowledgeBase] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setKnowledgeBase(text);
      setMessages([
        {
          id: 'initial-bot-message',
          text: 'Knowledge base loaded. I am ready to assist with your troubleshooting, maintenance, and failure queries. How can I help you today?',
          sender: 'bot',
        },
      ]);
    };
    reader.onerror = (e) => {
      console.error("File reading error:", e);
      setError("Failed to read the document. Please try again.");
    };
    reader.readAsText(file);
  }, []);
  
  const handleReset = useCallback(() => {
    setKnowledgeBase(null);
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleSendMessage = useCallback(async (query: string) => {
    if (!knowledgeBase) {
      setError("Knowledge base is not loaded.");
      return;
    }

    const userMessage: Message = { id: `user-${Date.now()}`, text: query, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await getTroubleshootingResponse(knowledgeBase, query);
      const botMessage: Message = { id: `bot-${Date.now()}`, text: responseText, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (e) {
      console.error(e);
      const errorMessageText = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response from AI: ${errorMessageText}`);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `Sorry, I encountered an error. Please try again. \nDetails: ${errorMessageText}`,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [knowledgeBase]);

  return (
    <div className="flex flex-col h-screen bg-slate-800 text-slate-100">
      <Header hasKnowledgeBase={!!knowledgeBase} onReset={handleReset} />
      <main className="flex-1 overflow-hidden">
        {knowledgeBase ? (
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
        ) : (
          <FileUpload onFileChange={handleFileChange} />
        )}
        {error && <div className="p-4 text-center text-red-400 bg-red-900/50">{error}</div>}
      </main>
    </div>
  );
};

export default App;
