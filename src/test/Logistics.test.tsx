import { render, screen } from '@testing-library/react';
import LogisticsDashboard from '../app/logistics/page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/logistics',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/store/useWalletStore', () => ({
  useWalletStore: () => ({
    address: 'GAUTVVOM...Z2JO6J',
    isConnected: true,
    connect: vi.fn(),
  })
}));

vi.mock('@/actions/scan', () => ({
  processScan: vi.fn(),
}));

describe('Logistics Dashboard', () => {
  it('renders the logistics dashboard heading', () => {
    render(<LogisticsDashboard />);
    expect(screen.getByText(/LOGISTICS & SCANNING/i)).toBeInTheDocument();
  });

  it('renders the scan item form', () => {
    render(<LogisticsDashboard />);
    expect(screen.getByText(/ITEM ID \(FROM QR\)/i)).toBeInTheDocument();
    expect(screen.getByText(/SCANNER LOCATION/i)).toBeInTheDocument();
  });
});
