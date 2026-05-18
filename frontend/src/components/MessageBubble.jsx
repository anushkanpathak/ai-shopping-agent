import React from 'react';
import { Bot, User } from 'lucide-react';
import './MessageBubble.css';

export default function MessageBubble({ message }) {
  const isAI = message.role === 'assistant';

  return (
    <div className={`bubble-wrap ${isAI ? 'bubble-ai' : 'bubble-user'}`}>
      <div className="bubble-avatar">
        {isAI ? <Bot size={15} /> : <User size={15} />}
      </div>
      <div className="bubble-content">
        <p className="bubble-text">{message.content}</p>
        {message.timestamp && (
          <span className="bubble-time">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}
