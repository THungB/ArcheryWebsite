import { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export function AICoach({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 1. Create references to control scrolling and focus
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 2. Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
    }, [messages, isLoading]);

    // 3. Auto-focus the input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return; // Prevent sending if empty or already loading

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        // Keep focus on input so you can type again immediately after
        if (inputRef.current) inputRef.current.focus();

        try {
            const token = localStorage.getItem('authToken');

            // Hardcoded localhost URL - consider moving this to an environment variable later
            const res = await fetch('https://localhost:7001/api/AI/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    archerId: parseInt(userId),
                    message: userMsg
                })
            });

            if (!res.ok) throw new Error("Server error");

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.response }]);

        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I’m having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
            // Re-focus input after AI replies
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <>
            <Button
                className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-xl bg-blue-600 hover:bg-blue-700 z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <Bot size={28} />}
            </Button>

            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden">
                    <div className="p-4 bg-blue-600 text-white font-bold flex items-center gap-2">
                        <Bot size={20} /> AI Coach
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <p className="text-sm text-gray-500 text-center mt-4">
                                Hi! I’m here to help you review score history or ask anything about shooting technique.
                            </p>
                        )}

                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-lg text-sm ${m.role === 'user'
                                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                                        : 'bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-gray-100'
                                        }`}
                                >
                                    <span className="whitespace-pre-wrap">{m.content}</span>
                                </div>
                            </div>
                        ))}

                        {isLoading && <div className="text-xs text-gray-400 ml-2">AI is thinking...</div>}

                        {/* The invisible anchor for auto-scrolling */}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-slate-900">
                        <input
                            ref={inputRef}
                            disabled={isLoading} // Disable while loading to prevent errors
                            className="flex-1 px-3 py-2 rounded-md border dark:bg-slate-800 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            placeholder={isLoading ? "AI is typing..." : "Ask about your scores..."}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
                        />

                        <Button size="icon" onClick={handleSend} disabled={isLoading}>
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}