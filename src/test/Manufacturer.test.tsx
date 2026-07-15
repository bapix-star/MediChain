import { render, screen } from '@testing-library/react';
import ManufacturerDashboard from '../app/manufacturer/page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/manufacturer',
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

vi.mock('@/actions/batch', () => ({
  createBatch: vi.fn(),
}));

describe('Manufacturer Dashboard', () => {
  it('renders the registry dashboard heading', () => {
    render(<ManufacturerDashboard />);
    expect(screen.getByText('Registry & Minting')).toBeInTheDocument();
  });

  it('renders the minting form fields', () => {
    render(<ManufacturerDashboard />);
    expect(screen.getByText('BATCH NUMBER')).toBeInTheDocument();
    expect(screen.getByText('MEDICINE NAME')).toBeInTheDocument();
    expect(screen.getByText('COMPOSITION (ACTIVE INGREDIENTS)')).toBeInTheDocument();
    expect(screen.getByText('QUANTITY (UNITS)')).toBeInTheDocument();
  });

  it('renders the create batch button', () => {
    render(<ManufacturerDashboard />);
    expect(screen.getByText('Create & Mint Batch')).toBeInTheDocument();
  });
});
