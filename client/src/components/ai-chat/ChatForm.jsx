import React, { useRef } from "react";
import { ArrowUp } from "lucide-react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";
    setChatHistory((old) => [...old, { role: "user", text: userMessage }]);

    // envia contexto + pedido
    generateBotResponse([
      ...chatHistory,
      {
        role: "user",
        text: `Using the details provided above, please address this query: ${userMessage}`,
      },
    ]);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-center gap-2"
      role="search"
      aria-label="Enviar mensagem para o chatbot"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Escreve a tua mensagem…"
        className="flex-1 h-12 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#94B4C1] text-white"
        aria-label="Mensagem"
        required
      />
      <button
        type="submit"
        className="grid place-items-center w-12 h-12 rounded-lg bg-[#547792] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#94B4C1]"
        aria-label="Enviar mensagem"
        title="Enviar"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatForm;
