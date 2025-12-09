/**
 * EXERCISE 3.2: The "Trapdoor" Modal (Portals)
 * 
 * Understanding: Use React Portals to render components outside the DOM hierarchy,
 * typically for modals, tooltips, and dropdowns. Shows decoupling of rendering location.
 * 
 * Requirements:
 * - Create a modal using ReactDOM.createPortal
 * - Implement backdrop click handling
 * - Support nested modals
 * - Handle focus management and keyboard events
 */

import React, { useState, useEffect } from 'react';
// Note: In a real app, this would be: import ReactDOM from 'react-dom';
// For this demo, we'll implement a simple portal-like solution

/**
 * Portal Component: Similar to ReactDOM.createPortal
 * Creates a modal at the root of the page
 */
function PortalModal({ children, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          zIndex: 1001,
          maxHeight: '90vh',
          maxWidth: '90vw',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease'
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translate(-50%, -45%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}</style>
        {children}
      </div>
    </div>
  );
}

/**
 * Simple Modal Component
 */
export function SimpleModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '20px', border: '1px solid blue' }}>
      <h4>Simple Modal</h4>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#51cf66',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Open Modal
      </button>

      <PortalModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: '30px' }}>
          <h3>Hello from Portal! 👋</h3>
          <p>This modal is rendered outside the normal DOM hierarchy using Portals.</p>
          <p>Click the backdrop or press ESC to close.</p>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#51cf66',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </PortalModal>
    </div>
  );
}

/**
 * Alert Modal Component
 */
export function AlertModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertType, setAlertType] = useState('info');

  const showAlert = (type) => {
    setAlertType(type);
    setIsOpen(true);
  };

  const getAlertContent = () => {
    const alerts = {
      info: {
        icon: 'ℹ️',
        title: 'Information',
        message: 'This is an informational message.',
        color: '#2196f3'
      },
      success: {
        icon: '✅',
        title: 'Success',
        message: 'Operation completed successfully!',
        color: '#4caf50'
      },
      warning: {
        icon: '⚠️',
        title: 'Warning',
        message: 'Please pay attention to this warning.',
        color: '#ff9800'
      },
      error: {
        icon: '❌',
        title: 'Error',
        message: 'An error occurred. Please try again.',
        color: '#f44336'
      }
    };

    return alerts[alertType];
  };

  const content = getAlertContent();

  return (
    <div style={{ padding: '20px', border: '1px solid green' }}>
      <h4>Alert Modal</h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => showAlert('info')}
          style={{ padding: '8px 16px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Info
        </button>
        <button
          onClick={() => showAlert('success')}
          style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Success
        </button>
        <button
          onClick={() => showAlert('warning')}
          style={{ padding: '8px 16px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Warning
        </button>
        <button
          onClick={() => showAlert('error')}
          style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Error
        </button>
      </div>

      <PortalModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{
          padding: '30px',
          borderTop: `4px solid ${content.color}`,
          minWidth: '300px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>{content.icon}</div>
          <h3 style={{ color: content.color, margin: '0 0 10px 0' }}>{content.title}</h3>
          <p style={{ margin: '0 0 20px 0', color: '#666' }}>{content.message}</p>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: content.color,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </PortalModal>
    </div>
  );
}

/**
 * Nested Modals Component
 */
export function NestedModals() {
  const [isLevel1Open, setIsLevel1Open] = useState(false);
  const [isLevel2Open, setIsLevel2Open] = useState(false);
  const [isLevel3Open, setIsLevel3Open] = useState(false);

  return (
    <div style={{ padding: '20px', border: '1px solid purple' }}>
      <h4>Nested Modals (Portals)</h4>
      <button
        onClick={() => setIsLevel1Open(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#51cf66',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Open Level 1 Modal
      </button>

      {/* Level 1 Modal */}
      <PortalModal isOpen={isLevel1Open} onClose={() => setIsLevel1Open(false)}>
        <div style={{ padding: '30px', minWidth: '400px' }}>
          <h3>Level 1 Modal</h3>
          <p>You can open another modal from here!</p>
          <button
            onClick={() => setIsLevel2Open(true)}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#748ffc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Open Level 2
          </button>
          <button
            onClick={() => setIsLevel1Open(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </PortalModal>

      {/* Level 2 Modal */}
      <PortalModal isOpen={isLevel2Open} onClose={() => setIsLevel2Open(false)}>
        <div style={{ padding: '30px', minWidth: '350px' }}>
          <h3>Level 2 Modal</h3>
          <p>Keep going deeper...</p>
          <button
            onClick={() => setIsLevel3Open(true)}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#ffd43b',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Open Level 3
          </button>
          <button
            onClick={() => setIsLevel2Open(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </PortalModal>

      {/* Level 3 Modal */}
      <PortalModal isOpen={isLevel3Open} onClose={() => setIsLevel3Open(false)}>
        <div style={{ padding: '30px', minWidth: '300px' }}>
          <h3>Level 3 Modal</h3>
          <p>🎉 Three levels deep!</p>
          <button
            onClick={() => {
              setIsLevel3Open(false);
              setIsLevel2Open(false);
              setIsLevel1Open(false);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#51cf66',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close All
          </button>
        </div>
      </PortalModal>
    </div>
  );
}

// Complete Example
export function Exercise32Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h2>Exercise 3.2: The "Trapdoor" Modal (Portals)</h2>
      <p>React Portals allow rendering outside the normal DOM hierarchy!</p>
      <SimpleModal />
      <AlertModal />
      <NestedModals />
    </div>
  );
}
