import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './RevenueChart.module.css';

// Mock revenue data for 6 months
const REVENUE_DATA = [
  { month: 'Tháng 3', revenue: 2800 },
  { month: 'Tháng 4', revenue: 3200 },
  { month: 'Tháng 5', revenue: 3900 },
  { month: 'Tháng 6', revenue: 4100 },
  { month: 'Tháng 7', revenue: 4300 },
  { month: 'Tháng 8', revenue: 4500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipBox}>
        <div className={styles.tooltipMonth}>{label}</div>
        <div className={styles.tooltipValue}>
          Doanh thu: ${payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div className={styles.titleGroup}>
          <h3 className={styles.chartTitle}>Biểu đồ Doanh thu (6 tháng gần nhất)</h3>
          <p className={styles.chartSubtitle}>
            Thống kê tổng thu nhập thực tế của giảng viên trên EduSphere Academy
          </p>
        </div>
        <div className={styles.totalBadge}>Tổng: $22,800</div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={REVENUE_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 5, fill: '#7c3aed', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 7, fill: '#6d28d9', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
