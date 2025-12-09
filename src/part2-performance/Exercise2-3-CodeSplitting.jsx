/**
 * EXERCISE 2.3: Route-Based Code Splitting
 * 
 * Understanding: Demonstrate code splitting and lazy loading of components
 * using React.lazy and Suspense to improve initial load time.
 * 
 * Requirements:
 * - Use React.lazy for dynamic imports
 * - Implement Suspense boundaries
 * - Show loading states
 * - Handle error cases
 */

import React, { lazy, Suspense, useState } from 'react';

// Lazy load components (simulated - in real app these would be separate files)
const Dashboard = lazy(() => 
  new Promise(resolve => 
    setTimeout(() => resolve({
      default: () => (
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd' }}>
          <h4>Dashboard</h4>
          <p>This component was lazy loaded! Check network tab to see code splitting in action.</p>
          <div style={{ marginTop: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'white', marginBottom: '5px' }}>📊 Analytics</div>
            <div style={{ padding: '10px', backgroundColor: 'white', marginBottom: '5px' }}>📈 Charts</div>
            <div style={{ padding: '10px', backgroundColor: 'white', marginBottom: '5px' }}>⚙️ Settings</div>
          </div>
        </div>
      )
    }), 2000)
  )
);

const Settings = lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve({
      default: () => (
        <div style={{ padding: '20px', backgroundColor: '#f3e5f5' }}>
          <h4>Settings</h4>
          <p>Lazy loaded Settings component</p>
          <label style={{ display: 'block', marginTop: '10px' }}>
            <input type="checkbox" defaultChecked /> Enable Notifications
          </label>
          <label style={{ display: 'block', marginTop: '10px' }}>
            <input type="checkbox" defaultChecked /> Dark Mode
          </label>
        </div>
      )
    }), 1500)
  )
);

const Profile = lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve({
      default: () => (
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9' }}>
          <h4>Profile</h4>
          <div style={{ marginTop: '10px' }}>
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john@example.com</p>
            <p><strong>Joined:</strong> 2023-01-15</p>
          </div>
        </div>
      )
    }), 1200)
  )
);

/**
 * Loading Fallback Component
 */
function LoadingFallback() {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px'
    }}>
      <div style={{
        fontSize: '24px',
        marginBottom: '10px',
        animation: 'spin 1s linear infinite'
      }}>⏳</div>
      <p>Loading component...</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Error Boundary for lazy loaded components
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in lazy loaded component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          borderLeft: '4px solid #f44336',
          borderRadius: '4px'
        }}>
          <p style={{ color: '#d32f2f', marginBottom: '10px' }}>
            ❌ Error loading component
          </p>
          <details>
            <summary>Details</summary>
            <pre style={{ marginTop: '10px', fontSize: '12px', overflow: 'auto' }}>
              {this.state.error?.message}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main Component: Route-Based Code Splitting
 */
export function CodeSplittingDemo() {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [loadCount, setLoadCount] = useState({
    dashboard: 0,
    settings: 0,
    profile: 0
  });

  const handleRouteChange = (route) => {
    setActiveRoute(route);
    setLoadCount(prev => ({
      ...prev,
      [route]: prev[route] + 1
    }));
  };

  return (
    <div style={{ padding: '20px', border: '1px solid orange' }}>
      <h3>Exercise 2.3: Route-Based Code Splitting</h3>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '5px' }}>
        <button
          onClick={() => handleRouteChange('dashboard')}
          style={{
            padding: '10px 15px',
            backgroundColor: activeRoute === 'dashboard' ? '#51cf66' : '#ddd',
            color: activeRoute === 'dashboard' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📊 Dashboard ({loadCount.dashboard})
        </button>

        <button
          onClick={() => handleRouteChange('settings')}
          style={{
            padding: '10px 15px',
            backgroundColor: activeRoute === 'settings' ? '#51cf66' : '#ddd',
            color: activeRoute === 'settings' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ⚙️ Settings ({loadCount.settings})
        </button>

        <button
          onClick={() => handleRouteChange('profile')}
          style={{
            padding: '10px 15px',
            backgroundColor: activeRoute === 'profile' ? '#51cf66' : '#ddd',
            color: activeRoute === 'profile' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          👤 Profile ({loadCount.profile})
        </button>
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            {activeRoute === 'dashboard' && <Dashboard />}
            {activeRoute === 'settings' && <Settings />}
            {activeRoute === 'profile' && <Profile />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

/**
 * Advanced Example: Batch Lazy Loading
 */
export function BatchLazyLoading() {
  const [expandedModules, setExpandedModules] = useState({});

  const modules = ['Authentication', 'Database', 'Analytics', 'Payments'];

  const toggleModule = (module) => {
    setExpandedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  return (
    <div style={{ padding: '20px', border: '1px solid teal' }}>
      <h4>Advanced: Batch Lazy Loading</h4>
      <p>Click to lazy load each module on demand:</p>

      {modules.map(module => (
        <div key={module} style={{ marginBottom: '10px' }}>
          <button
            onClick={() => toggleModule(module)}
            style={{
              width: '100%',
              padding: '10px',
              textAlign: 'left',
              backgroundColor: expandedModules[module] ? '#e3f2fd' : '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {expandedModules[module] ? '▼' : '▶'} {module}
          </button>

          {expandedModules[module] && (
            <div style={{ marginTop: '5px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <Suspense fallback={<LoadingFallback />}>
                <div>
                  <p>✅ Module "{module}" loaded successfully!</p>
                  <small>This module was only loaded when you clicked to expand it.</small>
                </div>
              </Suspense>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Complete Example
export function Exercise23Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa' }}>
      <h2>Exercise 2.3: Route-Based Code Splitting</h2>
      <p>💡 Tip: Check the Network tab in DevTools to see code splitting in action!</p>
      <CodeSplittingDemo />
      <BatchLazyLoading />
    </div>
  );
}
