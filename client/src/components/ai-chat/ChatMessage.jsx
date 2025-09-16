import React from "react";
import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  const isBot = chat.role === "model";
  const bubble =
    "max-w-[80%] md:max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm";

  return (
    <div
      className={`flex items-start gap-2 ${
        isBot ? "justify-start" : "justify-end"
      }`}
      role="article"
    >
      {isBot && <ChatbotIcon />}
      <p
        className={`${bubble} ${
          isBot ? "bg-slate-100 text-slate-800" : "bg-[#547792] text-white"
        } ${
          chat.isError ? "border border-red-400 bg-red-50 text-red-800" : ""
        }`}
      >
        {chat.text}
      </p>
    </div>
  );
};

export default ChatMessage;
