/**
 * EXERCISE 1.1: Context Counter
 * 
 * Understanding: Create a global counter using useContext that demonstrates
 * how to avoid prop drilling and manage global state efficiently.
 * 
 * Requirements:
 * - Use createContext and useContext
 * - Create provider component
 * - Multiple consumers should share the same state
 * - Add increment, decrement, and reset actions
 */

import React, { createContext, useContext, useState } from 'react';

// Step 1: Create Context
const CounterContext = createContext();

// Step 2: Create Provider Component
export function CounterProvider({ children }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  const setCustomCount = (value) => setCount(value);

  const value = {
    count,
    increment,
    decrement,
    reset,
    setCustomCount
  };

  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
}

// Step 3: Custom Hook to use Context
export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }
  return context;
}

// Step 4: Consumer Components
export function CounterDisplay() {
  const { count } = useCounter();
  return (
    <div style={{ padding: '20px', border: '1px solid blue' }}>
      <h3>Current Count: {count}</h3>
    </div>
  );
}

export function CounterControls() {
  const { increment, decrement, reset } = useCounter();
  return (
    <div style={{ padding: '20px', border: '1px solid green' }}>
      <button onClick={increment}>Increment (+)</button>
      <button onClick={decrement}>Decrement (-)</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export function CounterAdvancedDisplay() {
  const { count, setCustomCount } = useCounter();
  
  return (
    <div style={{ padding: '20px', border: '1px solid purple' }}>
      <p>Advanced Display: {count * count}</p>
      <input
        type="number"
        value={count}
        onChange={(e) => setCustomCount(Number(e.target.value))}
        placeholder="Set count directly"
      />
    </div>
  );
}

// Complete Example
export function Exercise11Complete() {
  return (
    <CounterProvider>
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h2>Exercise 1.1: Context Counter</h2>
        <CounterDisplay />
        <CounterControls />
        <CounterAdvancedDisplay />
      </div>
    </CounterProvider>
  );
}
