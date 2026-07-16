"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', transactions: 150, avgTime: 2.1 },
  { time: '04:00', transactions: 300, avgTime: 2.2 },
  { time: '08:00', transactions: 550, avgTime: 2.0 },
  { time: '12:00', transactions: 1200, avgTime: 2.4 },
  { time: '16:00', transactions: 1800, avgTime: 2.1 },
  { time: '20:00', transactions: 2400, avgTime: 1.9 },
  { time: '24:00', transactions: 2800, avgTime: 2.1 },
];

export function NetworkChart() {
  return (
    <div className="w-full h-48 mt-8 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-4 pb-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0c63e7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0c63e7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            tick={{fontSize: 10, fill: '#737373'}} 
            axisLine={false} 
            tickLine={false} 
            dy={5}
          />
          <YAxis 
            tick={{fontSize: 10, fill: '#737373'}} 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1E1E1E', 
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#0c63e7' }}
          />
          <Area 
            type="monotone" 
            dataKey="transactions" 
            stroke="#0c63e7" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTransactions)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
