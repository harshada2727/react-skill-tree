import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillNode from '../components/SkillNode';

// Mock reactflow Handle to avoid rendering errors
jest.mock('reactflow', () => ({
  Handle: () => <div data-testid="handle" />,
  Position: { Top: 'top', Bottom: 'bottom' },
}));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: { warn: jest.fn() },
}));

describe('SkillNode', () => {
  const baseData = {
    label: 'React',
    description: 'Library',
    cost: 5,
    level: 2,
    unlocked: false,
    highlighted: false,
    canUnlock: false,
    onUnlock: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label, description, cost, level and two handles', () => {
    render(<SkillNode data={baseData} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText(/Cost: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Level: 2/)).toBeInTheDocument();
    // two handles (top and bottom)
    expect(screen.getAllByTestId('handle')).toHaveLength(2);
  });

  it('does not render cost/level when not provided', () => {
    const d = { ...baseData, cost: null, level: null };
    render(<SkillNode data={d} />);
    expect(screen.queryByText(/Cost:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Level:/)).not.toBeInTheDocument();
  });

  it('has correct classes for highlighted', () => {
    const d = { ...baseData, highlighted: true };
    render(<SkillNode data={d} />);
    const container = screen.getByText('React').closest('div');
    expect(container).toHaveClass('highlighted');
  });

  it('has correct classes for unlocked', () => {
    const d = { ...baseData, unlocked: true };
    render(<SkillNode data={d} />);
    const container = screen.getByText('React').closest('div');
    expect(container).toHaveClass('unlocked');
    expect(container).not.toHaveClass('clickable');
  });

  it('calls onUnlock when canUnlock and not unlocked', () => {
    const d = { ...baseData, canUnlock: true };
    render(<SkillNode data={d} />);
    fireEvent.click(screen.getByText('React'));
    expect(d.onUnlock).toHaveBeenCalled();
  });

  it('does nothing when already unlocked', () => {
    const d = { ...baseData, unlocked: true };
    render(<SkillNode data={d} />);
    fireEvent.click(screen.getByText('React'));
    expect(d.onUnlock).not.toHaveBeenCalled();
  });

  it('shows toast warning when cannot unlock', () => {
    const { toast } = require('react-toastify');
    render(<SkillNode data={baseData} />);
    fireEvent.click(screen.getByText('React'));
    expect(toast.warn).toHaveBeenCalledWith(
      'Cannot unlock: prerequisites not met.'
    );
  });
});
