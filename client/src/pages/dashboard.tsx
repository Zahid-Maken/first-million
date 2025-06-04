import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import DesktopSidebar from "@/components/navigation/desktop-sidebar";
import MobileNav from "@/components/navigation/mobile-nav";
import ExpensePieChart from "@/components/charts/expense-pie-chart";
import IncomeExpenseChart from "@/components/charts/income-expense-chart";
import InvestmentChart from "@/components/charts/investment-chart";
import AddTransactionModal from "@/components/modals/add-transaction-modal";
import AddCategoryModal from "@/components/modals/add-category-modal";
import AddInvestmentModal from "@/components/modals/add-investment-modal";
import AddGoalModal from "@/components/modals/add-goal-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  PieChart,
  BarChart3,
  LineChart,
  Download,
  Edit
} from "lucide-react";
import type { Transaction, Category, Investment, Goal } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  // Data queries
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !!user,
    retry: false,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: !!user,
    retry: false,
  });

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
    enabled: !!user,
    retry: false,
  });

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
    enabled: !!user,
    retry: false,
  });

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalInvestments = investments
    .reduce((sum, i) => sum + parseFloat(i.currentValue), 0);

  const netWorth = totalIncome - totalExpenses + totalInvestments;

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
      />

      {/* Mobile Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="md:ml-72 pb-24 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-card/80 nav-blur border-b border-border p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">First Million</h1>
              <p className="text-muted-foreground text-sm font-medium">
                Welcome back, {user?.firstName || user?.email?.split('@')[0] || "User"}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-semibold">
                {(user?.firstName || user?.email || "U")[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="m-0">
            {/* Desktop Header */}
            <div className="hidden md:block bg-card border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground mt-1 font-medium">Your financial overview</p>
                </div>
                <Button 
                  onClick={() => setShowAddTransaction(true)}
                  className="bg-gradient-primary text-white shadow-glow hover:shadow-card-hover transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Net Worth Summary */}
              <Card className="bg-gradient-primary text-white shadow-glow border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                <CardContent className="p-6 md:p-8 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white/90">Total Net Worth</h2>
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-6 text-white">
                    ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-white/70 text-sm font-medium">Income</p>
                      <p className="font-bold text-lg text-white">${totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-white/70 text-sm font-medium">Expenses</p>
                      <p className="font-bold text-lg text-white">${totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-white/70 text-sm font-medium">Investments</p>
                      <p className="font-bold text-lg text-white">${totalInvestments.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                      onClick={() => setShowAddTransaction(true)}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Add Income</h3>
                    <p className="text-sm text-muted-foreground">Record earnings</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                      onClick={() => setShowAddTransaction(true)}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-destructive to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <TrendingDown className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Add Expense</h3>
                    <p className="text-sm text-muted-foreground">Track spending</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                      onClick={() => setShowAddInvestment(true)}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-warning rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <LineChart className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Invest</h3>
                    <p className="text-sm text-muted-foreground">Grow wealth</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                      onClick={() => setShowAddGoal(true)}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Set Goals</h3>
                    <p className="text-sm text-muted-foreground">Plan targets</p>
                  </CardContent>
                </Card>
              </div>

              {/* Investment Gap Analysis */}
              <Card className="border-0 shadow-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">Investment Gap Analysis</h3>
                    <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {goals.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">Set investment goals to track your progress</p>
                      <Button 
                        onClick={() => setShowAddGoal(true)}
                        className="bg-gradient-primary text-white shadow-glow"
                      >
                        Create Your First Goal
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal) => {
                        const progress = Math.min((totalInvestments / parseFloat(goal.targetAmount)) * 100, 100);
                        const remaining = Math.max(parseFloat(goal.targetAmount) - totalInvestments, 0);
                        const isCompleted = progress >= 100;
                        
                        return (
                          <div key={goal.id} className="bg-muted/30 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-foreground">{goal.name}</h4>
                              <Badge variant={isCompleted ? "default" : "secondary"} className="rounded-full">
                                {isCompleted ? "Completed" : `${progress.toFixed(1)}%`}
                              </Badge>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="text-foreground font-medium">
                                  ${totalInvestments.toLocaleString()} / ${parseFloat(goal.targetAmount).toLocaleString()}
                                </span>
                              </div>
                              <Progress 
                                value={progress} 
                                className="h-3 bg-muted"
                              />
                            </div>
                            {!isCompleted && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  ${remaining.toLocaleString()} remaining
                                </span>
                                <Button 
                                  size="sm" 
                                  onClick={() => setShowAddInvestment(true)}
                                  className="bg-gradient-primary text-white text-xs px-3 py-1 h-auto"
                                >
                                  Invest Now
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpensePieChart transactions={transactions} categories={categories} />
                <IncomeExpenseChart transactions={transactions} />
              </div>

              {/* Investment Portfolio Chart */}
              <InvestmentChart investments={investments} />

              {/* Recent Transactions */}
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab("transactions")}
                      className="text-muted-foreground hover:text-primary"
                    >
                      View All
                    </Button>
                  </div>
                  
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">No transactions yet. Start tracking your finances!</p>
                      <Button 
                        onClick={() => setShowAddTransaction(true)}
                        className="bg-gradient-primary text-white shadow-glow"
                      >
                        Add First Transaction
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => {
                        const category = categories.find(c => c.id === transaction.categoryId);
                        const isIncome = transaction.type === "income";
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors duration-200">
                            <div className="flex items-center">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                                isIncome 
                                  ? "bg-gradient-success" 
                                  : "bg-gradient-to-br from-destructive to-red-500"
                              }`}>
                                <DollarSign className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{transaction.description || "Transaction"}</p>
                                <p className="text-sm text-muted-foreground">{category?.name || transaction.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold text-lg ${
                                isIncome ? "text-success" : "text-destructive"
                              }`}>
                                {isIncome ? "+" : "-"}${parseFloat(transaction.amount).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="m-0">
            <div className="hidden md:block bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-dark">Transactions</h1>
                  <p className="text-gray-500 mt-1">Manage your income and expenses</p>
                </div>
                <Button onClick={() => setShowAddTransaction(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3">
                  {transactions.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No transactions found</p>
                        <Button onClick={() => setShowAddTransaction(true)}>
                          Add Your First Transaction
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    transactions.map((transaction) => {
                      const category = categories.find(c => c.id === transaction.categoryId);
                      return (
                        <Card key={transaction.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                                  transaction.type === "income" ? "bg-secondary/10" : "bg-red-100"
                                }`}>
                                  <DollarSign className={`w-6 h-6 ${
                                    transaction.type === "income" ? "text-secondary" : "text-red-600"
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-semibold">{transaction.description || "Transaction"}</p>
                                  <p className="text-sm text-gray-500">
                                    {category?.name || transaction.type} • {new Date(transaction.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-xl font-bold ${
                                  transaction.type === "income" ? "text-secondary" : "text-red-600"
                                }`}>
                                  {transaction.type === "income" ? "+" : "-"}
                                  ${parseFloat(transaction.amount).toLocaleString()}
                                </p>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </TabsContent>

                <TabsContent value="income" className="space-y-3">
                  {transactions.filter(t => t.type === "income").map((transaction) => {
                    const category = categories.find(c => c.id === transaction.categoryId);
                    return (
                      <Card key={transaction.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                                <DollarSign className="w-6 h-6 text-secondary" />
                              </div>
                              <div>
                                <p className="font-semibold">{transaction.description || "Income"}</p>
                                <p className="text-sm text-gray-500">
                                  {category?.name || "Income"} • {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-secondary">
                                +${parseFloat(transaction.amount).toLocaleString()}
                              </p>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="expense" className="space-y-3">
                  {transactions.filter(t => t.type === "expense").map((transaction) => {
                    const category = categories.find(c => c.id === transaction.categoryId);
                    return (
                      <Card key={transaction.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                <DollarSign className="w-6 h-6 text-red-600" />
                              </div>
                              <div>
                                <p className="font-semibold">{transaction.description || "Expense"}</p>
                                <p className="text-sm text-gray-500">
                                  {category?.name || "Expense"} • {new Date(transaction.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-red-600">
                                -${parseFloat(transaction.amount).toLocaleString()}
                              </p>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="m-0">
            <div className="hidden md:block bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-dark">Investments</h1>
                  <p className="text-gray-500 mt-1">Track your investment portfolio</p>
                </div>
                <Button onClick={() => setShowAddInvestment(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Investment
                </Button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Portfolio Summary */}
              <Card className="bg-gradient-to-r from-secondary to-green-600 text-white">
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium mb-2">Total Portfolio Value</h2>
                  <div className="text-3xl font-bold mb-2">
                    ${totalInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Portfolio performance</span>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Holdings */}
              <div className="space-y-4">
                {investments.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500 mb-4">No investments found</p>
                      <Button onClick={() => setShowAddInvestment(true)}>
                        Add Your First Investment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  investments.map((investment) => (
                    <Card key={investment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                              investment.type === "crypto" ? "bg-orange-100" :
                              investment.type === "stock" ? "bg-blue-100" : "bg-purple-100"
                            }`}>
                              <LineChart className={`w-6 h-6 ${
                                investment.type === "crypto" ? "text-orange-500" :
                                investment.type === "stock" ? "text-blue-600" : "text-purple-600"
                              }`} />
                            </div>
                            <div>
                              <p className="font-semibold">{investment.name}</p>
                              <p className="text-sm text-gray-500 capitalize">
                                {investment.type} {investment.symbol && `• ${investment.symbol}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              ${parseFloat(investment.currentValue).toLocaleString()}
                            </p>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="m-0 relative">
            <div className="hidden md:block bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-dark">Categories</h1>
                  <p className="text-gray-500 mt-1">Manage your income and expense categories</p>
                </div>
                <Button onClick={() => setShowAddCategory(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>

            {/* Mobile FAB */}
            <button
              className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-colors"
              onClick={() => setShowAddCategory(true)}
            >
              <Plus className="w-6 h-6" />
            </button>

            <div className="p-4 md:p-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3">
                  {categories.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No categories found. Create categories to organize your transactions.</p>
                        <Button onClick={() => setShowAddCategory(true)}>
                          Create Your First Category
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    categories.map((category) => (
                      <Card key={category.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                style={{ backgroundColor: `${category.color}20` }}
                              >
                                <span style={{ color: category.color }} className="text-xl">
                                  {category.icon === "fas fa-home" ? "🏠" :
                                   category.icon === "fas fa-utensils" ? "🍽️" :
                                   category.icon === "fas fa-car" ? "🚗" :
                                   category.icon === "fas fa-gamepad" ? "🎮" :
                                   category.icon === "fas fa-shopping-cart" ? "🛒" :
                                   category.icon === "fas fa-heartbeat" ? "❤️" :
                                   category.icon === "fas fa-graduation-cap" ? "🎓" :
                                   category.icon === "fas fa-dollar-sign" ? "💰" :
                                   category.icon === "fas fa-briefcase" ? "💼" :
                                   category.icon === "fas fa-gift" ? "🎁" : "📝"}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {category.type} Category
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={category.type === "income" ? "default" : "secondary"}
                                className={category.type === "income" ? "bg-secondary text-white" : "bg-red-100 text-red-700"}
                              >
                                {category.type}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="income" className="space-y-3">
                  {categories.filter(c => c.type === "income").length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No income categories found</p>
                        <Button onClick={() => setShowAddCategory(true)}>
                          Add Income Category
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    categories.filter(c => c.type === "income").map((category) => (
                      <Card key={category.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                                <span className="text-xl">
                                  {category.icon === "fas fa-home" ? "🏠" :
                                   category.icon === "fas fa-utensils" ? "🍽️" :
                                   category.icon === "fas fa-car" ? "🚗" :
                                   category.icon === "fas fa-gamepad" ? "🎮" :
                                   category.icon === "fas fa-shopping-cart" ? "🛒" :
                                   category.icon === "fas fa-heartbeat" ? "❤️" :
                                   category.icon === "fas fa-graduation-cap" ? "🎓" :
                                   category.icon === "fas fa-dollar-sign" ? "💰" :
                                   category.icon === "fas fa-briefcase" ? "💼" :
                                   category.icon === "fas fa-gift" ? "🎁" : "📝"}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-sm text-gray-500">Income Category</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="expense" className="space-y-3">
                  {categories.filter(c => c.type === "expense").length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No expense categories found</p>
                        <Button onClick={() => setShowAddCategory(true)}>
                          Add Expense Category
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    categories.filter(c => c.type === "expense").map((category) => (
                      <Card key={category.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-xl">
                                  {category.icon === "fas fa-home" ? "🏠" :
                                   category.icon === "fas fa-utensils" ? "🍽️" :
                                   category.icon === "fas fa-car" ? "🚗" :
                                   category.icon === "fas fa-gamepad" ? "🎮" :
                                   category.icon === "fas fa-shopping-cart" ? "🛒" :
                                   category.icon === "fas fa-heartbeat" ? "❤️" :
                                   category.icon === "fas fa-graduation-cap" ? "🎓" :
                                   category.icon === "fas fa-dollar-sign" ? "💰" :
                                   category.icon === "fas fa-briefcase" ? "💼" :
                                   category.icon === "fas fa-gift" ? "🎁" : "📝"}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-sm text-gray-500">Expense Category</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="m-0">
            <div className="hidden md:block bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-dark">Goals</h1>
                  <p className="text-gray-500 mt-1">Set and track your financial goals</p>
                </div>
                <Button onClick={() => setShowAddGoal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {goals.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">No goals set yet</p>
                    <Button onClick={() => setShowAddGoal(true)}>
                      Set Your First Goal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                goals.map((goal) => {
                  const category = categories.find(c => c.id === goal.categoryId);
                  const categoryTransactions = transactions.filter(
                    t => t.categoryId === goal.categoryId && t.type === "expense"
                  );
                  const spent = categoryTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
                  const limit = parseFloat(goal.limitAmount);
                  const percentage = (spent / limit) * 100;
                  const isOverBudget = spent > limit;

                  return (
                    <Card key={goal.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{category?.name || "Category"}</h3>
                            <p className="text-sm text-gray-500">Monthly budget limit</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              ${spent.toLocaleString()} / ${limit.toLocaleString()}
                            </p>
                            <p className={`text-sm ${isOverBudget ? "text-red-600" : "text-secondary"}`}>
                              {percentage.toFixed(1)}% {isOverBudget ? "over budget!" : "used"}
                            </p>
                          </div>
                        </div>
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="mb-2"
                        />
                        <p className={`text-sm ${isOverBudget ? "text-red-600" : "text-gray-600"}`}>
                          {isOverBudget 
                            ? `$${(spent - limit).toLocaleString()} over budget this month`
                            : `$${(limit - spent).toLocaleString()} left for this month`
                          }
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="m-0">
            <div className="hidden md:block bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-dark">Reports</h1>
                  <p className="text-gray-500 mt-1">Analyze your financial data</p>
                </div>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Time Period Selector */}
              <Tabs defaultValue="month">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                  <TabsTrigger value="year">This Year</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Income</p>
                        <p className="text-2xl font-bold text-secondary">
                          ${totalIncome.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-secondary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600">
                          ${totalExpenses.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Net Savings</p>
                        <p className="text-2xl font-bold text-primary">
                          ${(totalIncome - totalExpenses).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IncomeExpenseChart transactions={transactions} />
                <ExpensePieChart transactions={transactions} categories={categories} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button (Mobile) */}
      <Button
        className="md:hidden fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg z-40"
        onClick={() => setShowAddTransaction(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Modals */}
      <AddTransactionModal
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        categories={categories}
      />
      <AddCategoryModal
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
      />
      <AddInvestmentModal
        open={showAddInvestment}
        onOpenChange={setShowAddInvestment}
      />
      <AddGoalModal
        open={showAddGoal}
        onOpenChange={setShowAddGoal}
        categories={categories}
      />
    </div>
  );
}
