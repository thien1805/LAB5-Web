/**
 * EXERCISE 1.2: Local Persistence
 * 
 * Understanding: Use useEffect to persist state to localStorage and restore
 * it on component mount. This demonstrates side effects and cleanup.
 * 
 * Requirements:
 * - Save state to localStorage whenever it changes
 * - Load state from localStorage on mount
 * - Handle JSON serialization/deserialization
 * - Provide ability to clear persisted data
 */

import React, { useState, useEffect } from 'react';

/**
 * Custom Hook: usePersistentState
 * Combines useState with useEffect for localStorage persistence
 */
export function usePersistentState(key, initialValue) {
  // State holds the current value
  const [state, setState] = useState(() => {
    // Initialize from localStorage if available
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Effect: Save to localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, state]);

  return [state, setState];
}

/**
 * Component: Todo List with Persistence
 */
export function PersistentTodoList() {
  const [todos, setTodos] = usePersistentState('todos', []);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearAll = () => {
    setTodos([]);
    window.localStorage.removeItem('todos');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid orange' }}>
      <h3>Persistent Todo List</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
        <button onClick={clearAll} style={{ marginLeft: '10px', backgroundColor: '#ff6b6b', color: 'white' }}>
          Clear All
        </button>
      </div>

      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.6 : 1,
              marginBottom: '5px'
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {' '}
            {todo.text}
            {' '}
            <small>({new Date(todo.createdAt).toLocaleString()})</small>
            {' '}
            <button onClick={() => deleteTodo(todo.id)} style={{ color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p>Total Todos: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
    </div>
  );
}

/**
 * Component: Form with Persistent Values
 */
export function PersistentForm() {
  const [formData, setFormData] = usePersistentState('formData', {
    name: '',
    email: '',
    preferences: 'dark'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      preferences: 'dark'
    });
    window.localStorage.removeItem('formData');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid teal' }}>
      <h3>Persistent Form</h3>
      
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </label>
      </div>

      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </label>
      </div>

      <div>
        <label>
          Preferences:
          <select name="preferences" value={formData.preferences} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </label>
      </div>

      <button onClick={handleReset}>Reset Form</button>

      <p style={{ marginTop: '10px', fontFamily: 'monospace' }}>
        Saved Data: {JSON.stringify(formData)}
      </p>
    </div>
  );
}

// Complete Example
export function Exercise12Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h2>Exercise 1.2: Local Persistence</h2>
      <PersistentTodoList />
      <PersistentForm />
    </div>
  );
}
