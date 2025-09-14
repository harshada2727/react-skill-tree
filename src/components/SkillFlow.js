import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import SkillNode from './SkillNode';

const nodeTypes = { skillNode: SkillNode };

export default function SkillFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  highlightedIds,
}) {
  return (
    <div style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          data: { ...n.data, highlighted: highlightedIds.has(n.id) },
        }))}
        edges={edges.map((e) => ({
          ...e,
          style: {
            ...e.style,
            stroke:
              highlightedIds.has(e.source) && highlightedIds.has(e.target)
                ? 'red'
                : '#222',
            strokeWidth:
              highlightedIds.has(e.source) && highlightedIds.has(e.target)
                ? 3
                : 2,
          },
        }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
