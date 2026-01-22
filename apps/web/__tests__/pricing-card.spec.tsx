import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { PricingCard } from '@/components/agent/PricingCard';

const options = [
  {
    id: 'payg',
    name: 'Pay-as-you-go',
    price: '0.45',
    unit: 'USDT / call',
    description: 'No minimum commitment.',
  },
  {
    id: 'monthly',
    name: 'Monthly Bundle',
    price: '199',
    unit: 'USDT / month',
    description: 'Includes 100k calls.',
  },
];

describe('PricingCard', () => {
  it('selects an option and triggers purchase', () => {
    const onSelect = vi.fn();
    const onPurchase = vi.fn();

    render(
      <PricingCard options={options} selectedId="payg" onSelect={onSelect} onPurchase={onPurchase} />
    );

    fireEvent.click(screen.getByText('Monthly Bundle'));
    fireEvent.click(screen.getByRole('button', { name: /lease agent/i }));

    expect(onSelect).toHaveBeenCalledWith('monthly');
    expect(onPurchase).toHaveBeenCalled();
  });
});
