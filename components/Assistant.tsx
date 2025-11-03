import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Modal } from './Modal';
import { SparklesIcon } from './icons/SparklesIcon';
import { SendIcon } from './icons/SendIcon';
import { itineraryData } from '../data/itineraryData';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface AssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

const itineraryContext = JSON.stringify(itineraryData.map(day => ({
    day: day.day,
    date: day.date,
    title: day.title,
    events: day.events.map(e => `${e.time} - ${e.description}`).join(', ')
})), null, 2);

const systemInstruction = `Você é um assistente de viagens amigável e prestativo para uma viagem a Santiago, Chile. A data de hoje é ${new Date().toLocaleDateString('pt-BR')}. O roteiro da viagem é o seguinte: \n\n${itineraryContext}\n\nResponda em português do Brasil, de forma concisa e útil. Use markdown simples (negrito, itálico, listas) para formatação quando apropriado.`;

export const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Olá! 👋 Sou seu assistente de viagem para o Chile. Como posso ajudar?' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                },
            });
            setChat(newChat);
             setMessages([{ role: 'model', text: 'Olá! 👋 Sou seu assistente de viagem para o Chile. Como posso ajudar?' }]);
        }
    }, [isOpen]);
    
     useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);


    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: userInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage: Message = { role: 'model', text: 'Desculpe, ocorreu um erro ao me comunicar com a IA. Por favor, tente novamente.' };
            setMessages(prev => {
                const newMessages = [...prev];
                if(newMessages[newMessages.length -1].text === ''){
                    newMessages[newMessages.length -1] = errorMessage;
                    return newMessages;
                }
                return [...newMessages, errorMessage]
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assistente de Viagem">
            {/* Use negative margins to counteract the Modal's default padding */}
            <div className="flex flex-col h-[65vh] -m-6">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <SparklesIcon className="w-6 h-6 text-primary-400 mb-2 flex-shrink-0" />}
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                               <div className="text-sm whitespace-pre-wrap font-sans">{msg.text || '...'}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length-1].role === 'user' && (
                         <div className="flex items-end gap-2 justify-start">
                             <SparklesIcon className="w-6 h-6 text-primary-400 mb-2 flex-shrink-0" />
                             <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700">
                                 <div className="flex items-center gap-2">
                                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                 </div>
                             </div>
                         </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder="Pergunte algo sobre a viagem..."
                            disabled={isLoading}
                            className="w-full p-2 bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-secondary-400 outline-none text-sm"
                        />
                        <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="p-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};