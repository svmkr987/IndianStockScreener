import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import type { HistoryData } from "../types";

interface Props {
  symbol: string;
  data: HistoryData[];
}

export function PriceChart({ symbol, data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-yellow-600 p-4">No price history available for {symbol}</div>;
  }

  // Calculate 50 day and 200 day SMA if possible
  const chartData = data.map((d, index) => {
    let sma50 = null;
    let sma200 = null;

    if (index >= 49) {
      const slice50 = data.slice(index - 49, index + 1);
      sma50 = slice50.reduce((sum, val) => sum + val.close, 0) / 50;
    }
    
    if (index >= 199) {
      const slice200 = data.slice(index - 199, index + 1);
      sma200 = slice200.reduce((sum, val) => sum + val.close, 0) / 200;
    }

    return {
      date: format(new Date(d.date), "MMM d, yyyy"),
      shortDate: format(new Date(d.date), "MMM d"),
      Price: d.close.toFixed(2),
      SMA50: sma50 ? sma50.toFixed(2) : null,
      SMA200: sma200 ? sma200.toFixed(2) : null,
    };
  });

  return (
    <div className="w-full h-96 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="shortDate" 
            minTickGap={30} 
            stroke="#666" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            domain={["auto", "auto"]} 
            stroke="#666" 
            tick={{ fontSize: 12 }}
            tickFormatter={(val) => `₹${val}`} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "1px solid #ccc" }}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="Price"
            stroke="#1f77b4"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="SMA50"
            stroke="#ff7f0e"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="SMA200"
            stroke="#2ca02c"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
