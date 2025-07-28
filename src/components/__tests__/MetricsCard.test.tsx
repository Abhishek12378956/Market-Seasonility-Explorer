import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsCard } from '../Dashboard/MetricsCard';

describe('MetricsCard', () => {
  it('should render price metric correctly', () => {
    render(
      <MetricsCard
        title="Close Price"
        value="$51,000"
        change={2.5}
        type="price"
      />
    );

    expect(screen.getByText('Close Price')).toBeInTheDocument();
    expect(screen.getByText('$51,000')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toBeInTheDocument();
  });

  it('should render volume metric without change', () => {
    render(
      <MetricsCard
        title="Volume"
        value="150.5M"
        type="volume"
      />
    );

    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('150.5M')).toBeInTheDocument();
  });

  it('should show negative change in red', () => {
    render(
      <MetricsCard
        title="Performance"
        value="-3.2%"
        change={-3.2}
        type="performance"
      />
    );

    const changeElement = screen.getByText('-3.20%');
    expect(changeElement).toHaveClass('text-red-400');
  });

  it('should show positive change in green', () => {
    render(
      <MetricsCard
        title="Performance"
        value="+5.8%"
        change={5.8}
        type="performance"
      />
    );

    const changeElement = screen.getByText('+5.80%');
    expect(changeElement).toHaveClass('text-green-400');
  });

  it('should render volatility metric correctly', () => {
    render(
      <MetricsCard
        title="Volatility"
        value="7.2%"
        type="volatility"
      />
    );

    expect(screen.getByText('Volatility')).toBeInTheDocument();
    expect(screen.getByText('7.2%')).toBeInTheDocument();
  });
});