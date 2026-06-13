
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { BookOpen, Home, HelpCircle, Users, Coins, TrendingUp, Trophy, MessageSquare, Bookmark, Zap, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      loadStreak(currentUser.email);
    } catch (error) {
      // User not logged in
    }
  };

  const loadStreak = async (userEmail) => {
    try {
      const challenges = await base44.entities.DailyChallenge.filter({ created_by: userEmail }, '-challenge_date', 1);
      if (challenges.length > 0) {
        setStreakCount(challenges[0].streak_count || 0);
      }
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const navigationItems = [
    { name: "Home", url: createPageUrl("Home"), icon: Home },
    { name: "Learn", url: createPageUrl("Learn"), icon: BookOpen },
    { name: "Custom Plan", url: createPageUrl("CustomPlan"), icon: Sparkles, badge: "New" },
    { name: "Market", url: createPageUrl("Market"), icon: TrendingUp, badge: "Live" },
    { name: "AI Tutor", url: createPageUrl("AITutor"), icon: MessageSquare },
    { name: "Practice", url: createPageUrl("Practice"), icon: Trophy },
    { name: "Portfolio", url: createPageUrl("Portfolio"), icon: Coins },
    { name: "Social", url: createPageUrl("Social"), icon: Users },
    { name: "My Library", url: createPageUrl("Library"), icon: Bookmark },
    { name: "Glossary", url: createPageUrl("Glossary"), icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CryptoBasics
                </h1>
                <p className="text-xs text-gray-500">Learn crypto simply</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.slice(0, 5).map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0 h-4">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {user && streakCount > 0 && (
                <div className="hidden md:flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">{streakCount}</span>
                  <span className="text-xs">day streak</span>
                </div>
              )}
              
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Admin' : 'Learner'}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => base44.auth.logout()}
                    className="hidden sm:inline-flex"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-16 bottom-0 w-64 bg-white shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
            {user && (
              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => {
                  base44.auth.logout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Learn cryptocurrency at your own pace • Free educational content for everyone
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Built to make crypto accessible and understandable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
