import React, { useState } from "react";
import { FiMessageSquare, FiX, FiSend, FiUser, FiCpu } from "react-icons/fi";

const KNOWLEDGE_BASE = {
  "fir": "An FIR (First Information Report) is a document prepared by police after receiving information about a cognizable offense. You can file one on this portal via the 'File Complaint' section.",
  "anonymous": "Yes, you can report anonymously. Your identity will be hidden from the standard police view, but please provide as much evidence as possible.",
  "stolen": "If your property is stolen, immediately file a complaint here with details of the item, time, and location. For electronics, provide the IMEI or Serial Number.",
  "emergency": "For immediate life-threatening situations, use our one-click SOS button or call 112.",
  "cyber": "Cyber crimes should be reported immediately. Save screenshots of transactions or messages as evidence to upload with your complaint.",
  "hello": "Hello! I am your AI Legal Assistant. How can I help you today?",
  "hi": "Hello! I am your AI Legal Assistant. How can I help you today?",
};

export default function LawBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I am your AI Legal Assistant. How can I help you today? You can ask about FIRs, Anonymous reporting, or stolen property." }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.toLowerCase();
    const newMessages = [...messages, { type: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simple matching
    let response = "I'm sorry, I don't have information on that specific topic yet. Try asking about 'FIR', 'Cyber crime', or 'SOS'.";
    
    for (const key in KNOWLEDGE_BASE) {
      if (userMsg.includes(key)) {
        response = KNOWLEDGE_BASE[key];
        break;
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: response }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-32 right-8 z-[100]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-500 transition-all hover:scale-110"
        >
          <FiMessageSquare className="text-2xl" />
        </button>
      ) : (
        <div className="w-80 h-[450px] bg-[#0b1628] border border-[#1d2d42] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FiCpu />
              </div>
              <span className="font-bold text-sm">Legal Assistant AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:rotate-90 transition">
              <FiX />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-[#122434] text-gray-300 border border-[#1d2d42] rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-black/20 border-t border-[#1d2d42] flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me something..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-500"
            >
              <FiSend className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
