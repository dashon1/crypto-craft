import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Bot, User, Sparkles, Lightbulb, TrendingUp, Shield, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AITutor() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    // Welcome message
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm your personal crypto tutor. Ask me anything about cryptocurrency, blockchain, or crypto investing. I'll explain it in simple terms!",
      timestamp: new Date()
    }]);
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      // Not logged in
    }
  };

  const suggestedQuestions = [
    { icon: Sparkles, text: "What is proof of work?", category: "Beginner" },
    { icon: Shield, text: "How do I keep my crypto safe?", category: "Security" },
    { icon: TrendingUp, text: "What's dollar-cost averaging?", category: "Strategy" },
    { icon: Coins, text: "What's the difference between coins and tokens?", category: "Beginner" }
  ];

  const handleSendMessage = async (messageText) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    const userMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a friendly cryptocurrency tutor for beginners. 
        A student asks: "${textToSend}"
        
        Provide a clear, simple explanation that:
        1. Avoids technical jargon or explains it in simple terms
        2. Uses analogies and real-world examples
        3. Is encouraging and educational
        4. Keeps the answer concise (2-3 paragraphs max)
        5. Ends with asking if they want to know more or have other questions
        
        Answer the question:`,
        add_context_from_internet: true
      });

      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Learning
        </Badge>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Personal Crypto Tutor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ask any question about cryptocurrency and get instant, easy-to-understand explanations
        </p>
      </div>

      {/* Chat Container */}
      <Card className="mb-6 shadow-xl border-0">
        <CardContent className="p-6">
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about crypto..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Try asking me about:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {suggestedQuestions.map((question, index) => {
              const IconComponent = question.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question.text)}
                  disabled={isLoading}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 group-hover:from-purple-500 group-hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-200">
                    <IconComponent className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      {question.text}
                    </p>
                    <p className="text-xs text-gray-500">{question.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sign-in Reminder */}
      {!user && (
        <Card className="mt-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-3">Want to save your conversations?</h3>
            <p className="text-purple-100 mb-4">
              Sign in to keep track of your questions and learning progress
            </p>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}