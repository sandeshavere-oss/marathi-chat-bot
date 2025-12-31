
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { ChatMessage } from './types';
import ChatBubble from './components/ChatBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'नमस्कार! मी तुम्हाला कोणत्याही ताज्या घटनेबद्दल (Current Events) मराठीत माहिती देऊ शकतो. सांगा, आज आपण कोणत्या विषयावर चर्चा करायची?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userQuery,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await geminiService.discussEvent(userQuery);
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text,
        sources: result.sources,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'माफ करा, माहिती मिळवताना काही तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const trendingTopics = [
    "आजच्या मुख्य बातम्या",
    "IPL अपडेट्स मराठी",
    "महाराष्ट्र राजकारण घडामोडी",
    "जागतिक हवामान बदल",
    "नवीन तंत्रज्ञान २०२५"
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Marathi Event Pulse</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">घटना आणि चालू घडामोडी चर्चा</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Google Search Grounding
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <div className="max-w-4xl mx-auto">
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">माहिती शोधत आहे...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Input */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Quick Topics */}
          <div className="flex overflow-x-auto pb-3 mb-3 gap-2 no-scrollbar">
            {trendingTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setInput(topic)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-medium transition-colors border border-slate-200"
              >
                {topic}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="कोणत्याही घटनेबद्दल विचारा (उदा. आजच्या बातम्या)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            AI द्वारे व्युत्पन्न केलेली माहिती नेहमी तपासा. Google Search द्वारे संदर्भित.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
