import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/store/useWalletStore', () => ({
  useWalletStore: () => ({
    address: null,
    isConnected: false,
    connect: vi.fn(),
  })
}));

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(screen.getAllByText('MediChain')[0]).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<Home />);
    expect(screen.getByText(/Immutable, real-time tracking for pharmaceutical supply chains/i)).toBeInTheDocument();
  });

  it('renders the call to action buttons', () => {
    render(<Home />);
    expect(screen.getByText(/Manufacturer Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Logistics Portal/i)).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<Home />);
    expect(screen.getByText('Global Real-Time Tracking')).toBeInTheDocument();
    expect(screen.getByText('Automated Compliance')).toBeInTheDocument();
    expect(screen.getByText('Anti-Counterfeit')).toBeInTheDocument();
  });
});
