import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

interface SentimentChartProps {
  data?: {
    overallSentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
}

export default function SentimentChart({ data }: SentimentChartProps) {
  const chartData = data ? [
    { name: 'Positive', value: data.overallSentiment.positive },
    { name: 'Neutral', value: data.overallSentiment.neutral },
    { name: 'Negative', value: data.overallSentiment.negative },
  ] : [];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}