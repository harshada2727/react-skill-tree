import React from 'react';
import '../styles.css';

export default function Sidebar({
  name,
  setName,
  description,
  setDescription,
  cost,
  setCost,
  level,
  setLevel,
  search,
  setSearch,
  addSkill,
  clearStorage,
}) {
  return (
    <div className="sidebar">
      <h3>Add Skill</h3>
      <form onSubmit={addSkill}>
        <input
          aria-label="Skill name"
          placeholder="Skill name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          aria-label="Skill description"
          placeholder="Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          aria-label="Skill cost"
          type="number"
          placeholder="Cost (optional)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <input
          aria-label="Skill level"
          type="number"
          placeholder="Level (optional)"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        <button type="submit" disabled={!name.trim() || !description.trim()}>
          Add Node
        </button>
      </form>

      <h3>Search</h3>
      <input
        aria-label="Search skill"
        placeholder="Search skill"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={clearStorage} className="secondary">
        Clear Storage
      </button>
    </div>
  );
}
