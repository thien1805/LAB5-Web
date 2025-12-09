# Lab 5: React Advanced - Practical Exercises

A comprehensive React lab covering advanced concepts including state management, performance optimization, design patterns, and testing strategies.

## 📚 Lab Structure

### **Part 1: State & Effect Mastery** (Exercises 1.1 - 1.3)

#### Exercise 1.1: Context Counter
- **Concept**: useContext, Context API, Provider Pattern
- **Key Learning Points**:
  - Creating and using React Context for global state
  - Building custom hooks with useContext
  - Avoiding prop drilling
  - Multiple consumers sharing the same state

```jsx
// Create Context
const CounterContext = createContext();

// Create Provider
function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  // ... logic
  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
}

// Use with custom hook
function useCounter() {
  return useContext(CounterContext);
}
```

#### Exercise 1.2: Local Persistence
- **Concept**: useEffect with localStorage, Custom Hooks
- **Key Learning Points**:
  - Persisting state to browser storage
  - Handling JSON serialization
  - Custom hooks for reusable stateful logic
  - Cleanup and error handling

```jsx
function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
```

#### Exercise 1.3: Effect Chain
- **Concept**: Multiple useEffect hooks, Cleanup functions, Dependencies
- **Key Learning Points**:
  - Running multiple effects with different dependencies
  - Cleanup functions preventing memory leaks
  - Handling async operations safely
  - Event listener management

```jsx
useEffect(() => {
  // Setup
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []); // Dependencies array
```

---

### **Part 2: Performance Engineering** (Exercises 2.1 - 2.3)

#### Exercise 2.1: The Laggy List
- **Concept**: useMemo, React.memo, Optimization
- **Key Learning Points**:
  - Memoizing expensive computations
  - Preventing unnecessary re-renders with React.memo
  - Understanding when to optimize
  - Identifying performance bottlenecks

```jsx
// Memoize expensive calculations
const filteredAndSorted = useMemo(() => {
  return items
    .filter(/* ... */)
    .sort(/* ... */);
}, [items, filterText, filterCategory, sortBy]);

// Prevent re-renders
const ListItem = memo(function ListItem({ item, onDelete }) {
  // Only re-renders when props change
  return /* ... */;
});
```

#### Exercise 2.2: Stabilization
- **Concept**: useCallback, Function References, Memoization
- **Key Learning Points**:
  - Stabilizing function references with useCallback
  - When to use useCallback (before passing to memo'd children)
  - Dependency management in callbacks
  - Performance implications of callbacks

```jsx
const handleSearch = useCallback((text) => {
  setSearchText(text);
}, []); // Function never changes

// When dependency changes, function is recreated
const handleFilter = useCallback((filter) => {
  setFilter(filter);
}, [sortBy]); // Recreated when sortBy changes
```

#### Exercise 2.3: Code Splitting
- **Concept**: React.lazy, Suspense, Dynamic Imports
- **Key Learning Points**:
  - Lazy loading components
  - Suspense boundaries and loading states
  - Reducing initial bundle size
  - Error handling for lazy components

```jsx
const Dashboard = lazy(() => import('./Dashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

---

### **Part 3: Advanced Design Patterns** (Exercises 3.1 - 3.2)

#### Exercise 3.1: Compound Tabs Component
- **Concept**: Compound Component Pattern, Context
- **Key Learning Points**:
  - Building flexible, composable components
  - Implicit state sharing through Context
  - Child components discovering parent state
  - Tab navigation patterns

```jsx
<Tabs defaultTab={0}>
  <TabList>
    <TabButton index={0}>Tab 1</TabButton>
    <TabButton index={1}>Tab 2</TabButton>
  </TabList>
  <TabPanel index={0}>Content 1</TabPanel>
  <TabPanel index={1}>Content 2</TabPanel>
</Tabs>
```

#### Exercise 3.2: Portals & Modals
- **Concept**: React Portals, Modal Patterns
- **Key Learning Points**:
  - Rendering outside DOM hierarchy
  - Modal implementations
  - Event handling with portals
  - Focus management
  - Nested modals

```jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div onClick={onClose}>
      {children}
    </div>,
    document.body
  );
}
```

---

### **Part 4: Testing Strategies** (Exercises 4.1 - 4.2)

#### Exercise 4.1: Integration Testing a Form
- **Concept**: React Testing Library, User-centric Testing
- **Key Learning Points**:
  - Testing user interactions
  - Form validation testing
  - Async operations in tests
  - Accessibility in tests

```jsx
it('should submit form with valid data', () => {
  const { getByTestId } = render(<RegistrationForm />);
  
  fireEvent.change(getByTestId('email-input'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(getByTestId('submit-button'));
  
  expect(getByTestId('success-message')).toBeInTheDocument();
});
```

#### Exercise 4.2: Error Boundaries
- **Concept**: Error Boundaries, Error Handling
- **Key Learning Points**:
  - Catching React errors
  - Fallback UI
  - Error recovery
  - Multiple error boundaries
  - Testing error scenarios

```jsx
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error
  }

  render() {
    if (this.state.hasError) {
      return <div>Error occurred</div>;
    }
    return this.props.children;
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
cd /Users/thien2005/Documents/SEM5/LAB5
npm install
```

### Running Exercises

```bash
npm start
```

This will start the interactive application with navigation to all exercises.

### Running Tests

```bash
npm test
npm test -- --watch
```

---

## 📋 Key Concepts Summary

### State Management Patterns
- ✅ **useState**: Simple local state
- ✅ **useReducer**: Complex state logic
- ✅ **useContext**: Global state without prop drilling
- ✅ **Custom Hooks**: Reusable stateful logic

### Performance Optimization
- ✅ **useMemo**: Cache expensive calculations
- ✅ **useCallback**: Stabilize function references
- ✅ **React.memo**: Prevent unnecessary re-renders
- ✅ **Code Splitting**: Lazy load components

### Advanced Patterns
- ✅ **Compound Components**: Flexible component composition
- ✅ **Render Props**: Share state via props
- ✅ **Higher-Order Components**: Function returning component
- ✅ **Portals**: Render outside DOM hierarchy

### Side Effects
- ✅ **useEffect**: Run code after render
- ✅ **Cleanup Functions**: Prevent memory leaks
- ✅ **Dependencies**: Control when effects run

---

## 💡 Best Practices

### 1. State Management
```jsx
// ❌ Don't: Unnecessary state
const [total, setTotal] = useState(0);
const items = []; // Will recalculate each render

// ✅ Do: Derive from other state
const items = useMemo(() => cartItems.filter(/* ... */), [cartItems]);
const total = useMemo(() => items.reduce(/* ... */), [items]);
```

### 2. Performance
```jsx
// ❌ Don't: Create functions in render
<Child onClick={() => handleClick(id)} />

// ✅ Do: Memoize callbacks
const handleClickMemo = useCallback(() => handleClick(id), [id]);
<Child onClick={handleClickMemo} />
```

### 3. Effects
```jsx
// ❌ Don't: Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // userId dependency missing!

// ✅ Do: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### 4. Testing
```jsx
// ❌ Don't: Test implementation details
expect(component.state.count).toBe(1);

// ✅ Do: Test user behavior
fireEvent.click(getByRole('button', { name: /increment/i }));
expect(getByText('1')).toBeInTheDocument();
```

---

## 📚 Resources

### Official Documentation
- [React Hooks Documentation](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Performance Optimization](https://react.dev/learn/render-and-commit)

### Key Readings
- Context API for global state
- useCallback and useMemo performance implications
- Error Boundaries best practices
- Testing accessibility

---

## 🎯 Learning Outcomes

After completing this lab, you should be able to:

1. ✅ Manage complex state with Context API and custom hooks
2. ✅ Optimize React application performance effectively
3. ✅ Implement advanced design patterns like Compound Components
4. ✅ Use Portals for modals and dropdowns
5. ✅ Write integration tests for React components
6. ✅ Handle errors gracefully with Error Boundaries
7. ✅ Understand when and how to use each React hook
8. ✅ Build production-ready React applications

---

## 📝 Exercise Checklist

### Part 1: State & Effect Mastery
- [ ] Exercise 1.1: Context Counter
- [ ] Exercise 1.2: Local Persistence
- [ ] Exercise 1.3: Effect Chain

### Part 2: Performance Engineering
- [ ] Exercise 2.1: The Laggy List
- [ ] Exercise 2.2: Stabilization
- [ ] Exercise 2.3: Code Splitting

### Part 3: Advanced Design Patterns
- [ ] Exercise 3.1: Compound Tabs
- [ ] Exercise 3.2: Portals & Modals

### Part 4: Testing Strategies
- [ ] Exercise 4.1: Form Integration Testing
- [ ] Exercise 4.2: Error Boundaries Testing

---

## 🤝 Contributing

Feel free to extend these exercises with:
- Additional test cases
- More advanced examples
- Performance benchmarks
- Real API integrations

---

**Happy Learning! 🚀**
# LAB5-Web
