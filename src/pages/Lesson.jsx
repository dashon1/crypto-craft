import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  BookOpen,
  Lightbulb,
  Trophy,
  Sparkles,
  Shield,
  TrendingUp,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Lesson() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = urlParams.get('id') || 'crypto-basics';

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const progress = await base44.entities.LearningProgress.filter({ 
        created_by: currentUser.email,
        lesson_id: lessonId 
      });
      setIsCompleted(progress.length > 0);
    } catch (error) {
      // User not logged in, that's fine for public content
    }
  }, [lessonId]); // Add lessonId to useCallback dependencies

  useEffect(() => {
    loadUserData();
  }, [loadUserData]); // Add loadUserData to useEffect dependencies

  const lessons = {
    "crypto-basics": {
      title: "What is Cryptocurrency?",
      icon: Sparkles,
      gradient: "from-blue-400 to-blue-600",
      sections: [
        {
          title: "Welcome to Cryptocurrency",
          content: `
            <p class="text-lg mb-6">Think of cryptocurrency as <strong>digital money</strong> that works completely differently from the cash in your wallet or the money in your bank account.</p>
            
            <div class="bg-blue-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-blue-900 mb-3">🏦 Traditional Money vs 💻 Cryptocurrency</h3>
              <div class="space-y-3 text-blue-800">
                <p><strong>Traditional:</strong> Controlled by banks and governments</p>
                <p><strong>Crypto:</strong> No single authority controls it</p>
                <p><strong>Traditional:</strong> Physical cash or bank transfers</p>
                <p><strong>Crypto:</strong> Completely digital, like email for money</p>
              </div>
            </div>

            <p>The most famous cryptocurrency is <strong>Bitcoin</strong>, but there are thousands of others. Each one is like a different type of digital coin with its own special features.</p>
          `
        },
        {
          title: "Why Does Cryptocurrency Exist?",
          content: `
            <p class="text-lg mb-6">Imagine you want to send money to a friend in another country. With traditional banking:</p>
            
            <div class="bg-red-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-red-900 mb-3">❌ Problems with Traditional Banking</h3>
              <ul class="space-y-2 text-red-800">
                <li>• Takes 3-5 business days</li>
                <li>• Expensive transfer fees ($15-50)</li>
                <li>• Banks are closed on weekends</li>
                <li>• Need multiple intermediaries</li>
                <li>• Requires both people to have bank accounts</li>
              </ul>
            </div>

            <div class="bg-green-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-green-900 mb-3">✅ With Cryptocurrency</h3>
              <ul class="space-y-2 text-green-800">
                <li>• Transfers in minutes, 24/7</li>
                <li>• Low fees (often under $1)</li>
                <li>• Works anywhere in the world</li>
                <li>• No banks needed as middlemen</li>
                <li>• Just need internet connection</li>
              </ul>
            </div>

            <p>Cryptocurrency was created to solve these problems and give people more control over their money.</p>
          `
        },
        {
          title: "How Is It Different?",
          content: `
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-purple-50 p-6 rounded-xl">
                <h3 class="font-semibold text-purple-900 mb-4">🏛️ Traditional Money</h3>
                <ul class="space-y-2 text-purple-800 text-sm">
                  <li>• Printed by government</li>
                  <li>• Stored in banks</li>
                  <li>• Transfers go through banks</li>
                  <li>• Banks keep the records</li>
                  <li>• Can be frozen or seized</li>
                  <li>• Value controlled by government</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 p-6 rounded-xl">
                <h3 class="font-semibold text-blue-900 mb-4">💎 Cryptocurrency</h3>
                <ul class="space-y-2 text-blue-800 text-sm">
                  <li>• Created by computer algorithms</li>
                  <li>• Stored in digital wallets</li>
                  <li>• Direct transfers between people</li>
                  <li>• Everyone has a copy of records</li>
                  <li>• You control your own money</li>
                  <li>• Value set by supply and demand</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-50 p-6 rounded-xl">
              <h3 class="font-semibold text-yellow-900 mb-3">💡 Think of it like this:</h3>
              <p class="text-yellow-800">Traditional money is like sending a letter through the post office - it goes through many hands and takes time. Cryptocurrency is like sending an email - it goes directly from you to the recipient, instantly.</p>
            </div>
          `
        }
      ],
      quiz: {
        questions: [
          {
            question: "What is the main advantage of cryptocurrency over traditional banking for international transfers?",
            options: [
              "It's completely free",
              "It's faster and cheaper with lower fees", 
              "It's more complex",
              "It requires more paperwork"
            ],
            correct: 1
          },
          {
            question: "Who controls cryptocurrency?",
            options: [
              "Banks and governments",
              "A single company",
              "No single authority - it's decentralized",
              "Only the person who created it"
            ],
            correct: 2
          }
        ]
      }
    },
    "blockchain-explained": {
      title: "Understanding Blockchain",
      icon: Shield,
      gradient: "from-purple-400 to-purple-600", 
      sections: [
        {
          title: "What is Blockchain?",
          content: `
            <p class="text-lg mb-6">Imagine a <strong>notebook that everyone in town has an identical copy of</strong>. Every time someone makes a transaction, it gets written in everyone's notebook at the same time.</p>
            
            <div class="bg-purple-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-purple-900 mb-3">📚 The Blockchain Notebook Analogy</h3>
              <div class="space-y-3 text-purple-800">
                <p><strong>Each page</strong> = A "block" of transactions</p>
                <p><strong>The whole notebook</strong> = The "blockchain"</p>
                <p><strong>Everyone has a copy</strong> = Decentralized network</p>
                <p><strong>New pages added</strong> = New blocks mined</p>
              </div>
            </div>

            <p>This is essentially what blockchain is - a digital ledger (record book) that's shared across thousands of computers worldwide. Every transaction is recorded and verified by the network.</p>
          `
        },
        {
          title: "Why Is It Secure?",
          content: `
            <p class="text-lg mb-6">The security comes from the fact that <strong>everyone has a copy</strong> and <strong>everyone watches everyone else</strong>.</p>
            
            <div class="bg-green-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-green-900 mb-3">🔒 Security Through Transparency</h3>
              <div class="space-y-4 text-green-800">
                <div>
                  <strong>Scenario:</strong> Someone tries to cheat by changing their transaction
                </div>
                <div class="pl-4 border-l-4 border-green-400">
                  <p><strong>What happens:</strong></p>
                  <ul class="mt-2 space-y-1">
                    <li>• Their copy doesn't match everyone else's</li>
                    <li>• The network rejects the false transaction</li>
                    <li>• The correct version is maintained</li>
                    <li>• The cheater is identified and blocked</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 p-6 rounded-xl">
              <h3 class="font-semibold text-blue-900 mb-3">🔗 Why "Blockchain"?</h3>
              <p class="text-blue-800">Each block of transactions is cryptographically "chained" to the previous block. If someone tries to change an old transaction, it would break the chain and everyone would notice immediately.</p>
            </div>
          `
        },
        {
          title: "Who Maintains the Blockchain?",
          content: `
            <div class="bg-orange-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-orange-900 mb-4">⛏️ Meet the Miners</h3>
              <p class="text-orange-800 mb-4">Miners are people with powerful computers who:</p>
              <ul class="space-y-2 text-orange-800">
                <li>• Verify new transactions are legitimate</li>
                <li>• Bundle transactions into new blocks</li>
                <li>• Add new blocks to the blockchain</li>
                <li>• Get rewarded with cryptocurrency for their work</li>
              </ul>
            </div>

            <div class="bg-gray-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">🏆 The Mining Race</h3>
              <p class="text-gray-800">Think of mining like a competitive puzzle-solving race:</p>
              <ol class="mt-3 space-y-2 text-gray-800 list-decimal list-inside">
                <li>New transactions come in and need to be verified</li>
                <li>Miners compete to solve a complex math puzzle</li>
                <li>First miner to solve it gets to add the new block</li>
                <li>They receive cryptocurrency as a reward</li>
                <li>Everyone updates their copy with the new block</li>
              </ol>
            </div>

            <p>This system ensures the blockchain is maintained by many people around the world, not just one central authority.</p>
          `
        }
      ],
      quiz: {
        questions: [
          {
            question: "What makes blockchain secure?",
            options: [
              "It's stored on one super secure computer",
              "Everyone has a copy and verifies transactions together",
              "It uses passwords",
              "Only banks can access it"
            ],
            correct: 1
          },
          {
            question: "What do miners do?",
            options: [
              "Dig for cryptocurrency underground",
              "Verify transactions and add new blocks to the blockchain",
              "Control the price of cryptocurrency",
              "Delete old transactions"
            ],
            correct: 1
          }
        ]
      }
    },
    "buying-crypto": {
      title: "How to Buy Cryptocurrency",
      icon: TrendingUp,
      gradient: "from-green-400 to-green-600",
      sections: [
        {
          title: "Getting Started Safely",
          content: `
            <p class="text-lg mb-6">Buying cryptocurrency is like opening a new type of bank account, but with some important differences.</p>
            
            <div class="bg-red-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-red-900 mb-3">⚠️ Before You Buy - Important Safety Rules</h3>
              <ul class="space-y-2 text-red-800">
                <li>• Only invest money you can afford to lose</li>
                <li>• Start small - maybe $20-100 for your first purchase</li>
                <li>• Use well-known, regulated exchanges</li>
                <li>• Never give your passwords or private keys to anyone</li>
                <li>• Be aware that cryptocurrency prices go up and down a lot</li>
              </ul>
            </div>

            <div class="bg-blue-50 p-6 rounded-xl">
              <h3 class="font-semibold text-blue-900 mb-3">🏪 What is a Cryptocurrency Exchange?</h3>
              <p class="text-blue-800">Think of it like a digital marketplace where you can trade your regular money (dollars, euros) for cryptocurrency. It's like a currency exchange at the airport, but for digital money.</p>
            </div>
          `
        },
        {
          title: "Choosing an Exchange",
          content: `
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-green-50 p-6 rounded-xl">
                <h3 class="font-semibold text-green-900 mb-4">✅ Good Exchanges Have:</h3>
                <ul class="space-y-2 text-green-800 text-sm">
                  <li>• Government regulation and licensing</li>
                  <li>• Good reputation and reviews</li>
                  <li>• Strong security measures</li>
                  <li>• Customer support</li>
                  <li>• Insurance for customer funds</li>
                  <li>• Easy-to-use interface</li>
                </ul>
              </div>
              
              <div class="bg-red-50 p-6 rounded-xl">
                <h3 class="font-semibold text-red-900 mb-4">❌ Avoid Exchanges That:</h3>
                <ul class="space-y-2 text-red-800 text-sm">
                  <li>• Promise unrealistic returns</li>
                  <li>• Have lots of negative reviews</li>
                  <li>• Ask for excessive personal info</li>
                  <li>• Have no customer support</li>
                  <li>• Are not regulated anywhere</li>
                  <li>• Pressure you to buy immediately</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-50 p-6 rounded-xl">
              <h3 class="font-semibold text-yellow-900 mb-3">🏆 Popular Beginner-Friendly Exchanges</h3>
              <p class="text-yellow-800">Some well-known exchanges for beginners include Coinbase, Kraken, and Binance. Always research and choose one that's available and regulated in your country.</p>
            </div>
          `
        },
        {
          title: "Making Your First Purchase",
          content: `
            <div class="bg-blue-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-blue-900 mb-3">📝 Step-by-Step Process</h3>
              <ol class="space-y-3 text-blue-800 list-decimal list-inside">
                <li><strong>Create Account:</strong> Sign up with email and verify your identity</li>
                <li><strong>Add Payment Method:</strong> Link your bank account or debit card</li>
                <li><strong>Choose Cryptocurrency:</strong> Bitcoin (BTC) is often recommended for beginners</li>
                <li><strong>Enter Amount:</strong> Start with a small amount you're comfortable with</li>
                <li><strong>Review & Buy:</strong> Double-check everything before confirming</li>
                <li><strong>Store Safely:</strong> Consider moving to a personal wallet for security</li>
              </ol>
            </div>

            <div class="bg-purple-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-purple-900 mb-3">💰 Understanding Fees</h3>
              <div class="space-y-2 text-purple-800">
                <p><strong>Trading Fee:</strong> Usually 0.5-2% of your purchase</p>
                <p><strong>Payment Processing:</strong> 3-5% if using credit/debit card</p>
                <p><strong>Withdrawal Fee:</strong> Small fee to move crypto to your own wallet</p>
              </div>
            </div>

            <div class="bg-green-50 p-6 rounded-xl">
              <h3 class="font-semibold text-green-900 mb-3">⏰ Best Practices</h3>
              <ul class="space-y-2 text-green-800">
                <li>• Don't try to time the market perfectly</li>
                <li>• Consider dollar-cost averaging (buying small amounts regularly)</li>
                <li>• Keep records for tax purposes</li>
                <li>• Never invest more than you can afford to lose</li>
              </ul>
            </div>
          `
        }
      ],
      quiz: {
        questions: [
          {
            question: "What should you do before buying cryptocurrency?",
            options: [
              "Invest all your savings immediately",
              "Start small with money you can afford to lose",
              "Buy as much as possible when prices are low",
              "Ignore fees and security"
            ],
            correct: 1
          },
          {
            question: "What is a cryptocurrency exchange?",
            options: [
              "A place where you mine cryptocurrency",
              "A digital marketplace to buy and sell cryptocurrency",
              "A type of cryptocurrency wallet",
              "A government agency that regulates crypto"
            ],
            correct: 1
          }
        ]
      }
    },
    "storing-crypto": {
      title: "Storing Your Crypto",
      icon: Wallet,
      gradient: "from-orange-400 to-orange-600",
      sections: [
        {
          title: "Understanding Cryptocurrency Wallets",
          content: `
            <p class="text-lg mb-6">A cryptocurrency wallet is <strong>not</strong> like your physical wallet. It doesn't actually store coins - instead, it stores the <strong>keys</strong> that prove you own cryptocurrency on the blockchain.</p>
            
            <div class="bg-orange-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-orange-900 mb-3">🔑 Think of it Like This</h3>
              <div class="space-y-3 text-orange-800">
                <p><strong>Your cryptocurrency</strong> = A safe deposit box at a bank</p>
                <p><strong>Your wallet</strong> = The keys to that safe deposit box</p>
                <p><strong>The blockchain</strong> = The bank that holds all the safe deposit boxes</p>
                <p><strong>Your private key</strong> = The only key that opens your specific box</p>
              </div>
            </div>

            <p>If you lose your keys (private key), you lose access to your cryptocurrency forever. This is why wallet security is so important!</p>
          `
        },
        {
          title: "Types of Wallets",
          content: `
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-red-50 p-6 rounded-xl">
                <h3 class="font-semibold text-red-900 mb-4">🔥 Hot Wallets (Connected to Internet)</h3>
                <div class="space-y-3 text-red-800 text-sm">
                  <p><strong>Examples:</strong> Exchange wallets, mobile apps, web wallets</p>
                  <p><strong>Pros:</strong> Convenient, easy to use, good for trading</p>
                  <p><strong>Cons:</strong> Vulnerable to hackers, exchange can freeze your account</p>
                  <p><strong>Best for:</strong> Small amounts you actively trade</p>
                </div>
              </div>
              
              <div class="bg-blue-50 p-6 rounded-xl">
                <h3 class="font-semibold text-blue-900 mb-4">🧊 Cold Wallets (Offline Storage)</h3>
                <div class="space-y-3 text-blue-800 text-sm">
                  <p><strong>Examples:</strong> Hardware wallets, paper wallets</p>
                  <p><strong>Pros:</strong> Very secure, you control your keys</p>
                  <p><strong>Cons:</strong> Less convenient, costs money to buy</p>
                  <p><strong>Best for:</strong> Large amounts you're holding long-term</p>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 p-6 rounded-xl">
              <h3 class="font-semibold text-purple-900 mb-3">🏆 Popular Hardware Wallets</h3>
              <p class="text-purple-800">Ledger Nano and Trezor are well-known hardware wallet brands. They look like USB drives and keep your keys completely offline and secure.</p>
            </div>
          `
        },
        {
          title: "Security Best Practices",
          content: `
            <div class="bg-green-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-green-900 mb-3">✅ Essential Security Steps</h3>
              <ul class="space-y-2 text-green-800">
                <li>• <strong>Backup your recovery phrase:</strong> Write it down on paper and store it safely</li>
                <li>• <strong>Use strong passwords:</strong> Different for each exchange and wallet</li>
                <li>• <strong>Enable 2-factor authentication:</strong> Adds an extra layer of security</li>
                <li>• <strong>Verify addresses:</strong> Always double-check before sending</li>
                <li>• <strong>Keep software updated:</strong> Install security updates promptly</li>
                <li>• <strong>Don't share private keys:</strong> Never give them to anyone, ever</li>
              </ul>
            </div>

            <div class="bg-red-50 p-6 rounded-xl mb-6">
              <h3 class="font-semibold text-red-900 mb-3">🚨 Common Mistakes to Avoid</h3>
              <ul class="space-y-2 text-red-800">
                <li>• Taking a screenshot of your recovery phrase</li>
                <li>• Storing your recovery phrase in cloud storage</li>
                <li>• Clicking suspicious links in emails</li>
                <li>• Using public Wi-Fi for crypto transactions</li>
                <li>• Falling for "give me crypto and I'll double it" scams</li>
                <li>• Keeping large amounts on exchanges long-term</li>
              </ul>
            </div>

            <div class="bg-yellow-50 p-6 rounded-xl">
              <h3 class="font-semibold text-yellow-900 mb-3">📝 Recovery Phrase Explained</h3>
              <p class="text-yellow-800">Your recovery phrase (also called seed phrase) is typically 12-24 words that can restore your wallet if you lose it. Treat it like the key to your house - keep it safe and never share it with anyone!</p>
            </div>
          `
        }
      ],
      quiz: {
        questions: [
          {
            question: "What's the main difference between hot and cold wallets?",
            options: [
              "Hot wallets are more expensive than cold wallets",
              "Hot wallets are connected to the internet, cold wallets are offline",
              "Hot wallets can only store Bitcoin",
              "Cold wallets are only for beginners"
            ],
            correct: 1
          },
          {
            question: "What should you do with your recovery phrase?",
            options: [
              "Share it with family in case you forget",
              "Store it in your email for easy access",
              "Write it down on paper and store it safely offline",
              "Take a photo and save it on your phone"
            ],
            correct: 2
          }
        ]
      }
    }
  };

  const currentLesson = lessons[lessonId];
  if (!currentLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Lesson Not Found</h1>
        <Button onClick={() => navigate(createPageUrl("Learn"))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning Path
        </Button>
      </div>
    );
  }

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const calculateQuizScore = () => {
    const correct = currentLesson.quiz.questions.filter((q, i) => 
      quizAnswers[i] === q.correct
    ).length;
    return Math.round((correct / currentLesson.quiz.questions.length) * 100);
  };

  const handleCompleteLesson = async () => {
    const score = calculateQuizScore();
    
    if (user) {
      try {
        await base44.entities.LearningProgress.create({
          lesson_id: lessonId,
          lesson_title: currentLesson.title,
          quiz_score: score
        });
        setIsCompleted(true);
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
    
    setShowResults(true);
  };

  const IconComponent = currentLesson.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Learn"))}
          className="hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>
        
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${currentLesson.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentSection + 1} of {currentLesson.sections.length + 1}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${currentLesson.gradient} h-2 rounded-full transition-all duration-300`}
            style={{ 
              width: `${((currentSection + 1) / (currentLesson.sections.length + 1)) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Lesson Content */}
      {currentSection < currentLesson.sections.length ? (
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentLesson.sections[currentSection].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: currentLesson.sections[currentSection].content 
              }} 
            />
          </CardContent>
        </Card>
      ) : (
        /* Quiz Section */
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Knowledge Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showResults ? (
              <>
                <p className="text-gray-600 mb-6">
                  Test your understanding with these questions:
                </p>
                
                {currentLesson.quiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="space-y-3">
                    <h3 className="font-semibold">{qIndex + 1}. {question.question}</h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label 
                          key={oIndex}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            onChange={() => handleQuizAnswer(qIndex, oIndex)}
                            className="text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                <Button 
                  onClick={handleCompleteLesson}
                  disabled={Object.keys(quizAnswers).length < currentLesson.quiz.questions.length}
                  className={`w-full bg-gradient-to-r ${currentLesson.gradient} text-white`}
                >
                  Complete Lesson
                </Button>
              </>
            ) : (
              /* Results */
              <div className="text-center space-y-4">
                <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${currentLesson.gradient} rounded-full flex items-center justify-center`}>
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold">Lesson Complete!</h3>
                <p className="text-xl">You scored {calculateQuizScore()}%</p>
                
                {calculateQuizScore() >= 80 ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Excellent work! You've mastered this topic.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      Good effort! Consider reviewing the lesson content to strengthen your understanding.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate(createPageUrl("Learn"))}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentSection(0);
                      setShowResults(false);
                      setQuizAnswers({});
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Review Lesson
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {!showResults && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentSection < currentLesson.sections.length ? (
            <Button
              onClick={() => setCurrentSection(currentSection + 1)}
              className={`bg-gradient-to-r ${currentLesson.gradient} text-white`}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      )}

      {/* Sign-in Reminder */}
      {!user && (
        <Card className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-3">Save Your Progress</h3>
            <p className="text-blue-100 mb-4">
              Sign in to track your learning progress and earn completion certificates.
            </p>
            <Button 
              onClick={() => base44.auth.redirectToLogin()} 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}