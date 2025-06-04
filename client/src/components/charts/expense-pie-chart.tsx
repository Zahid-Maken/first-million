import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Transaction, Category } from "@shared/schema";

interface ExpensePieChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function ExpensePieChart({ transactions, categories }: ExpensePieChartProps) {
  const expenseTransactions = transactions.filter(t => t.type === "expense");
  
  const expenseData = categories
    .filter(c => c.type === "expense")
    .map(category => {
      const categoryTransactions = expenseTransactions.filter(t => t.categoryId === category.id);
      const total = categoryTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      return {
        name: category.name,
        value: total,
        color: category.color,
      };
    })
    .filter(item => item.value > 0);

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  if (expenseData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                `${((value / totalExpenses) * 100).toFixed(1)}%`
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {expenseData.slice(0, 4).map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>
                {item.name}: ${item.value.toLocaleString()} 
                ({((item.value / totalExpenses) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
