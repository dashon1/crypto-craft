import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, BookOpen, Clock, Loader2, ChevronRight, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CustomPlan() {
  const [user, setUser] = useState(null);
  const [cryptoName, setCryptoName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const plans = await base44.entities.CustomLearningPlan.filter({ 
        created_by: currentUser.email 
      });
      setSavedPlans(plans);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const generatePlan = async () => {
    if (!cryptoName.trim()) {
      setError("Please enter a cryptocurrency name");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedPlan(null);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a comprehensive learning plan for "${cryptoName}" cryptocurrency.
        
        Generate exactly 5 lessons that cover:
        1. What is ${cryptoName}? (Basics and history)
        2. How ${cryptoName} works (Technical overview in simple terms)
        3. Use cases and applications of ${cryptoName}
        4. How to buy and store ${cryptoName}
        5. Future outlook and considerations for ${cryptoName}
        
        For each lesson, provide:
        - A clear title
        - A 2-3 sentence description in beginner-friendly language
        - 3-4 specific topics that will be covered
        - Estimated duration (between 10-20 minutes)
        - Difficulty level (beginner, intermediate, or advanced)
        
        Make it educational, accurate, and engaging for someone new to crypto.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            crypto_symbol: { type: "string" },
            total_duration: { type: "string" },
            lessons: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  topics: {
                    type: "array",
                    items: { type: "string" }
                  },
                  duration: { type: "string" },
                  difficulty: { type: "string" }
                }
              }
            }
          }
        }
      });

      setGeneratedPlan(response);

      // Save to database if user is logged in
      if (user) {
        await base44.entities.CustomLearningPlan.create({
          crypto_name: cryptoName,
          crypto_symbol: response.crypto_symbol || cryptoName.toUpperCase(),
          plan_data: response,
          total_lessons: response.lessons?.length || 0,
          estimated_duration: response.total_duration
        });
        loadData();
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      setError("Failed to generate learning plan. Please try again.");
    }

    setIsGenerating(false);
  };

  const loadSavedPlan = (plan) => {
    setCryptoName(plan.crypto_name);
    setGeneratedPlan(plan.plan_data);
    setError("");
  };

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    advanced: "bg-red-100 text-red-800 border-red-200"
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="text-center py-20">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-indigo-100" />
            <h1 className="text-3xl font-bold mb-4">Custom Crypto Learning Plans</h1>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto text-lg">
              Get a personalized learning path for any cryptocurrency you're interested in!
            </p>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Sign In to Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Custom Plans
        </Badge>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Custom Learning Plans
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Enter any cryptocurrency name and get a personalized learning path created just for you
        </p>
      </div>

      {/* Generator */}
      <Card className="mb-12 shadow-xl border-0">
        <CardHeader>
          <CardTitle>Generate Your Custom Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter crypto name (e.g., Bitcoin, Ethereum, XRP, Cardano)..."
              value={cryptoName}
              onChange={(e) => setCryptoName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generatePlan()}
              className="flex-1 text-lg"
              disabled={isGenerating}
            />
            <Button
              onClick={generatePlan}
              disabled={isGenerating || !cryptoName.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-gray-500 w-full mb-2">Popular suggestions:</p>
            {['Bitcoin', 'Ethereum', 'XRP', 'Cardano', 'Solana', 'Polkadot'].map((crypto) => (
              <Button
                key={crypto}
                variant="outline"
                size="sm"
                onClick={() => {
                  setCryptoName(crypto);
                  setError("");
                }}
                disabled={isGenerating}
              >
                {crypto}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Plan */}
      {generatedPlan && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {cryptoName} Learning Path
              </h2>
              <p className="text-gray-600 mt-1">
                {generatedPlan.lessons?.length || 0} lessons • {generatedPlan.total_duration}
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2">
              Custom Plan
            </Badge>
          </div>

          <div className="space-y-6">
            {generatedPlan.lessons?.map((lesson, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6 items-center">
                    {/* Left: Lesson Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">
                            Lesson {index + 1}
                          </Badge>
                          <h3 className="text-xl font-bold">{lesson.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.duration}
                        </span>
                        <Badge className={`${difficultyColors[lesson.difficulty.toLowerCase()]} border text-xs`}>
                          {lesson.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Middle: Description and Topics */}
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Topics covered:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {lesson.topics?.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Action */}
                    <div className="flex justify-center lg:justify-end">
                      <div className="text-center">
                        <BookOpen className="w-12 h-12 mx-auto text-indigo-500 mb-2" />
                        <p className="text-sm text-gray-500">
                          Lesson content available in future update
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Saved Plans */}
      {savedPlans.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Saved Plans</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlans.map((plan) => (
              <Card key={plan.id} className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => loadSavedPlan(plan)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-indigo-100 text-indigo-800">
                      {plan.crypto_symbol}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(plan.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{plan.crypto_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{plan.total_lessons} lessons</span>
                    <span>{plan.estimated_duration}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadSavedPlan(plan);
                    }}
                  >
                    View Plan
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <Card className="mt-12 bg-indigo-50 border-indigo-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Sparkles className="w-6 h-6 text-indigo-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">How Custom Plans Work</h3>
              <p className="text-sm text-indigo-800">
                Our AI analyzes the latest information about any cryptocurrency you're interested in and creates 
                a personalized 5-lesson learning path. Whether it's Bitcoin, XRP, Ethereum, or any other crypto, 
                you'll get a structured plan covering basics, technology, use cases, trading, and future outlook.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}