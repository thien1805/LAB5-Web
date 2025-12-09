/**
 * EXERCISE 2.1: The Laggy List (useMemo & React.memo)
 * 
 * Understanding: Learn how to optimize rendering performance by memoizing
 * expensive computations and preventing unnecessary re-renders.
 * 
 * Requirements:
 * - Create a large list of items (1000+)
 * - Use useMemo to avoid recalculating filtered/sorted lists
 * - Use React.memo to prevent child re-renders
 * - Demonstrate performance difference with/without optimization
 */

import React, { useState, useMemo, memo } from 'react';

// WITHOUT OPTIMIZATION (Commented for reference)
// This component rerenders every parent update
// function ListItemUnoptimized({ item, onDelete }) {
//   console.log('Rendering:', item.id); // This logs excessively!
//   return (
//     <div style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
//       <span>{item.id}: {item.name}</span>
//       <button onClick={() => onDelete(item.id)}>Delete</button>
//     </div>
//   );
// }

// WITH OPTIMIZATION: React.memo prevents re-renders when props don't change
const ListItem = memo(function ListItem({ item, onDelete }) {
  console.log('Rendering item:', item.id); // Now only logs when this item's props change
  
  return (
    <div style={{ padding: '8px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
      <span>{item.id}: {item.name} (Score: {item.score})</span>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});

/**
 * Helper: Generate mock data
 */
function generateMockItems(count = 1000) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    score: Math.floor(Math.random() * 100),
    category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  }));
}

/**
 * Main Component: LaggyList with Optimization
 */
export function LaggyList() {
  const [items, setItems] = useState(() => generateMockItems(500));
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [renderCount, setRenderCount] = useState(0);

  // WITHOUT useMemo: This would be recalculated on every parent render!
  // const filteredAndSorted = items
  //   .filter(item => {
  //     const matchesText = item.name.includes(filterText);
  //     const matchesCategory = !filterCategory || item.category === filterCategory;
  //     return matchesText && matchesCategory;
  //   })
  //   .sort((a, b) => {
  //     if (sortBy === 'id') return a.id - b.id;
  //     if (sortBy === 'name') return a.name.localeCompare(b.name);
  //     if (sortBy === 'score') return b.score - a.score;
  //     return 0;
  //   });

  // WITH useMemo: Only recalculate when dependencies change
  const filteredAndSorted = useMemo(() => {
    console.log('Recalculating filtered list...');
    
    const filtered = items
      .filter(item => {
        const matchesText = item.name.toLowerCase().includes(filterText.toLowerCase());
        const matchesCategory = !filterCategory || item.category === filterCategory;
        return matchesText && matchesCategory;
      });

    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'score') return b.score - a.score;
      return 0;
    });

    return sorted;
  }, [items, filterText, filterCategory, sortBy]);

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const stats = useMemo(() => ({
    total: items.length,
    filtered: filteredAndSorted.length,
    avgScore: Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length),
    categories: [...new Set(items.map(item => item.category))]
  }), [items, filteredAndSorted]);

  return (
    <div style={{ padding: '20px', border: '1px solid blue', maxHeight: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <h3>Exercise 2.1: The Laggy List (Optimized)</h3>

      <div style={{ marginBottom: '10px' }}>
        <p>Total Items: {stats.total} | Filtered: {stats.filtered} | Avg Score: {stats.avgScore}</p>
        <p>Categories: {stats.categories.join(', ')}</p>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="A">Category A</option>
          <option value="B">Category B</option>
          <option value="C">Category C</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="score">Sort by Score</option>
        </select>

        <button onClick={() => setRenderCount(renderCount + 1)}>
          Force Rerender ({renderCount})
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
        {filteredAndSorted.map(item => (
          <ListItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

/**
 * Comparison Component: Before and After
 */
export function Exercise21Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>Exercise 2.1: The Laggy List (useMemo & React.memo)</h2>
      <p>✅ Open browser console to see optimization in action. With memo, items only log when their props change!</p>
      <LaggyList />
    </div>
  );
}
