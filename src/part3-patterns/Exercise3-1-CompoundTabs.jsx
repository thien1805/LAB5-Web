/**
 * EXERCISE 3.1: The Compound Tabs Component
 * 
 * Understanding: Implement the Compound Component Pattern where parent and child
 * components work together with implicit state sharing through Context.
 * 
 * Requirements:
 * - Create parent Tabs component
 * - Create child TabPanel and TabButton components
 * - Use Context to share active tab state
 * - Support keyboard navigation
 */

import React, { createContext, useContext, useState, Children } from 'react';

// Create Context for Tabs
const TabsContext = createContext();

/**
 * Parent Component: Tabs
 * Manages the active tab state and provides it to children
 */
export function Tabs({ children, defaultTab = 0, onTabChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Child Component: TabList
 * Container for tab buttons
 */
export function TabList({ children }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '2px solid #eee',
      backgroundColor: '#f9f9f9'
    }}>
      {children}
    </div>
  );
}

/**
 * Child Component: TabButton
 * Individual tab button
 */
export function TabButton({ children, index }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === index;

  return (
    <button
      onClick={() => setActiveTab(index)}
      style={{
        flex: 1,
        padding: '12px 16px',
        border: 'none',
        backgroundColor: isActive ? 'white' : '#f9f9f9',
        borderBottom: isActive ? '3px solid #51cf66' : '3px solid transparent',
        cursor: 'pointer',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? '#51cf66' : '#666',
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </button>
  );
}

/**
 * Child Component: TabPanel
 * Content area for each tab
 */
export function TabPanel({ children, index }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== index) return null;

  return (
    <div style={{ padding: '20px', animation: 'fadeIn 0.3s ease' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}

/**
 * Example: Documentation Tabs
 */
export function DocumentationTabs() {
  const [loadedTabs, setLoadedTabs] = useState(new Set([0]));

  const handleTabChange = (index) => {
    // Lazy load content (simulated)
    setLoadedTabs(prev => new Set(prev).add(index));
  };

  return (
    <Tabs onTabChange={handleTabChange}>
      <TabList>
        <TabButton index={0}>📘 Installation</TabButton>
        <TabButton index={1}>🚀 Getting Started</TabButton>
        <TabButton index={2}>📚 API Reference</TabButton>
        <TabButton index={3}>💡 Examples</TabButton>
      </TabList>

      <TabPanel index={0}>
        <h4>Installation</h4>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
npm install @react-advanced/tabs
        </pre>
      </TabPanel>

      <TabPanel index={1}>
        <h4>Getting Started</h4>
        <p>Import the components and structure your tabs:</p>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`<Tabs defaultTab={0}>
  <TabList>
    <TabButton index={0}>Tab 1</TabButton>
    <TabButton index={1}>Tab 2</TabButton>
  </TabList>
  <TabPanel index={0}>Content 1</TabPanel>
  <TabPanel index={1}>Content 2</TabPanel>
</Tabs>`}
        </pre>
      </TabPanel>

      <TabPanel index={2}>
        <h4>API Reference</h4>
        {loadedTabs.has(2) ? (
          <div>
            <p><strong>Tabs Component:</strong> Container for all tab components</p>
            <p><strong>TabList Component:</strong> Wrapper for tab buttons</p>
            <p><strong>TabButton Component:</strong> Individual tab button</p>
            <p><strong>TabPanel Component:</strong> Content for each tab</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </TabPanel>

      <TabPanel index={3}>
        <h4>Examples</h4>
        <p>Tabs are perfect for:</p>
        <ul>
          <li>Settings pages with multiple sections</li>
          <li>Documentation websites</li>
          <li>Product details with specs, reviews, and Q&A</li>
          <li>User profiles with different information sections</li>
        </ul>
      </TabPanel>
    </Tabs>
  );
}

/**
 * Example: Settings Tabs
 */
export function SettingsTabs() {
  return (
    <Tabs defaultTab={0}>
      <TabList>
        <TabButton index={0}>⚙️ Account</TabButton>
        <TabButton index={1}>🔔 Notifications</TabButton>
        <TabButton index={2}>🔐 Privacy</TabButton>
      </TabList>

      <TabPanel index={0}>
        <h4>Account Settings</h4>
        <div style={{ maxWidth: '400px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Email:
            <input type="email" placeholder="user@example.com" style={{ display: 'block', marginTop: '5px', padding: '5px' }} />
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Username:
            <input type="text" placeholder="username" style={{ display: 'block', marginTop: '5px', padding: '5px' }} />
          </label>
          <button style={{ backgroundColor: '#51cf66', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
            Save Changes
          </button>
        </div>
      </TabPanel>

      <TabPanel index={1}>
        <h4>Notification Preferences</h4>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" defaultChecked /> Email notifications
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" defaultChecked /> Push notifications
        </label>
        <label style={{ display: 'block' }}>
          <input type="checkbox" /> SMS notifications
        </label>
      </TabPanel>

      <TabPanel index={2}>
        <h4>Privacy Settings</h4>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="privacy" /> Public profile
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="privacy" defaultChecked /> Friends only
        </label>
        <label style={{ display: 'block' }}>
          <input type="radio" name="privacy" /> Private
        </label>
      </TabPanel>
    </Tabs>
  );
}

// Complete Example
export function Exercise31Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>Exercise 3.1: The Compound Tabs Component</h2>
      <p>The Compound Component pattern allows flexible, composable components!</p>
      
      <h3>Documentation Tabs</h3>
      <DocumentationTabs />

      <h3 style={{ marginTop: '30px' }}>Settings Tabs</h3>
      <SettingsTabs />
    </div>
  );
}
