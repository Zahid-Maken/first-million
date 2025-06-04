import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import type { Investment } from "@shared/schema";

interface InvestmentChartProps {
  investments: Investment[];
}

export default function InvestmentChart({ investments }: InvestmentChartProps) {
  const totalValue = investments.reduce((sum, inv) => sum + parseFloat(inv.currentValue), 0);
  
  // Generate mock historical data for demonstration
  // In a real app, this would come from the database
  const generateHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const baseValue = totalValue * (0.7 + (index * 0.05)); // Simulate growth
      const data: any = { month };
      
      investments.forEach((investment, invIndex) => {
        const invValue = parseFloat(investment.currentValue);
        const historicalValue = invValue * (0.7 + (index * 0.05));
        data[investment.name] = historicalValue;
      });
      
      return data;
    });
  };

  const chartData = generateHistoricalData();
  const colors = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];

  if (investments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Investment Portfolio</CardTitle>
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary">$0.00</p>
              <p className="text-sm text-gray-500">No investments yet</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">Add investments to see portfolio growth</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Investment Portfolio</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-secondary">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center text-sm text-secondary">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Portfolio growth</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend />
            {investments.map((investment, index) => (
              <Line
                key={investment.id}
                type="monotone"
                dataKey={investment.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
