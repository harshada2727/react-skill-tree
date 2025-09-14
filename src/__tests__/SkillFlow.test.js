import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillFlow from '../components/SkillFlow';

// --- Mock ReactFlow and children so we can inspect props ---
const mockReactFlow = jest.fn(
  ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) => (
    <div data-testid="reactflow-mock">
      {/* Provide buttons to trigger callbacks */}
      <button onClick={() => onNodesChange && onNodesChange([{ id: 'n1' }])}>
        nodesChange
      </button>
      <button onClick={() => onEdgesChange && onEdgesChange([{ id: 'e1' }])}>
        edgesChange
      </button>
      <button onClick={() => onConnect && onConnect({ id: 'c1' })}>
        connect
      </button>

      <div data-testid="nodes-prop">{JSON.stringify(nodes)}</div>
      <div data-testid="edges-prop">{JSON.stringify(edges)}</div>
    </div>
  )
);

jest.mock('reactflow', () => {
  return {
    __esModule: true,
    default: (props) => mockReactFlow(props),
    Background: () => <div data-testid="background" />,
    Controls: () => <div data-testid="controls" />,
    MiniMap: () => <div data-testid="minimap" />,
  };
});

describe('SkillFlow component', () => {
  const baseNodes = [
    { id: '1', data: { label: 'A' }, position: { x: 0, y: 0 } },
    { id: '2', data: { label: 'B' }, position: { x: 10, y: 10 } },
  ];

  const baseEdges = [{ id: 'e1', source: '1', target: '2', style: {} }];

  const highlightedIds = new Set(['1', '2']);

  const handlers = {
    onNodesChange: jest.fn(),
    onEdgesChange: jest.fn(),
    onConnect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds highlighted flag to nodes whose id is in highlightedIds', () => {
    render(
      <SkillFlow
        nodes={baseNodes}
        edges={baseEdges}
        highlightedIds={highlightedIds}
        {...handlers}
      />
    );
    const nodesProp = JSON.parse(screen.getByTestId('nodes-prop').textContent);
    expect(nodesProp.find((n) => n.id === '1').data.highlighted).toBe(true);
    expect(nodesProp.find((n) => n.id === '2').data.highlighted).toBe(true);
  });

  it('styles edges red & width 3 only when both ends highlighted', () => {
    render(
      <SkillFlow
        nodes={baseNodes}
        edges={baseEdges}
        highlightedIds={highlightedIds}
        {...handlers}
      />
    );
    const edgesProp = JSON.parse(screen.getByTestId('edges-prop').textContent);
    const e = edgesProp[0];
    expect(e.style.stroke).toBe('red');
    expect(e.style.strokeWidth).toBe(3);
  });

  it('styles edges default when not both ends highlighted', () => {
    const ids = new Set(['1']); // only one end highlighted
    render(
      <SkillFlow
        nodes={baseNodes}
        edges={baseEdges}
        highlightedIds={ids}
        {...handlers}
      />
    );
    const e = JSON.parse(screen.getByTestId('edges-prop').textContent)[0];
    expect(e.style.stroke).toBe('#222');
    expect(e.style.strokeWidth).toBe(2);
  });

  it('passes and triggers callbacks onNodesChange, onEdgesChange, onConnect', () => {
    render(
      <SkillFlow
        nodes={baseNodes}
        edges={baseEdges}
        highlightedIds={new Set()}
        {...handlers}
      />
    );
    fireEvent.click(screen.getByText('nodesChange'));
    fireEvent.click(screen.getByText('edgesChange'));
    fireEvent.click(screen.getByText('connect'));
    expect(handlers.onNodesChange).toHaveBeenCalledWith([{ id: 'n1' }]);
    expect(handlers.onEdgesChange).toHaveBeenCalledWith([{ id: 'e1' }]);
    expect(handlers.onConnect).toHaveBeenCalledWith({ id: 'c1' });
  });
});
