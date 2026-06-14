import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Bot, MessageCircle, Send, X } from "lucide-react";

const AIShoppingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `# 👋 Welcome to eKart AI

I can help you with:

- Product recommendations
- Laptop suggestions
- Mobile comparisons
- Budget shopping
- Best deals

**What are you looking for today?**`,
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/ai/assistant",
        {
          message: currentMessage,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.response,
        },
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50
          bg-gradient-to-r from-indigo-600 to-violet-600
          text-white
          p-4
          rounded-full
          shadow-[0_10px_40px_rgba(79,70,229,0.35)]
          hover:scale-110
          transition-all
          duration-300
        "
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}

      {open && (
        <div
          className="
            fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-24
            w-auto sm:w-[420px]
            h-[calc(100dvh-100px)] sm:h-[650px] max-h-[650px]
            bg-card
            rounded-[24px] sm:rounded-[28px]
            shadow-[0_25px_60px_rgba(0,0,0,0.18)]
            border border-border
            z-50
            flex flex-col
            overflow-hidden
          "
        >
          {/* Header */}

          <div
            className="
              bg-gradient-to-r
              from-indigo-600
              via-violet-600
              to-purple-600
              text-white
              px-5
              py-4
              flex
              items-center
              justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={20} />
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  AI Shopping Assistant
                </h2>


              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 w-11 h-11 flex items-center justify-center rounded-lg transition"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-muted/30">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl break-words text-sm sm:text-base ${
                  msg.sender === "user"
                    ? `
                    ml-auto
                    bg-gradient-to-r
                    from-indigo-600
                    to-violet-600
                    text-white
                    shadow-md
                  `
                    : `
                    bg-gradient-to-br
                    from-card
                    to-indigo-50/20
                    dark:to-indigo-950/10
                    border
                    border-border
                    shadow-sm
                    text-foreground
                  `
                }`}
              >
                {msg.sender === "ai" ? (
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-3 break-words">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="text-sm sm:text-base font-semibold text-violet-600 dark:text-violet-400 mb-2 break-words">
                          {children}
                        </h2>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-bold text-indigo-600 dark:text-indigo-400 break-words">
                          {children}
                        </strong>
                      ),

                      li: ({ children }) => (
                        <li className="ml-4 sm:ml-5 list-disc text-muted-foreground mb-1 break-words">
                          {children}
                        </li>
                      ),

                      p: ({ children }) => (
                        <p className="mb-2 leading-relaxed break-words text-sm sm:text-base">
                          {children}
                        </p>
                      ),

                      pre: ({ children }) => (
                        <pre className="bg-muted dark:bg-zinc-900 p-3 rounded-lg overflow-x-auto my-2 text-xs max-w-full">
                          {children}
                        </pre>
                      ),

                      code: ({ children }) => (
                        <code className="bg-muted dark:bg-zinc-900 px-1.5 py-0.5 rounded text-xs break-all">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && (
              <div
                className="
                  bg-indigo-50/50
                  dark:bg-indigo-950/30
                  border
                  border-indigo-100/50
                  dark:border-indigo-900/50
                  rounded-2xl
                  px-4
                  py-3
                  w-fit
                "
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}

          <div
            className="
              border-t
              border-border
              bg-card
              p-3.5 sm:p-4
              flex
              gap-2
              items-center
            "
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              placeholder="Ask for product recommendations..."
              className="
                flex-1
                rounded-2xl
                border
                border-input
                bg-transparent
                text-foreground
                px-4
                py-2.5 sm:py-3
                text-base
                outline-none
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-100
                dark:focus:ring-indigo-950/50
              "
            />

            <button
              onClick={sendMessage}
              className="
                bg-gradient-to-r
                from-indigo-600
                to-violet-600
                text-white
                rounded-2xl
                shadow-md
                hover:scale-105
                transition-all
                flex
                items-center
                justify-center
                w-11
                h-11
                sm:w-12
                sm:h-12
                flex-shrink-0
              "
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIShoppingAssistant;