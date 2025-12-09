/**
 * EXERCISE 4.2: Testing Error Boundaries
 * 
 * Understanding: Implement and test Error Boundaries to catch and handle
 * JavaScript errors in React components.
 * 
 * Requirements:
 * - Create an Error Boundary component
 * - Test error catching behavior
 * - Handle recovery
 * - Log errors properly
 */

import React from 'react';

/**
 * Error Boundary Component
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          borderLeft: '4px solid #f44336',
          borderRadius: '4px'
        }} data-testid="error-boundary">
          <h2 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>
            ⚠️ Something went wrong
          </h2>

          <details style={{ marginBottom: '15px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#d32f2f' }}>
              Error Details (Click to expand)
            </summary>
            <pre style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#fff3e0',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }} data-testid="error-details">
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>

          <p style={{ color: '#666', margin: '0 0 15px 0' }}>
            Error Count: <strong data-testid="error-count">{this.state.errorCount}</strong>
          </p>

          <button
            onClick={this.resetError}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            data-testid="reset-error-button"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Component that throws an error
 */
export function BuggyComponent({ shouldError = false }) {
  if (shouldError) {
    throw new Error('This is a simulated error from BuggyComponent');
  }

  return (
    <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
      <p>✅ No errors here! Component rendered successfully.</p>
    </div>
  );
}

/**
 * Interactive Error Test Component
 */
export function ErrorBoundaryDemo() {
  const [shouldError, setShouldError] = React.useState(false);

  return (
    <div style={{ padding: '20px', border: '1px solid red' }}>
      <h3>Error Boundary Demo</h3>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => setShouldError(!shouldError)}
          style={{
            padding: '10px 20px',
            backgroundColor: shouldError ? '#4caf50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          data-testid="toggle-error-button"
        >
          {shouldError ? 'Fix Error' : 'Trigger Error'}
        </button>
      </div>

      <ErrorBoundary>
        <BuggyComponent shouldError={shouldError} />
      </ErrorBoundary>
    </div>
  );
}

/**
 * Advanced: Multiple Error Boundaries
 */
export function AdvancedErrorBoundaryExample() {
  const [errors, setErrors] = React.useState({
    section1: false,
    section2: false,
    section3: false
  });

  const toggleError = (section) => {
    setErrors(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div style={{ padding: '20px', border: '1px solid purple' }}>
      <h3>Multiple Error Boundaries</h3>
      <p>Each section has its own error boundary. Errors in one section don't affect others.</p>

      <div style={{ marginBottom: '15px' }}>
        <h4>Section 1</h4>
        <button
          onClick={() => toggleError('section1')}
          style={{
            padding: '8px 16px',
            backgroundColor: errors.section1 ? '#4caf50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          {errors.section1 ? 'Fix' : 'Break'} Section 1
        </button>
        <ErrorBoundary key={`section1-${errors.section1}`}>
          <BuggyComponent shouldError={errors.section1} />
        </ErrorBoundary>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>Section 2</h4>
        <button
          onClick={() => toggleError('section2')}
          style={{
            padding: '8px 16px',
            backgroundColor: errors.section2 ? '#4caf50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          {errors.section2 ? 'Fix' : 'Break'} Section 2
        </button>
        <ErrorBoundary key={`section2-${errors.section2}`}>
          <BuggyComponent shouldError={errors.section2} />
        </ErrorBoundary>
      </div>

      <div>
        <h4>Section 3</h4>
        <button
          onClick={() => toggleError('section3')}
          style={{
            padding: '8px 16px',
            backgroundColor: errors.section3 ? '#4caf50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          {errors.section3 ? 'Fix' : 'Break'} Section 3
        </button>
        <ErrorBoundary key={`section3-${errors.section3}`}>
          <BuggyComponent shouldError={errors.section3} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

// Complete Example
export function Exercise42Complete() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h2>Exercise 4.2: Testing Error Boundaries</h2>
      <ErrorBoundaryDemo />
      <AdvancedErrorBoundaryExample />
    </div>
  );
}
