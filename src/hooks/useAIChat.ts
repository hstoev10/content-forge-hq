import { useState, useCallback } from 'react';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Google Gemini API key not configured');
      }

      // Initialize Google Generative AI
      const google = createGoogleGenerativeAI({
        apiKey: apiKey,
      });

      const assistantId = (Date.now() + 1).toString();
      
      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: ''
      }]);

      // Stream the response
      const { textStream } = await streamText({
        model: google('gemini-2.5-flash'),
        system: 'Ти си полезен AI асистент на новинарски сайт. Отговаряй на въпроси за новини, събития и информация от сайта. Бъди любезен и професионален.',
        messages: [...messages, userMessage],
      });

      let fullContent = '';

      // Process the text stream
      for await (const textPart of textStream) {
        fullContent += textPart;
        
        // Update assistant message
        setMessages(prev => prev.map(msg => 
          msg.id === assistantId 
            ? { ...msg, content: fullContent }
            : msg
        ));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Съжалявам, възникна грешка. Моля, опитайте отново.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading
  };
}
