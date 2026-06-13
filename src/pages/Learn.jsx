import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Star,
  Award,
  Target,
  Sparkles,
  Shield,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Learn() {
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

  const learningPath = [
    {
      id: "crypto-basics",
      title: "What is Cryptocurrency?",
      subtitle: "Your first step into the crypto world",
      description: "Learn what cryptocurrency is using simple analogies. We'll compare crypto to digital cash and explain why it matters.",
      duration: "10 min",
      difficulty: "Beginner",
      icon: Sparkles,
      gradient: "from-blue-400 to-blue-600",
      topics: [
        "What is cryptocurrency in simple terms",
        "How crypto differs from regular money", 
        "Real-world examples and use cases",
        "Common myths debunked"
      ]
    },
    {
      id: "blockchain-explained", 
      title: "Understanding Blockchain",
      subtitle: "The technology behind cryptocurrency",
      description: "Discover how blockchain works using the analogy of a public ledger that everyone can see and verify.",
      duration: "15 min",
      difficulty: "Beginner",
      icon: Shield,
      gradient: "from-purple-400 to-purple-600",
      topics: [
        "What blockchain actually means",
        "Why it's secure and trustworthy",
        "How transactions are verified",
        "The role of miners and validators"
      ]
    },
    {
      id: "buying-crypto",
      title: "How to Buy Cryptocurrency", 
      subtitle: "Making your first purchase safely",
      description: "Step-by-step walkthrough of buying your first cryptocurrency, including choosing exchanges and staying safe.",
      duration: "20 min",
      difficulty: "Beginner",
      icon: TrendingUp,
      gradient: "from-green-400 to-green-600",
      topics: [
        "Choosing a reputable exchange",
        "Setting up your account securely",
        "Making your first purchase",
        "Understanding fees and timing"
      ]
    },
    {
      id: "storing-crypto",
      title: "Storing Your Crypto",
      subtitle: "Keeping your investment secure",
      description: "Learn about different types of wallets and how to keep your cryptocurrency safe from hackers and scams.",
      duration: "15 min", 
      difficulty: "Beginner",
      icon: Shield,
      gradient: "from-orange-400 to-orange-600",
      topics: [
        "Hot vs cold wallets explained",
        "Setting up a secure wallet",
        "Backup and recovery phrases",
        "Common security mistakes to avoid"
      ]
    }
  ];

  const getProgressPercentage = () => {
    const completedLessons = progress.length;
    const totalLessons = learningPath.length;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const isLessonCompleted = (lessonId) => {
    return progress.some(p => p.lesson_id === lessonId);
  };

  const getNextLesson = () => {
    return learningPath.find(lesson => !isLessonCompleted(lesson.id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cryptocurrency Learning Path
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Master the fundamentals of cryptocurrency with our beginner-friendly lessons. 
          Each lesson builds on the previous one, so you'll never feel lost.
        </p>
      </div>

      {/* Progress Card (if user is logged in) */}
      {user && !isLoading && (
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Your Learning Progress</CardTitle>
                  <p className="text-gray-600">
                    {progress.length === 0 ? "Ready to begin your journey!" : `${progress.length}/${learningPath.length} lessons completed`}
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2">
                <Star className="w-4 h-4 mr-1" />
                {Math.round(getProgressPercentage())}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={getProgressPercentage()} className="h-3 mb-4" />
            {getNextLesson() && (
              <div className="flex items-center justify-between">
                <p className="text-gray-700">
                  Next up: <span className="font-semibold">{getNextLesson().title}</span>
                </p>
                <Link to={createPageUrl(`Lesson?id=${getNextLesson().id}`)}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    Continue Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Learning Path */}
      <div className="space-y-8">
        {learningPath.map((lesson, index) => {
          const isCompleted = isLessonCompleted(lesson.id);
          const IconComponent = lesson.icon;
          const isLocked = index > 0 && !isLessonCompleted(learningPath[index - 1].id) && user;
          
          return (
            <Card 
              key={lesson.id}
              className={`group transition-all duration-300 border-0 shadow-lg hover:shadow-2xl ${
                isLocked ? "opacity-60" : "bg-white/80 backdrop-blur-sm"
              }`}
            >
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  {/* Left: Icon and Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${lesson.gradient} rounded-2xl flex items-center justify-center shadow-lg ${
                        isLocked ? "" : "group-hover:scale-110"
                      } transition-transform duration-200`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Lesson {index + 1}
                          </Badge>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {isLocked && (
                            <Badge variant="secondary">
                              Locked
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{lesson.title}</h3>
                        <p className="text-blue-600 font-medium">{lesson.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Description and Topics */}
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">What you'll learn:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {lesson.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <div className="flex justify-center lg:justify-end">
                    {isLocked ? (
                      <div className="text-center">
                        <p className="text-gray-500 text-sm mb-2">
                          Complete previous lesson to unlock
                        </p>
                        <Button disabled className="w-full lg:w-auto">
                          Locked
                        </Button>
                      </div>
                    ) : (
                      <Link to={createPageUrl(`Lesson?id=${lesson.id}`)}>
                        <Button 
                          className={`w-full lg:w-auto px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                            isCompleted 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          } text-white`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Review Lesson
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-5 h-5 mr-2" />
                              Start Lesson
                            </>
                          )}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      {!user && (
        <Card className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Track Your Progress</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Sign in to save your progress, earn completion badges, and get personalized recommendations.
            </p>
            <Button 
              onClick={() => base44.auth.redirectToLogin()} 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-full"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}