import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketChartProps {
  data?: {
    revenueProjections: {
      year: number;
      revenue: number;
    }[];
  };
}

export default function MarketChart({ data }: MarketChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data?.revenueProjections || []}> {/* Handle potential undefined data */}
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}