import React, { useState } from "react";
import { Search, BookOpen, TrendingUp, Shield, Coins, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const glossaryTerms = [
    {
      term: "Blockchain",
      definition: "A digital ledger (record book) that's shared across many computers. Think of it like a notebook that everyone has an identical copy of, where every transaction is recorded and can't be erased.",
      category: "technology",
      icon: Shield,
      example: "Like a public library's checkout system where everyone can see which books are borrowed, but no one can fake or delete the records."
    },
    {
      term: "Bitcoin (BTC)",
      definition: "The first and most well-known cryptocurrency, created in 2009. Often called 'digital gold' because it's valuable and there's a limited supply.",
      category: "currency",
      icon: Coins,
      example: "If cryptocurrency is like email for money, Bitcoin is like Gmail - the most popular version that most people know about."
    },
    {
      term: "Cryptocurrency Exchange",
      definition: "A digital marketplace where you can buy, sell, and trade cryptocurrencies using regular money or other cryptocurrencies.",
      category: "platform",
      icon: TrendingUp,
      example: "Like a currency exchange at the airport, but for digital money instead of foreign cash."
    },
    {
      term: "Wallet",
      definition: "A digital tool that stores your cryptocurrency keys (not the actual coins). It's like having the keys to a safe deposit box.",
      category: "technology",
      icon: Shield,
      example: "Your wallet doesn't hold coins like a physical wallet holds cash - it holds the 'keys' that prove you own cryptocurrency on the blockchain."
    },
    {
      term: "Private Key",
      definition: "A secret code that proves you own specific cryptocurrency. If you lose this, you lose access to your crypto forever.",
      category: "security",
      icon: Shield,
      example: "Like the combination to your personal safe - only you should know it, and if you forget it, no one can help you open it."
    },
    {
      term: "Mining",
      definition: "The process of using computer power to verify transactions and add them to the blockchain. Miners get rewarded with cryptocurrency for this work.",
      category: "technology",
      icon: Coins,
      example: "Like being a volunteer accountant who checks everyone's math and gets paid for doing it correctly."
    },
    {
      term: "HODL",
      definition: "A term meaning to hold onto cryptocurrency long-term instead of selling it. Originally a typo of 'hold' that became popular.",
      category: "community",
      icon: Users,
      example: "Like buying a house and keeping it for 20 years instead of trying to flip it quickly for profit."
    },
    {
      term: "Market Cap",
      definition: "The total value of all coins of a particular cryptocurrency that exist. Calculated by multiplying the current price by the number of coins.",
      category: "trading",
      icon: TrendingUp,
      example: "If there are 100 coins worth $10 each, the market cap is $1,000. It shows how 'big' a cryptocurrency is."
    },
    {
      term: "Volatility",
      definition: "How much the price of cryptocurrency goes up and down. Crypto is known for having high volatility - prices can change quickly and dramatically.",
      category: "trading",
      icon: TrendingUp,
      example: "Like a roller coaster - the price can go from $100 to $150 to $80 all in one day."
    },
    {
      term: "DeFi (Decentralized Finance)",
      definition: "Financial services (like lending, borrowing, trading) that work without traditional banks, using cryptocurrency and blockchain instead.",
      category: "technology",
      icon: Coins,
      example: "Like being able to get a loan directly from other people instead of going through a bank."
    },
    {
      term: "NFT (Non-Fungible Token)",
      definition: "A unique digital certificate that proves you own a specific digital item, like digital art or collectibles.",
      category: "technology",
      icon: Shield,
      example: "Like having a certificate of authenticity for a painting, but for digital items like artwork or music."
    },
    {
      term: "Altcoin",
      definition: "Any cryptocurrency that's not Bitcoin. 'Alt' means alternative - so these are alternative coins to Bitcoin.",
      category: "currency",
      icon: Coins,
      example: "If Bitcoin is like Coca-Cola, altcoins are like Pepsi, Sprite, and all the other soft drink brands."
    },
    {
      term: "Cold Storage",
      definition: "Keeping your cryptocurrency keys completely offline, away from internet connections, usually on a hardware device.",
      category: "security",
      icon: Shield,
      example: "Like keeping your jewelry in a safe deposit box at a bank instead of in a jewelry box at home."
    },
    {
      term: "FOMO (Fear of Missing Out)",
      definition: "The anxiety that cryptocurrency prices might go up without you, leading to hasty buying decisions.",
      category: "community",
      icon: Users,
      example: "Like rushing to buy concert tickets because you're afraid they'll sell out, even if you're not sure you want to go."
    },
    {
      term: "Gas Fees",
      definition: "Small amounts of cryptocurrency you pay to complete transactions on the blockchain, like a processing fee.",
      category: "trading",
      icon: TrendingUp,
      example: "Like paying a small fee to use an ATM - you pay a little extra to process your transaction."
    }
  ];

  const categories = [
    { id: "all", name: "All Terms", icon: BookOpen },
    { id: "currency", name: "Currencies", icon: Coins },
    { id: "technology", name: "Technology", icon: Shield },
    { id: "trading", name: "Trading", icon: TrendingUp },
    { id: "security", name: "Security", icon: Shield },
    { id: "platform", name: "Platforms", icon: BookOpen },
    { id: "community", name: "Community", icon: Users }
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      currency: "bg-yellow-100 text-yellow-800 border-yellow-200",
      technology: "bg-blue-100 text-blue-800 border-blue-200",
      trading: "bg-green-100 text-green-800 border-green-200",
      security: "bg-red-100 text-red-800 border-red-200",
      platform: "bg-purple-100 text-purple-800 border-purple-200",
      community: "bg-pink-100 text-pink-800 border-pink-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cryptocurrency Glossary
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Simple explanations for cryptocurrency terms. No confusing jargon - just clear, 
          everyday language with helpful examples.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center mb-8">
        <p className="text-gray-600">
          {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
        </p>
      </div>

      {/* Glossary Terms */}
      <div className="grid gap-6">
        {filteredTerms.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{item.term}</CardTitle>
                      <Badge className={`mt-2 ${getCategoryColor(item.category)} border`}>
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {item.definition}
                </p>
                
                {item.example && (
                  <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Simple Example:</h4>
                    <p className="text-blue-800">{item.example}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No terms found</h3>
          <p className="text-gray-500">Try adjusting your search or browse different categories</p>
        </div>
      )}
    </div>
  );
}