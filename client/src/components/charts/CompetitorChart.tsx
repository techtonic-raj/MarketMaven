import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface CompetitorData {
  name: string;
  marketShare: number;
  stockPrice?: number;
}

interface CompetitorChartProps {
  data?: CompetitorData[];
}

export default function CompetitorChart({ data }: CompetitorChartProps) {
  const chartData = data || [];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="marketShare"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}