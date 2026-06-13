import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, PieChart, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Portfolio() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    coin_symbol: "",
    coin_name: "",
    amount: "",
    purchase_price: "",
    transaction_type: "buy",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const transactions = await base44.entities.PortfolioSimulation.filter({ 
        created_by: currentUser.email 
      });
      setPortfolio(transactions);
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
    setIsLoading(false);
  };

  const addTransaction = async () => {
    if (!newTransaction.coin_symbol || !newTransaction.amount || !newTransaction.purchase_price) {
      return;
    }

    try {
      await base44.entities.PortfolioSimulation.create({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        purchase_price: parseFloat(newTransaction.purchase_price)
      });
      
      setNewTransaction({
        coin_symbol: "",
        coin_name: "",
        amount: "",
        purchase_price: "",
        transaction_type: "buy",
        notes: ""
      });
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await base44.entities.PortfolioSimulation.delete(id);
      loadData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const getPortfolioSummary = () => {
    const holdings = {};
    
    portfolio.forEach(transaction => {
      if (!holdings[transaction.coin_symbol]) {
        holdings[transaction.coin_symbol] = {
          symbol: transaction.coin_symbol,
          name: transaction.coin_name,
          totalAmount: 0,
          totalCost: 0,
          transactions: []
        };
      }
      
      if (transaction.transaction_type === 'buy') {
        holdings[transaction.coin_symbol].totalAmount += transaction.amount;
        holdings[transaction.coin_symbol].totalCost += transaction.amount * transaction.purchase_price;
      } else {
        holdings[transaction.coin_symbol].totalAmount -= transaction.amount;
        holdings[transaction.coin_symbol].totalCost -= transaction.amount * transaction.purchase_price;
      }
      
      holdings[transaction.coin_symbol].transactions.push(transaction);
    });

    return Object.values(holdings).filter(h => h.totalAmount > 0);
  };

  const getTotalInvested = () => {
    return portfolio
      .filter(t => t.transaction_type === 'buy')
      .reduce((sum, t) => sum + (t.amount * t.purchase_price), 0);
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
          <CardContent className="text-center py-20">
            <PieChart className="w-20 h-20 mx-auto mb-6 text-green-100" />
            <h1 className="text-3xl font-bold mb-4">Practice Portfolio Simulator</h1>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto text-lg">
              Track a simulated crypto portfolio without any real money. 
              Perfect for learning and practicing investment strategies!
            </p>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Sign In to Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const holdings = getPortfolioSummary();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Practice Portfolio
          </h1>
          <p className="text-gray-600 mt-2">
            Simulated trading - No real money involved
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Transaction Type</Label>
                <select
                  value={newTransaction.transaction_type}
                  onChange={(e) => setNewTransaction({...newTransaction, transaction_type: e.target.value})}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              
              <div>
                <Label>Cryptocurrency Symbol (e.g., BTC, ETH)</Label>
                <Input
                  value={newTransaction.coin_symbol}
                  onChange={(e) => setNewTransaction({...newTransaction, coin_symbol: e.target.value.toUpperCase()})}
                  placeholder="BTC"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Full Name</Label>
                <Input
                  value={newTransaction.coin_name}
                  onChange={(e) => setNewTransaction({...newTransaction, coin_name: e.target.value})}
                  placeholder="Bitcoin"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="0.5"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Price per Unit ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newTransaction.purchase_price}
                  onChange={(e) => setNewTransaction({...newTransaction, purchase_price: e.target.value})}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Notes (optional)</Label>
                <Input
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                  placeholder="Why I made this trade..."
                  className="mt-1"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Total: ${(parseFloat(newTransaction.amount || 0) * parseFloat(newTransaction.purchase_price || 0)).toFixed(2)}
                </p>
              </div>
              
              <Button
                onClick={addTransaction}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white"
              >
                Add Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Invested</p>
                <p className="text-2xl font-bold">${getTotalInvested().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Assets Held</p>
                <p className="text-2xl font-bold">{holdings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold">{portfolio.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings */}
      <Card className="mb-8 shadow-xl border-0">
        <CardHeader>
          <CardTitle>Current Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No holdings yet. Add your first transaction to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {holdings.map((holding, index) => {
                const avgPrice = holding.totalCost / holding.totalAmount;
                return (
                  <div key={index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {holding.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{holding.name}</h3>
                          <p className="text-sm text-gray-500">{holding.symbol}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">{holding.totalAmount.toFixed(8)} {holding.symbol}</p>
                        <p className="text-sm text-gray-500">Avg: ${avgPrice.toFixed(2)}</p>
                        <p className="text-sm font-semibold text-gray-700">
                          Cost: ${holding.totalCost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...portfolio].reverse().map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Badge className={transaction.transaction_type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {transaction.transaction_type.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-semibold">
                        {transaction.amount} {transaction.coin_symbol}
                      </p>
                      <p className="text-sm text-gray-500">
                        @ ${transaction.purchase_price} = ${(transaction.amount * transaction.purchase_price).toFixed(2)}
                      </p>
                      {transaction.notes && (
                        <p className="text-xs text-gray-400 mt-1">{transaction.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_date).toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Educational Note */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            💡 <strong>Learning Tool:</strong> This is a simulation for educational purposes. 
            Track your hypothetical investments to learn about portfolio management without any financial risk. 
            Prices are not updated in real-time - enter them manually to practice record-keeping.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}