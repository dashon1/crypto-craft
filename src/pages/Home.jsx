import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  ArrowRight, 
  BookOpen, 
  Shield, 
  TrendingUp, 
  Users,
  CheckCircle,
  PlayCircle,
  Star,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userProgress = await base44.entities.LearningProgress.filter({ created_by: currentUser.email });
      setProgress(userProgress);
    } catch (error) {
      // User not logged in, that's fine for public content
    }
    setIsLoading(false);
  };

  const learningModules = [
    {
      id: "crypto-basics",
      title: "What is Cryptocurrency?",
      description: "Start here! Learn what crypto is using simple, everyday analogies.",
      duration: "10 min",
      difficulty: "Beginner",
      icon: Sparkles,
      gradient: "from-blue-400 to-blue-600"
    },
    {
      id: "blockchain-explained",
      title: "Understanding Blockchain",
      description: "Think of blockchain like a digital ledger that everyone can see.",
      duration: "15 min", 
      difficulty: "Beginner",
      icon: Shield,
      gradient: "from-purple-400 to-purple-600"
    },
    {
      id: "buying-crypto",
      title: "How to Buy Cryptocurrency",
      description: "Step-by-step guide to making your first crypto purchase safely.",
      duration: "20 min",
      difficulty: "Beginner",
      icon: TrendingUp,
      gradient: "from-green-400 to-green-600"
    },
    {
      id: "storing-crypto",
      title: "Storing Your Crypto",
      description: "Learn about wallets and how to keep your cryptocurrency secure.",
      duration: "15 min",
      difficulty: "Beginner", 
      icon: Shield,
      gradient: "from-orange-400 to-orange-600"
    }
  ];

  const getProgressPercentage = () => {
    const completedLessons = progress.length;
    const totalLessons = learningModules.length;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const isLessonCompleted = (lessonId) => {
    return progress.some(p => p.lesson_id === lessonId);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              100% Free • No Technical Jargon
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
              Learn Cryptocurrency
              <br />
              <span className="text-3xl md:text-5xl">The Simple Way</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Finally understand Bitcoin, blockchain, and crypto without the confusing tech speak. 
              Start your journey with bite-sized lessons designed for complete beginners.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to={createPageUrl("Learn")}>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Learning Free
                </Button>
              </Link>
              <Link to={createPageUrl("Glossary")}>
                <Button variant="outline" className="px-8 py-3 text-lg rounded-full border-2 hover:bg-blue-50">
                  View Glossary
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-500">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">60min</div>
                <div className="text-sm text-gray-500">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Free</div>
                <div className="text-sm text-gray-500">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section (if user is logged in) */}
      {user && !isLoading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                Welcome back, {user.full_name?.split(' ')[0] || 'Learner'}!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Learning Progress</span>
                  <span className="font-semibold">{progress.length}/{learningModules.length} lessons completed</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-3" />
                <p className="text-sm text-gray-600">
                  {progress.length === 0 
                    ? "Ready to start your crypto journey?" 
                    : `${Math.round(getProgressPercentage())}% complete - keep going!`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Learning Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Start Your Crypto Education</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Each lesson builds on the previous one. No prior knowledge required!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {learningModules.map((module, index) => {
            const isCompleted = isLessonCompleted(module.id);
            const IconComponent = module.icon;
            
            return (
              <Card 
                key={module.id} 
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${module.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Lesson {index + 1}
                          </Badge>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{module.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>📚 {module.duration}</span>
                    <span>🎯 {module.difficulty}</span>
                  </div>
                  
                  <Link to={createPageUrl(`Lesson?id=${module.id}`)}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full group-hover:shadow-lg transition-all duration-200">
                      {isCompleted ? "Review Lesson" : "Start Lesson"}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why Learn Crypto Section */}
      <section className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Learn About Cryptocurrency?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Understanding crypto opens up new possibilities for your financial future
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Financial Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Crypto represents a new asset class with potential for growth and diversification in your portfolio.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Future Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Blockchain technology is revolutionizing how we think about money, contracts, and digital ownership.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Stay Informed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join millions worldwide who are already participating in the digital economy of the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}