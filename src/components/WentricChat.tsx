import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  X, 
  MessageCircle, 
  Headphones, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

interface Message {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
  isAdmin: boolean;
  isAI: boolean;
}

interface WentricChatProps {
  user: User | null;
  onLogin: () => void;
}

export const WentricChat: React.FC<WentricChatProps> = ({ user, onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'AI' | 'SUPPORT'>('AI');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (user && mode === 'SUPPORT') {
      const chatQuery = query(
        collection(db, `support_chats/${user.uid}/messages`),
        orderBy('timestamp', 'asc')
      );

      const unsub = onSnapshot(chatQuery, (snap) => {
        const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
        setMessages(msgs);
      });

      return () => unsub();
    } else if (mode === 'AI' && messages.length === 0) {
      setMessages([{
        senderId: 'ai',
        senderName: 'Wentric AI',
        text: "Assalomu alaykum! Men Wentric Chat yordamchisiman. Sizga ekotizimimiz bo'yicha qanday yordam bera olaman?",
        timestamp: new Date(),
        isAdmin: false,
        isAI: true
      }]);
    }
  }, [user, mode]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      senderId: user?.uid || 'anonymous',
      senderName: user?.displayName || 'Mehmon',
      text: message,
      timestamp: new Date(),
      isAdmin: false,
      isAI: false
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMsg = message;
    setMessage('');

    if (mode === 'AI') {
      setIsTyping(true);
      try {
        const history = messages.slice(-5).map(m => ({
          role: m.isAI ? 'assistant' : 'user',
          parts: [{ text: m.text }]
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentMsg, history })
        });
        const data = await res.json();
        
        setIsTyping(false);
        setMessages(prev => [...prev, {
          senderId: 'ai',
          senderName: 'Wentric Chat',
          text: data.text || "Kechirasiz, hozirda javob bera olmayman.",
          timestamp: new Date(),
          isAdmin: false,
          isAI: true
        }]);
      } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          senderId: 'ai',
          senderName: 'Wentric Chat',
          text: "Texnik nosozlik yuz berdi. Iltimos, birozdan so'ng qayta urinib ko'ring.",
          timestamp: new Date(),
          isAdmin: false,
          isAI: true
        }]);
      }
    } else if (mode === 'SUPPORT') {
      if (!user) {
        onLogin();
        return;
      }
      
      const sessionRef = doc(db, 'support_chats', user.uid);
      await setDoc(sessionRef, {
        userId: user.uid,
        userName: user.displayName,
        status: 'open',
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      await addDoc(collection(db, `support_chats/${user.uid}/messages`), {
        ...userMessage,
        timestamp: serverTimestamp()
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[400px] h-[620px] bg-black border border-white/10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-white/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.2rem] bg-zinc-900 border border-white/10 flex items-center justify-center text-sky-500 shadow-2xl relative">
                  {mode === 'AI' ? <Bot className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="font-black text-white text-[11px] uppercase tracking-[0.2em] italic">
                    {mode === 'AI' ? 'Wentric AI Node' : 'Command Support'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">
                      System Operational
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="p-3 bg-zinc-900/40 border-b border-white/5 flex gap-2">
              <button 
                onClick={() => setMode('AI')}
                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                  mode === 'AI' 
                    ? 'bg-sky-500 border-sky-400 text-black shadow-lg shadow-sky-500/20' 
                    : 'text-zinc-600 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                AI Assistant
              </button>
              <button 
                onClick={() => setMode('SUPPORT')}
                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                  mode === 'SUPPORT' 
                    ? 'bg-sky-500 border-sky-400 text-black shadow-lg shadow-sky-500/20' 
                    : 'text-zinc-600 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                Inson Yordami
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-[radial-gradient(circle_at_top,#111,transparent)]"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.senderId === (user?.uid || 'anonymous') ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] p-5 rounded-[2rem] text-[13px] leading-relaxed italic font-medium ${
                    msg.senderId === (user?.uid || 'anonymous') 
                      ? 'bg-sky-500 text-black shadow-2xl shadow-sky-500/20' 
                      : 'bg-zinc-900/50 text-zinc-300 border border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/10 flex gap-2 items-center">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              {mode === 'SUPPORT' && !user && (
                <div className="text-center py-12 px-6 bg-zinc-900/30 rounded-[2.5rem] border border-white/5 border-dashed">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed mb-6 font-bold truncate">Support bilan gaplashish uchun tizimga kiring</p>
                  <button 
                    onClick={onLogin}
                    className="w-full py-4 bg-sky-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-sky-400 transition-all shadow-2xl shadow-sky-500/20"
                  >
                    Google bilan kirish
                  </button>
                </div>
              )}
            </div>

            {/* Support Footer */}
            {mode === 'SUPPORT' && (
              <div className="px-8 py-4 bg-black border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest italic">Telegram Direct:</span>
                <a 
                  href="https://t.me/wentricsupport" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[10px] text-sky-400 font-black hover:text-white transition-colors uppercase tracking-widest"
                >
                  @wentricsupport <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-8 border-t border-white/5 bg-zinc-900/20 backdrop-blur-xl">
              <div className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={mode === 'AI' ? "AI Assistant ga savol..." : "Savolingizni yozing..."}
                  className="w-full bg-black border border-white/10 rounded-[1.5rem] py-5 px-6 pr-16 text-white text-xs placeholder:text-zinc-700 outline-none focus:border-sky-500/50 transition-all italic font-medium"
                />
                <button 
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-sky-500/30 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black border border-white/10 rounded-[1.8rem] flex items-center justify-center text-sky-500 shadow-[0_20px_50px_rgba(14,165,233,0.15)] relative overflow-hidden group backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          {isOpen ? <ChevronDown className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </div>
        {!isOpen && (
          <div className="absolute top-0 right-0 p-2">
            <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
          </div>
        )}
      </motion.button>
    </div>
  );
};
