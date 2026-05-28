'use client';

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatNumber } from '@/shared/lib/format';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsDoughnutChartProps {
  labels: string[];
  values: number[];
  colors: string[];
}

export function StatsDoughnutChart({
  labels,
  values,
  colors,
}: StatsDoughnutChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        label: '거래 수',
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]!),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    animation: { duration: 280 },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, boxWidth: 10, boxHeight: 10, color: '#4F4F51' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatNumber(ctx.parsed)} 건`,
        },
      },
    },
  };

  return <Doughnut data={chartData} options={chartOptions} />;
}
