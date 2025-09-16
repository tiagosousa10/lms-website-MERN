import React, { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { companyInfo } from "./companyInfo";
import { Bot, X, ChevronDown } from "lucide-react";

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState([
    { hideInChat: true, role: "model", text: companyInfo }, // permanece só no contexto
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef(null);
  const toggleBtnRef = useRef(null); // para devolver o foco ao fechar

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((oldHistory) => [
        ...oldHistory.filter((m) => m.text !== "A pensar..."),
        { role: "model", text, isError },
      ]);
    };

    const payload = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      setChatHistory((h) => [...h, { role: "model", text: "A pensar..." }]);

      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Erro inesperado");

      const apiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.replace(/\*\*(.*?)\*\*/g, "$1")
          ?.trim() || "…";
      updateHistory(apiText);
    } catch (error) {
      updateHistory(error.message || "Falha ao obter resposta", true);
    }
  };

  // scroll automático
  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory, showChatbot]);

  // fecha com ESC e devolve foco ao botão
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showChatbot) {
        setShowChatbot(false);
        toggleBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showChatbot]);

  return (
    <>
      {/* Botão flutuante (44x44+) */}
      <button
        ref={toggleBtnRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={showChatbot}
        aria-controls="chatbot-dialog"
        onClick={() => setShowChatbot((s) => !s)}
        className="fixed z-40 bottom-[clamp(16px,env(safe-area-inset-bottom,0px)+12px,24px)] right-4 md:right-6 grid place-items-center w-14 h-14 rounded-full shadow-lg bg-[#547792] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        {showChatbot ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        <span className="sr-only">
          {showChatbot ? "Fechar chatbot" : "Abrir chatbot"}
        </span>
      </button>

      {/* Overlay + Painel (dialog) */}
      {showChatbot && (
        <div className="fixed inset-0 z-40" aria-hidden="true">
          {/* overlay com blur (fundo corrigido) */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          {/* painel */}
          <section
            id="chatbot-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Janela de chat"
            className="absolute right-0 bottom-0 md:bottom-6 md:right-6 w-full sm:w-[min(420px,90vw)] h-[80dvh] sm:h-[70dvh] max-h-[90dvh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col"
            style={{
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            {/* header */}
            <header className="h-14 min-h-14 flex items-center justify-between px-4 bg-[#213448] text-white">
              <div className="flex items-center gap-2">
                <ChatbotIcon />
                <h2 className="font-semibold tracking-tight">Chatbot</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowChatbot(false);
                  toggleBtnRef.current?.focus();
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Fechar"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </header>

            {/* corpo (região ao vivo / role=log) */}
            <div
              ref={chatBodyRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-white"
            >
              {/* mensagem de boas-vindas */}
              <div className="flex items-start gap-2">
                <ChatbotIcon />
                <p className="text-sm text-slate-700">
                  Hey 👋 <br /> Como posso ajudar?
                </p>
              </div>

              {/* histórico visível */}
              {chatHistory.map((chat, i) => (
                <ChatMessage key={i} chat={chat} />
              ))}
            </div>

            {/* footer / input */}
            <div className="border-t border-slate-200 bg-white p-2">
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ChatBot;
