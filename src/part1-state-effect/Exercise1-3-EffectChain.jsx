/**
 * EXERCISE 1.3: Effect Chain
 * 
 * Understanding: Demonstrate complex useEffect dependencies and cleanup functions.
 * Shows how to handle multiple related effects and prevent memory leaks.
 * 
 * Requirements:
 * - Use multiple useEffect hooks with different dependencies
 * - Implement cleanup functions
 * - Handle async operations safely
 * - Demonstrate effect ordering and dependencies
 */

import React, { useState, useEffect } from 'react';

/**
 * Component: Timer with Cleanup
 * Demonstrates: Multiple effects, cleanup functions, dependencies
 */
export function TimerComponent() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState([]);

  // Effect 1: Handle timer interval
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }

    // Cleanup: Clear interval when component unmounts or isActive changes
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Effect 2: Log timer changes
  useEffect(() => {
    if (seconds > 0) {
      setLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), seconds }
      ]);
    }
  }, [seconds]);

  // Effect 3: Show alert every 10 seconds
  useEffect(() => {
    if (seconds > 0 && seconds % 10 === 0 && isActive) {
      console.log(`Timer reached ${seconds} seconds!`);
    }
  }, [seconds, isActive]);

  // Effect 4: Update document title
  useEffect(() => {
    document.title = `Timer: ${seconds}s`;
    return () => {
      document.title = 'React Lab 5';
    };
  }, [seconds]);

  return (
    <div style={{ padding: '20px', border: '1px solid red' }}>
      <h3>Timer with Effect Chain</h3>
      
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
        {seconds}s
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={() => setIsActive(!isActive)}
          style={{ backgroundColor: isActive ? '#ff6b6b' : '#51cf66' }}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setSeconds(0);
            setLogs([]);
            setIsActive(false);
          }}
          style={{ marginLeft: '10px', backgroundColor: '#999' }}
        >
          Reset
        </button>
      </div>

      <details>
        <summary>Logs ({logs.length})</summary>
        <ul style={{ maxHeight: '150px', overflow: 'auto' }}>
          {logs.map((log, idx) => (
            <li key={idx}>
              {log.timestamp}: {log.seconds}s
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

/**
 * Component: Data Fetcher with Cleanup
 * Demonstrates: Async effects, cleanup from async operations, AbortController
 */
export function DataFetcher() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect: Fetch user data
  useEffect(() => {
    // Create AbortController to cancel fetch if component unmounts
    const abortController = new AbortController();
    
    setLoading(true);
    setError(null);

    // Simulate API call
    const timer = setTimeout(() => {
      if (!abortController.signal.aborted) {
        const mockUser = {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          createdAt: new Date().toISOString()
        };
        setUser(mockUser);
        setLoading(false);
      }
    }, 1500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [userId]);

  return (
    <div style={{ padding: '20px', border: '1px solid green' }}>
      <h3>Data Fetcher with Cleanup</h3>

      <div style={{ marginBottom: '10px' }}>
        <label>
          User ID:
          <input
            type="number"
            min="1"
            max="10"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
        </label>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {user && (
        <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Created:</strong> {user.createdAt}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Component: Window Resize Listener
 * Demonstrates: Event listeners with cleanup
 */
export function WindowResizeListener() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    // Handler function
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup: Remove event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array = run once on mount

  return (
    <div style={{ padding: '20px', border: '1px solid purple' }}>
      <h3>Window Resize Listener</h3>
      <p>
        Window Size: {windowSize.width}px × {windowSize.height}px
      </p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Try resizing the window to see the values update (with cleanup on unmount)
      </p>
    </div>
  );
}

/**
 * Component: Subscription Manager
 * Demonstrates: Multiple subscriptions with shared cleanup
 */
export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setStatus('subscribing');
    const subscriptionIds = [];

    // Subscribe to multiple sources
    const sub1 = setTimeout(() => {
      subscriptionIds.push('subscription-1');
      setSubscriptions(prev => [...prev, 'Topic A']);
    }, 500);

    const sub2 = setTimeout(() => {
      subscriptionIds.push('subscription-2');
      setSubscriptions(prev => [...prev, 'Topic B']);
    }, 1000);

    const sub3 = setTimeout(() => {
      subscriptionIds.push('subscription-3');
      setSubscriptions(prev => [...prev, 'Topic C']);
      setStatus('subscribed');
    }, 1500);

    // Cleanup: Unsubscribe from all
    return () => {
      clearTimeout(sub1);
      clearTimeout(sub2);
      clearTimeout(sub3);
      setStatus('unsubscribed');
    };
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid brown' }}>
      <h3>Subscription Manager</h3>
      <p>Status: <strong>{status}</strong></p>
      <p>Active Subscriptions: {subscriptions.length}</p>
      <ul>
        {subscriptions.map((sub, idx) => (
          <li key={idx}>{sub}</li>
        ))}
      </ul>
    </div>
  );
}

// Complete Example
export function Exercise13Complete() {
  const [showTimer, setShowTimer] = useState(true);
  const [mounted, setMounted] = useState(true);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa' }}>
      <h2>Exercise 1.3: Effect Chain</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setShowTimer(!showTimer)}>
          {showTimer ? 'Hide' : 'Show'} Timer
        </button>
        <button onClick={() => setMounted(!mounted)} style={{ marginLeft: '10px' }}>
          {mounted ? 'Unmount' : 'Mount'} All Components
        </button>
      </div>

      {mounted && (
        <>
          {showTimer && <TimerComponent />}
          <DataFetcher />
          <WindowResizeListener />
          <SubscriptionManager />
        </>
      )}
    </div>
  );
}
