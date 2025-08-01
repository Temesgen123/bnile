'use client';

import ProductPrice from '@/components/shared/product/product-price';
import { Card, CardContent } from '@/components/ui/card';

import useColorStore from '@/hooks/use-color-store';
import { formatDateTime } from '@/lib/utils';
import { useTheme } from 'next-themes';

import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomToolTip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardContent className="p-2">
          <p>{label && formatDateTime(new Date(label)).dateOnly}</p>
          <p className="text-primary text-xl ">
            <ProductPrice price={payload[0].value} plain />
          </p>
        </CardContent>
      </Card>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <text x={x} y={y + 10} textAnchor="left" fill="#888" className="text-sm">
      {formatDateTime(new Date(payload.value)).dateOnly}
    </text>
  );
};

const STROKE_COLORS: { [key: string]: { [key: string]: string } } = {
  Red: { light: '#980404', dark: '#ff3333' },
  Green: { light: '#015001', dark: '#06dc06' },
  Gold: { light: '#ac9103', dark: '#f1d541' },
  Blue: { light: '#1E3A8A', dark: '#60A5FA' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SalesAreaChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const { cssColors, color } = useColorStore(theme);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid horizontal={true} vertical={false} stroke="" />
        <XAxis dataKey="date" tick={<CustomXAxisTick />} interval={3} />
        <YAxis fontSize={12} tickFormatter={(value: number) => `$${value}`} />
        <Tooltip content={<CustomToolTip />} />
        <Area
          type="monotone"
          dataKey="totalSales"
          stroke={STROKE_COLORS[color.name][theme || 'light']}
          strokeWidth={2}
          fill={`${cssColors['--primary']}`}
          fillOpacity={0.8}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
