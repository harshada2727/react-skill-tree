import React, { useState, useCallback, useEffect } from 'react';
import { addEdge, useEdgesState, useNodesState } from 'reactflow';
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import 'reactflow/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

import Sidebar from './components/Sidebar';
import SkillFlow from './components/SkillFlow';
import { createsCycle } from './utils/graphUtils';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [highlightedIds, setHighlightedIds] = useState(new Set());

  // Unlock node
  const unlockNode = useCallback(
    (id) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, unlocked: true } } : n
        )
      );
      toast.success('Skill unlocked!');
    },
    [setNodes]
  );
  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('skillTree');
    if (!saved) return;

    try {
      const { nodes: savedNodes = [], edges: savedEdges = [] } =
        JSON.parse(saved);

      // Recompute canUnlock based on prerequisites
      const rehydratedNodes = savedNodes.map((n) => {
        const prereqs = savedEdges
          .filter((e) => e.target === n.id)
          .map((e) => e.source);
        const prereqsUnlocked = prereqs.every(
          (id) => savedNodes.find((x) => x.id === id)?.data?.unlocked
        );
        return {
          ...n,
          data: {
            ...n.data,
            onUnlock: () => unlockNode(n.id),
            canUnlock: prereqs.length === 0 ? true : prereqsUnlocked,
          },
        };
      });

      setNodes(rehydratedNodes);
      setEdges(savedEdges);
      toast.info('Skill tree loaded from local storage!');
    } catch (err) {
      console.error('Failed to parse saved data', err);
    }
  }, [unlockNode, setNodes, setEdges]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('skillTree', JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  // Add new skill node
  const addSkill = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error('Name and Description are required');
      return;
    }

    const newNode = {
      id: nanoid(),
      type: 'skillNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: name,
        description,
        cost: cost !== '' ? Number(cost) : undefined,
        level: level !== '' ? Number(level) : undefined,
        unlocked: false,
        canUnlock: true,
        highlighted: false,
      },
    };

    newNode.data.onUnlock = () => unlockNode(newNode.id);

    setNodes((nds) => [...nds, newNode]);
    setName('');
    setDescription('');
    setCost('');
    setLevel('');
    toast.success('New skill added!');
  };

  // Connect edges + prevent cycles
  const onConnect = useCallback(
    (params) => {
      if (createsCycle(params.source, params.target, edges)) {
        toast.error('Cannot create cycle (circular dependency).');
        return;
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: 'arrowclosed' },
            style: { strokeWidth: 2 },
          },
          eds
        )
      );

      setNodes((nds) =>
        nds.map((n) =>
          n.id === params.target
            ? { ...n, data: { ...n.data, canUnlock: false } }
            : n
        )
      );
      toast.info('Connection created');
    },
    [edges, setNodes, setEdges]
  );

  // Update unlock availability
  useEffect(() => {
    setNodes((nds) => {
      let changed = false;
      const updated = nds.map((n) => {
        const prereqs = edges
          .filter((e) => e.target === n.id)
          .map((e) => e.source);
        const prereqsUnlocked = prereqs.every(
          (id) => nds.find((x) => x.id === id)?.data.unlocked
        );
        const canUnlock = prereqs.length === 0 ? true : prereqsUnlocked;

        if (n.data.canUnlock !== canUnlock) {
          changed = true;
          return { ...n, data: { ...n.data, canUnlock } };
        }
        return n;
      });
      return changed ? updated : nds;
    });
  }, [edges, nodes, setNodes]);

  // Optimized BFS Search
  useEffect(() => {
    if (!search.trim()) {
      setHighlightedIds(new Set());
      return;
    }

    const lowerSearch = search.toLowerCase();
    const matchingIds = nodes
      .filter((n) => n.data.label.toLowerCase().includes(lowerSearch))
      .map((n) => n.id);

    const related = new Set(matchingIds);
    const queue = [...matchingIds];

    while (queue.length) {
      const id = queue.shift();
      edges.forEach((e) => {
        const neighbors = [];
        if (e.source === id && !related.has(e.target)) neighbors.push(e.target);
        if (e.target === id && !related.has(e.source)) neighbors.push(e.source);
        neighbors.forEach((nid) => {
          related.add(nid);
          queue.push(nid);
        });
      });
    }

    setHighlightedIds(related);
  }, [search, nodes, edges]);

  // Clear localStorage
  const clearStorage = () => {
    localStorage.removeItem('skillTree');
    setNodes([]);
    setEdges([]);
    toast.info('Local storage cleared');
  };

  return (
    <div className="app-container">
      <Sidebar
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        cost={cost}
        setCost={setCost}
        level={level}
        setLevel={setLevel}
        search={search}
        setSearch={setSearch}
        addSkill={addSkill}
        clearStorage={clearStorage}
      />

      <SkillFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        highlightedIds={highlightedIds}
      />

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
