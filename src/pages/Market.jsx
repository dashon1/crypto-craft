import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, BarChart3, Search, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Market() {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current cryptocurrency market data for the top 20 cryptocurrencies by market cap. 
        For each coin include: name, symbol, current price in USD, 24h price change percentage, market cap, and 24h trading volume.
        Format as structured data.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            coins: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  symbol: { type: "string" },
                  current_price: { type: "number" },
                  price_change_24h: { type: "number" },
                  market_cap: { type: "number" },
                  volume_24h: { type: "number" }
                }
              }
            }
          }
        }
      });

      if (response.coins) {
        setCryptoData(response.coins);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
    setIsLoading(false);
  };

  const filteredData = cryptoData.filter(coin =>
    coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatLargeNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Live Crypto Market
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real-time cryptocurrency prices and market data powered by AI
        </p>
      </div>

      {/* Search and Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={fetchMarketData}
          disabled={isLoading}
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Updating...' : 'Refresh Data'}
        </Button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500 text-center mb-6">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* Market Cards */}
      <div className="grid gap-4">
        {isLoading && cryptoData.length === 0 ? (
          <div className="text-center py-20">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
            <p className="text-gray-600">Loading market data...</p>
          </div>
        ) : (
          filteredData.map((coin, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                  {/* Coin Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {coin.symbol?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{coin.name}</h3>
                      <p className="text-sm text-gray-500">{coin.symbol?.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="text-lg font-bold">{formatPrice(coin.current_price)}</p>
                  </div>

                  {/* 24h Change */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">24h Change</p>
                    <div className={`flex items-center gap-1 font-semibold ${
                      coin.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.price_change_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(coin.price_change_24h).toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Market Cap */}
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                    <p className="font-semibold">{formatLargeNumber(coin.market_cap)}</p>
                  </div>

                  {/* Volume */}
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-500 mb-1">24h Volume</p>
                    <p className="font-semibold">{formatLargeNumber(coin.volume_24h)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredData.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      )}

      {/* Disclaimer */}
      <Card className="mt-12 bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Educational Purpose Only:</strong> This data is provided for learning purposes. 
            Always verify information from official sources before making any investment decisions. 
            Cryptocurrency prices are highly volatile.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}