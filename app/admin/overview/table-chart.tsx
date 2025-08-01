'use client';

import { getMonthName } from '@/lib/utils';

import Image from 'next/image';
import Link from 'next/link';

import React from 'react';
import ProductPrice from '@/components/shared/product/product-price';

type TableChartProps = {
  labelType: 'month' | 'product';
  data: {
    label: string;
    image?: string;
    value: number;
    id?: string;
  }[];
};

interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const boundedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="relative w-full h-4 overflow-hidden">
      <div
        className="bg-primary h-full transition-all  duration-300 rounded-lg"
        style={{ width: `${boundedValue}%`, float: 'right' }}
      />
    </div>
  );
};

export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  const max = Math.max(...data.map((item) => item.value));
  const dataWithPercentage = data.map((x) => ({
    ...x,
    label: labelType === 'month' ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
  }));
  return (
    <div className="space-y-3">
      {dataWithPercentage.map(({ label, id, value, image, percentage }) => (
        <div
          key={id + label + value}
          className="grid grid-cols-[100px_1fr_80px] md:grid-cols-[250px_1fr_80px] gap-2 space-y-4"
        >
          {image ? (
            <Link className="flex items-end" href={`/admin/products/${id}`}>
              <Image
                className="rounded border aspect-square object-scale-down max-w-full h-auto mx-auto mr-1"
                src={image!}
                alt={label}
                width={36}
                height={36}
              />
              <p className="text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {label}
              </p>
            </Link>
          ) : (
            <div className="flex item-end text-sm">{label}</div>
          )}
          <ProgressBar value={percentage} />
          <div className="text-sm text-right flex items-center">
            <ProductPrice price={value} plain />
          </div>
        </div>
      ))}
    </div>
  );
}
