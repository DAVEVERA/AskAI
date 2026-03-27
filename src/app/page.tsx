"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function autoResize() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "error", content: data.error ?? "Something went wrong." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>AskAI</h1>
        <p>Ask anything, get answers powered by Claude AI</p>
      </header>

      <div className="chat-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.role === "assistant" && (
              <div className="label">Claude</div>
            )}
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="loading">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="form-area" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask something... (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}
