import React from "react";
import { 
  MessageCircle, 
  Users, 
  BookOpen,
  ExternalLink,
  Star,
  TrendingUp,
  Shield,
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Community() {
  const communityResources = [
    {
      title: "r/CryptoCurrency",
      description: "The largest cryptocurrency community on Reddit. Great for news, discussions, and asking questions.",
      platform: "Reddit",
      members: "5M+",
      icon: Users,
      color: "from-orange-400 to-red-500",
      tips: [
        "Read the rules before posting",
        "Use the daily discussion for quick questions",
        "Be respectful and kind to beginners"
      ],
      beginner_friendly: true
    },
    {
      title: "Bitcoin Talk Forum",
      description: "The original Bitcoin forum where Satoshi Nakamoto first posted. Technical discussions and project announcements.",
      platform: "Forum",
      members: "3M+",
      icon: MessageCircle,
      color: "from-yellow-400 to-orange-500",
      tips: [
        "More technical than other communities",
        "Great for deep discussions",
        "Check the Beginners & Help section"
      ],
      beginner_friendly: false
    },
    {
      title: "Crypto Twitter",
      description: "Follow crypto influencers, get real-time news, and join conversations. Can be overwhelming but very informative.",
      platform: "Twitter",
      members: "Millions",
      icon: TrendingUp,
      color: "from-blue-400 to-blue-600",
      tips: [
        "Follow reputable accounts first",
        "Be wary of investment advice",
        "Use lists to organize your feed"
      ],
      beginner_friendly: false
    },
    {
      title: "Discord Communities",
      description: "Real-time chat servers for various crypto projects. Great for getting help and meeting other enthusiasts.",
      platform: "Discord",
      members: "Varies",
      icon: MessageCircle,
      color: "from-purple-400 to-purple-600",
      tips: [
        "Start with official project Discords",
        "Be careful of DM scams",
        "Participate in beginner channels"
      ],
      beginner_friendly: true
    }
  ];

  const safetyTips = [
    {
      title: "Never Share Private Keys",
      description: "No legitimate person will ever ask for your private keys or recovery phrase.",
      icon: Shield,
      severity: "high"
    },
    {
      title: "Beware of Investment Advice",
      description: "Take all investment suggestions with a grain of salt. Do your own research.",
      icon: TrendingUp,
      severity: "medium"
    },
    {
      title: "Watch for Scam DMs",
      description: "Scammers often direct message newcomers. Be very cautious of unsolicited messages.",
      icon: MessageCircle,
      severity: "high"
    },
    {
      title: "Verify Information",
      description: "Always cross-check important information from multiple trusted sources.",
      icon: BookOpen,
      severity: "medium"
    }
  ];

  const beginnersGuide = [
    "Start by lurking (reading without posting) to understand community culture",
    "Ask questions in designated beginner threads or channels",
    "Be honest about your experience level - people are usually happy to help",
    "Share your learning journey - others can benefit from your questions",
    "Don't feel pressured to invest based on community hype",
    "Focus on educational content rather than price predictions"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Join the Crypto Community
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Connect with other learners, get help with questions, and stay updated with the latest in cryptocurrency. 
          Here's how to do it safely as a beginner.
        </p>
      </div>

      {/* Safety First Alert */}
      <Card className="mb-12 border-l-4 border-red-500 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-bold text-red-900 mb-2">Safety First!</h3>
              <p className="text-red-800">
                The crypto community is generally helpful, but scammers target beginners. 
                <strong> Never share your private keys, recovery phrases, or send cryptocurrency to someone promising returns.</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Platforms */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Where to Find the Community</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {communityResources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{resource.platform}</Badge>
                          <Badge variant="outline">{resource.members}</Badge>
                          {resource.beginner_friendly && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <Heart className="w-3 h-3 mr-1" />
                              Beginner Friendly
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{resource.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tips for success:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {resource.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Safety Tips */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Stay Safe in Crypto Communities</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {safetyTips.map((tip, index) => {
            const IconComponent = tip.icon;
            const severityColors = {
              high: "border-red-200 bg-red-50",
              medium: "border-yellow-200 bg-yellow-50"
            };
            const iconColors = {
              high: "text-red-600",
              medium: "text-yellow-600"
            };
            
            return (
              <Card key={index} className={`border-l-4 ${severityColors[tip.severity]}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`w-6 h-6 ${iconColors[tip.severity]} mt-1`} />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-700">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Beginner's Guide */}
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Beginner's Guide to Crypto Communities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">How to get started:</h3>
                <ul className="space-y-3">
                  {beginnersGuide.map((guide, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Good Questions to Ask:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• "I'm new to crypto, can you recommend learning resources?"</li>
                    <li>• "What's the difference between [concept A] and [concept B]?"</li>
                    <li>• "Is this exchange/wallet reputable?"</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Avoid Asking:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• "What coin will make me rich quick?"</li>
                    <li>• "Should I sell my house to buy crypto?"</li>
                    <li>• "Can someone help me recover my lost private key?"</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
        <CardContent className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-6 text-blue-100" />
          <h3 className="text-2xl font-bold mb-4">Ready to Join the Community?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
            Remember: the crypto community loves helping newcomers who are genuinely interested in learning. 
            Start with lurking, be respectful, and don't be afraid to ask questions!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3"
              onClick={() => window.open('https://reddit.com/r/cryptocurrency', '_blank')}
            >
              Visit r/CryptoCurrency
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-6 py-3"
              onClick={() => window.open('https://bitcointalk.org/', '_blank')}
            >
              Browse Bitcoin Talk
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}