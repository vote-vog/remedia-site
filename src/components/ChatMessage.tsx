import { motion } from "framer-motion";
import { Message } from "./ChatMessage";

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export const ChatMessage = ({ message, isTyping = false }: ChatMessageProps) => {
  if (message.role === "system") {
    return (
      <div className="flex justify-center my-6">
        <div className="bg-muted/50 text-muted-foreground text-sm px-4 py-2 rounded-full border text-center max-w-[90%]">
          {message.content}
        </div>
      </div>
    );
  }

  const isAI = message.role === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isAI
            ? "bg-muted rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        }`}
      >
        {isTyping ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        ) : (
          <div 
            className="break-all break-words overflow-wrap-anywhere whitespace-pre-line hyphens-auto text-sm sm:text-base leading-relaxed"
            style={{
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              hyphens: 'auto'
            }}
          >
            {message.content}
          </div>
        )}
      </div>
    </motion.div>
  );
};