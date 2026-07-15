import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../app/page';
import LogisticsDashboard from '../app/logistics/page';
import { describe, it, expect, vi } from 'vitest';
import { useWalletStore } from '../store/useWalletStore';

// Mock the dependencies
vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/logistics',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/actions/scan', () => ({
  processScan: vi.fn(),
}));

let mockWalletState = { address: null as string | null, isConnected: false };

vi.mock('@/store/useWalletStore', () => ({
  useWalletStore: Object.assign(
    (selector: any) => selector ? selector(mockWalletState) : mockWalletState,
    {
      setState: (newState: any) => { mockWalletState = { ...mockWalletState, ...newState }; },
      getState: () => mockWalletState,
    }
  )
}));

describe('App Integration Flow', () => {
  it('shows wallet required state when disconnected, then shows dashboard when connected', async () => {
    // 1. Initial State: Disconnected
    mockWalletState = { address: null, isConnected: false };
    
    const { unmount } = render(<LogisticsDashboard />);
    expect(screen.getAllByText('Connect Wallet')[0]).toBeInTheDocument();
    
    // 2. Simulate Wallet Connection
    mockWalletState = { address: 'GAUTVVOM...Z2JO6J', isConnected: true };
    
    // Re-render to pick up new state
    unmount();
    render(<LogisticsDashboard />);
    
    // 3. Final State: Connected Dashboard
    await waitFor(() => {
      expect(screen.getByText(/LOGISTICS & SCANNING/i)).toBeInTheDocument();
      expect(screen.getByText(/ITEM ID \(FROM QR\)/i)).toBeInTheDocument();
    });
  });
});
