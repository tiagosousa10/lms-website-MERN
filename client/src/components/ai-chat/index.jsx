import React, { useEffect, useRef, useState } from "react";
// import ChatbotIcon from './components/ChatbotIcon'
// import ChatForm from './components/ChatForm'
// import ChatMessage from './components/ChatMessage'
import { companyInfo } from "./components/companyInfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    //helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((oldHistory) => [
        ...oldHistory.filter((message) => message.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    // format the chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const resquestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // make the API call to get the bot's response
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        resquestOptions
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      // update the chat history with the bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      console.log("🚀 ~ generateBotResponse ~ error:", error);
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    // auto-scroll to the bottom of the chat body when it updates
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setShowChatbot((oldState) => !oldState)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot((oldState) => !oldState)}
            className="material-symbols-rounded"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* chatbot body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you?
            </p>
          </div>

          {/* Render the chat history dinamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* chatbot footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
