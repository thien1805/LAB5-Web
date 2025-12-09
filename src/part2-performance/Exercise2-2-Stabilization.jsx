/**
 * EXERCISE 2.2: Stabilization (useCallback)
 * 
 * Understanding: Learn how useCallback prevents unnecessary re-renders by
 * memoizing function references. This is especially important when passing
 * callbacks to optimized child components.
 * 
 * Requirements:
 * - Create parent component that passes callbacks to children
 * - Show performance improvement with useCallback
 * - Demonstrate when useCallback is necessary
 */

import React, { useState, useCallback, memo } from 'react';

/**
 * Child Component: SearchFilter (optimized with React.memo)
 * Without useCallback in parent, this would re-render every time parent updates
 */
const SearchFilter = memo(function SearchFilter({ onSearch, placeholder, value }) {
  console.log('SearchFilter rendering...');
  
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onSearch(e.target.value)}
      style={{ padding: '8px', marginRight: '10px', width: '200px' }}
    />
  );
});

/**
 * Child Component: Button with Callback
 */
const ActionButton = memo(function ActionButton({ label, onClick, color = '#51cf66' }) {
  console.log('ActionButton rendering:', label);
  
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        marginRight: '5px',
        backgroundColor: color,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );
});

/**
 * Child Component: List of items
 */
const ItemList = memo(function ItemList({ items, onItemClick, selectedId }) {
  console.log('ItemList rendering...');
  
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No items found</p>
      ) : (
        items.map(item => (
          <div
            key={item.id}
            onClick={() => onItemClick(item.id)}
            style={{
              padding: '10px',
              backgroundColor: selectedId === item.id ? '#ffe066' : '#f9f9f9',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {item.name}
          </div>
        ))
      )}
    </div>
  );
});

/**
 * Main Component: Stabilization Demo
 */
export function StabilizationDemo() {
  const [searchText, setSearchText] = useState('');
  const [items] = useState([
    { id: 1, name: 'React Hooks' },
    { id: 2, name: 'Performance Optimization' },
    { id: 3, name: 'useCallback Pattern' },
    { id: 4, name: 'Memoization' },
    { id: 5, name: 'useContext API' },
    { id: 6, name: 'State Management' },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [stats, setStats] = useState({ searches: 0, clicks: 0 });

  // WITHOUT useCallback (INEFFICIENT):
  // const handleSearch = (text) => {
  //   setSearchText(text);
  //   setStats(prev => ({ ...prev, searches: prev.searches + 1 }));
  // };
  // 
  // Every time parent re-renders, handleSearch is a NEW function reference!
  // This causes SearchFilter to re-render even if the search text hasn't changed.

  // WITH useCallback (EFFICIENT):
  // Function is only recreated when dependencies change
  const handleSearch = useCallback((text) => {
    setSearchText(text);
    setStats(prev => ({ ...prev, searches: prev.searches + 1 }));
  }, []); // Empty dependency array = function never changes

  const handleItemClick = useCallback((id) => {
    setSelectedId(id);
    setStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
  }, []); // Empty dependency array = function never changes

  const handleReset = useCallback(() => {
    setSearchText('');
    setSelectedId(null);
  }, []);

  const handleSort = useCallback(() => {
    // In a real app, this would sort the items
    console.log('Sorting items...');
  }, []);

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  ); // Fixed missing semicolon

  return (
    <div style={{ padding: '20px', border: '1px solid green' }}>
      <h3>Exercise 2.2: Stabilization (useCallback)</h3>

      <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Stats:</strong></p>
        <p>Search Count: {stats.searches} | Click Count: {stats.clicks}</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Open console to see that child components only re-render when necessary (thanks to useCallback!)
        </p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <SearchFilter
          onSearch={handleSearch}
          placeholder="Search items..."
          value={searchText}
        />
        <ActionButton label="Reset" onClick={handleReset} color="#ff6b6b" />
        <ActionButton label="Sort" onClick={handleSort} color="#748ffc" />
      </div>

      <ItemList
        items={filteredItems}
        onItemClick={handleItemClick}
        selectedId={selectedId}
      />

      {selectedId && (
        <p style={{ marginTop: '10px' }}>
          Selected: {items.find(i => i.id === selectedId)?.name}
        </p>
      )}
    </div>
  );
}

/**
 * Advanced Example: Callback with Dependency
 */
export function AdvancedCallbackExample() {
  const [multiplier, setMultiplier] = useState(1);
  const [number, setNumber] = useState(5);
  const [results, setResults] = useState([]);

  // This callback depends on 'multiplier'
  // It will be recreated whenever multiplier changes
  const calculateMultiple = useCallback((num) => {
    const result = num * multiplier;
    setResults(prev => [...prev, result]);
  }, [multiplier]); // Dependency: multiplier

  return (
    <div style={{ padding: '20px', border: '1px solid purple' }}>
      <h4>Advanced: Callback with Dependencies</h4>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Number:
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Multiplier:
          <input
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
          />
        </label>
      </div>

      <ActionButton
        label={`Calculate (${number} × ${multiplier})`}
        onClick={() => calculateMultiple(number)}
        color="#5c7cfa"
      />

      <div style={{ marginTop: '10px' }}>
        <p>Results: {results.join(', ')}</p>
      </div>
    </div>
  );
}

// Complete Example
export function Exercise22Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h2>Exercise 2.2: Stabilization (useCallback)</h2>
      <StabilizationDemo />
      <AdvancedCallbackExample />
    </div>
  );
}
