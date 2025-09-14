import React from 'react';
import { Handle, Position } from 'reactflow';
import { toast } from 'react-toastify';
import '../styles.css';

export default function SkillNode({ data }) {
  const handleClick = () => {
    if (data.unlocked) return;
    if (data.canUnlock) {
      data.onUnlock();
    } else {
      toast.warn('Cannot unlock: prerequisites not met.');
    }
  };

  const classes = [
    'skill-node',
    data.highlighted ? 'highlighted' : data.unlocked ? 'unlocked' : 'locked',
    !data.unlocked ? 'clickable' : '',
  ].join(' ');

  return (
    <div onClick={handleClick} className={classes}>
      <Handle type="target" position={Position.Top} />
      <strong>{data.label}</strong>
      <p className="desc">{data.description}</p>
      {data.cost && <p className="meta">Cost: {data.cost}</p>}
      {data.level && <p className="meta">Level: {data.level}</p>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
