"use client";

import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hello Farmer! Ask me about crops, weather, fertilizers, or farming advice.",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    let botReply = "🌱 Based on your location and weather, rice cultivation looks profitable.";

    if (input.toLowerCase().includes("fertilizer")) {
      botReply =
        "🧪 Recommended fertilizer: Syngenta CropBoost NPK.";
    }

    if (input.toLowerCase().includes("weather")) {
      botReply =
        "☁️ Heavy rainfall expected today. Maintain proper drainage.";
    }

    if (input.toLowerCase().includes("profit")) {
      botReply =
        "💰 Estimated profit this season could increase by 18%.";
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: "bot",
        text: botReply,
      },
    ]);

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] bg-green-700 hover:bg-green-800 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-white transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M12 3C7.03 3 3 6.582 3 11c0 2.386 1.174 4.527 3 6v4l3.243-1.621A11.36 11.36 0 0012 19c4.97 0 9-3.582 9-8s-4.03-8-9-8z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl z-[9999] flex flex-col overflow-hidden border border-green-200">
          
          {/* Header */}
          <div className="bg-green-800 text-white p-4 text-xl font-bold">
            🌾 FarmSaathi AI
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fff5]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-yellow-300 ml-auto text-black"
                    : "bg-green-100 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded-xl px-3 py-2 outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-green-700 hover:bg-green-800 text-white px-4 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}