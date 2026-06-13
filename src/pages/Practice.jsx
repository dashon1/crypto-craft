import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trophy, Target, Clock, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Practice() {
  const [user, setUser] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const attempts = await base44.entities.QuizAttempt.filter({ created_by: currentUser.email });
      setQuizAttempts(attempts);

      const today = new Date().toISOString().split('T')[0];
      const challenges = await base44.entities.DailyChallenge.filter({
        created_by: currentUser.email,
        challenge_date: today
      });
      if (challenges.length > 0) {
        setDailyChallenge(challenges[0]);
      }

      const userAchievements = await base44.entities.Achievement.filter({ created_by: currentUser.email });
      setAchievements(userAchievements);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const quizzes = [
    {
      id: "crypto-fundamentals",
      title: "Crypto Fundamentals",
      description: "Test your understanding of cryptocurrency basics",
      difficulty: "beginner",
      questions: [
        {
          question: "What makes Bitcoin different from traditional currency?",
          options: [
            "It's controlled by banks",
            "It's decentralized with no single authority",
            "It's only used online",
            "It has a fixed price"
          ],
          correct: 1
        },
        {
          question: "What is a blockchain?",
          options: [
            "A type of cryptocurrency",
            "A digital wallet",
            "A distributed ledger that records transactions",
            "A mining device"
          ],
          correct: 2
        },
        {
          question: "What does 'decentralized' mean?",
          options: [
            "Located in one central place",
            "Not controlled by any single authority",
            "Encrypted and secure",
            "Available worldwide"
          ],
          correct: 1
        },
        {
          question: "What is cryptocurrency mining?",
          options: [
            "Digging for digital coins",
            "Buying crypto at low prices",
            "Verifying transactions and adding them to the blockchain",
            "Storing cryptocurrency safely"
          ],
          correct: 2
        },
        {
          question: "What is a private key?",
          options: [
            "A password for an exchange",
            "A secret code that proves you own your crypto",
            "A public address to receive payments",
            "A type of cryptocurrency"
          ],
          correct: 1
        }
      ]
    },
    {
      id: "security-best-practices",
      title: "Security Best Practices",
      description: "Learn how to keep your crypto safe",
      difficulty: "beginner",
      questions: [
        {
          question: "Where should you store your recovery phrase?",
          options: [
            "In your email",
            "On your phone as a photo",
            "Written on paper in a safe place",
            "In cloud storage"
          ],
          correct: 2
        },
        {
          question: "What is two-factor authentication (2FA)?",
          options: [
            "Using two passwords",
            "An extra security layer requiring a second verification",
            "A type of wallet",
            "A trading strategy"
          ],
          correct: 1
        },
        {
          question: "What should you do if someone DMs you offering to double your crypto?",
          options: [
            "Send them a small amount first",
            "Ask for proof",
            "Ignore and report them as a scammer",
            "Share your wallet address"
          ],
          correct: 2
        },
        {
          question: "What's the safest wallet for long-term storage?",
          options: [
            "Exchange wallet",
            "Hot wallet on your phone",
            "Cold wallet (hardware wallet)",
            "Web-based wallet"
          ],
          correct: 2
        },
        {
          question: "Should you share your private key with support staff?",
          options: [
            "Yes, if they ask for it",
            "Only with official support",
            "Never, under any circumstances",
            "Only through secure channels"
          ],
          correct: 2
        }
      ]
    },
    {
      id: "trading-investing",
      title: "Trading & Investing",
      description: "Master the basics of crypto investing",
      difficulty: "intermediate",
      questions: [
        {
          question: "What is dollar-cost averaging?",
          options: [
            "Buying all at once when prices are low",
            "Investing the same amount regularly regardless of price",
            "Selling when prices go down",
            "Trading based on news"
          ],
          correct: 1
        },
        {
          question: "What does 'HODL' mean?",
          options: [
            "An investment strategy",
            "Hold On for Dear Life (holding long-term)",
            "A type of wallet",
            "A cryptocurrency"
          ],
          correct: 1
        },
        {
          question: "What is market volatility?",
          options: [
            "The trading volume",
            "How much prices fluctuate up and down",
            "The total market value",
            "The number of transactions"
          ],
          correct: 1
        },
        {
          question: "What should you invest in cryptocurrency?",
          options: [
            "All your savings",
            "Borrowed money",
            "Only what you can afford to lose",
            "Your retirement fund"
          ],
          correct: 2
        },
        {
          question: "What are 'gas fees'?",
          options: [
            "Fees charged by exchanges",
            "Transaction fees on blockchain networks",
            "Costs of mining",
            "Storage fees for wallets"
          ],
          correct: 1
        }
      ]
    }
  ];

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setQuizAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const calculateScore = () => {
    const correct = currentQuiz.questions.filter((q, i) => 
      quizAnswers[i] === q.correct
    ).length;
    return Math.round((correct / currentQuiz.questions.length) * 100);
  };

  const submitQuiz = async () => {
    const score = calculateScore();
    const correctCount = currentQuiz.questions.filter((q, i) => quizAnswers[i] === q.correct).length;
    
    if (user) {
      try {
        await base44.entities.QuizAttempt.create({
          quiz_id: currentQuiz.id,
          quiz_name: currentQuiz.title,
          score: score,
          total_questions: currentQuiz.questions.length,
          correct_answers: correctCount,
          time_spent: 0,
          difficulty: currentQuiz.difficulty
        });

        // Check for achievements
        if (score === 100 && achievements.filter(a => a.achievement_id === 'perfect_score').length === 0) {
          await base44.entities.Achievement.create({
            achievement_id: 'perfect_score',
            achievement_name: 'Perfect Score',
            achievement_description: 'Got 100% on a quiz!',
            badge_icon: 'Trophy',
            badge_color: 'from-yellow-400 to-orange-500'
          });
        }

        loadData();
      } catch (error) {
        console.error("Error saving quiz:", error);
      }
    }
    
    setShowResults(true);
  };

  const getAverageScore = () => {
    if (quizAttempts.length === 0) return 0;
    const total = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round(total / quizAttempts.length);
  };

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    advanced: "bg-red-100 text-red-800 border-red-200"
  };

  if (currentQuiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentQuiz.title}</CardTitle>
                <p className="text-gray-600 mt-1">{currentQuiz.description}</p>
              </div>
              <Button variant="outline" onClick={() => setCurrentQuiz(null)}>
                Exit Quiz
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!showResults ? (
              <div className="space-y-6">
                <Progress value={(Object.keys(quizAnswers).length / currentQuiz.questions.length) * 100} className="h-2" />
                <p className="text-sm text-gray-600 text-center">
                  {Object.keys(quizAnswers).length} of {currentQuiz.questions.length} answered
                </p>

                {currentQuiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="space-y-3 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label
                          key={oIndex}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            quizAnswers[qIndex] === oIndex
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={quizAnswers[qIndex] === oIndex}
                            onChange={() => handleAnswer(qIndex, oIndex)}
                            className="text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < currentQuiz.questions.length}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6 text-lg"
                >
                  Submit Quiz
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                  calculateScore() >= 80 ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <div className="text-4xl font-bold">
                    {calculateScore()}%
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                  <p className="text-gray-600">
                    You got {currentQuiz.questions.filter((q, i) => quizAnswers[i] === q.correct).length} out of {currentQuiz.questions.length} correct
                  </p>
                </div>

                {calculateScore() === 100 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <Trophy className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                    <p className="font-semibold text-yellow-900">Perfect Score! 🎉</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuiz(null)}
                    className="py-6"
                  >
                    Back to Quizzes
                  </Button>
                  <Button
                    onClick={() => {
                      setQuizAnswers({});
                      setShowResults(false);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Practice & Challenges
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Test your knowledge, complete challenges, and earn achievements
        </p>
      </div>

      {/* Stats */}
      {user && !isLoading && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quizzes Completed</p>
                  <p className="text-2xl font-bold">{quizAttempts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-bold">{getAverageScore()}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Achievements</p>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Quizzes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${difficultyColors[quiz.difficulty]} border`}>
                    {quiz.difficulty}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {quiz.questions.length} questions
                  </div>
                </div>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{quiz.description}</p>
                <Button
                  onClick={() => startQuiz(quiz)}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sign-in Prompt */}
      {!user && (
        <Card className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0">
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-orange-100" />
            <h3 className="text-2xl font-bold mb-4">Track Your Progress</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto text-lg">
              Sign in to save your quiz scores, earn achievements, and compete on leaderboards!
            </p>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Sign In to Start
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}