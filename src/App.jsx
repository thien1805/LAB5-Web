import React, { useState } from 'react';
import { Exercise11Complete } from './part1-state-effect/Exercise1-1-ContextCounter';
import { Exercise12Complete } from './part1-state-effect/Exercise1-2-LocalPersistence';
import { Exercise13Complete } from './part1-state-effect/Exercise1-3-EffectChain';
import { Exercise21Complete } from './part2-performance/Exercise2-1-LaggyList';
import { Exercise22Complete } from './part2-performance/Exercise2-2-Stabilization';
import { Exercise23Complete } from './part2-performance/Exercise2-3-CodeSplitting';
import { Exercise31Complete } from './part3-patterns/Exercise3-1-CompoundTabs';
import { Exercise32Complete } from './part3-patterns/Exercise3-2-Portals';
import { Exercise41Complete } from './part4-testing/Exercise4-1-FormTesting';
import { Exercise42Complete } from './part4-testing/Exercise4-2-ErrorBoundaries';

/**
 * Main Application Component
 * Navigation and exercise display
 */
function App() {
  const [selectedExercise, setSelectedExercise] = useState('1.1');

  const exercises = {
    // Part 1: State & Effect Mastery
    '1.1': { title: 'Context Counter', component: Exercise11Complete, part: 1 },
    '1.2': { title: 'Local Persistence', component: Exercise12Complete, part: 1 },
    '1.3': { title: 'Effect Chain', component: Exercise13Complete, part: 1 },
    
    // Part 2: Performance Engineering
    '2.1': { title: 'The Laggy List', component: Exercise21Complete, part: 2 },
    '2.2': { title: 'Stabilization', component: Exercise22Complete, part: 2 },
    '2.3': { title: 'Code Splitting', component: Exercise23Complete, part: 2 },
    
    // Part 3: Advanced Design Patterns
    '3.1': { title: 'Compound Tabs', component: Exercise31Complete, part: 3 },
    '3.2': { title: 'Portals & Modals', component: Exercise32Complete, part: 3 },
    
    // Part 4: Testing Strategies
    '4.1': { title: 'Form Testing', component: Exercise41Complete, part: 4 },
    '4.2': { title: 'Error Boundaries', component: Exercise42Complete, part: 4 },
  };

  const currentExercise = exercises[selectedExercise];
  const CurrentComponent = currentExercise?.component;

  const getParts = () => {
    const parts = {};
    Object.entries(exercises).forEach(([key, value]) => {
      if (!parts[value.part]) parts[value.part] = [];
      parts[value.part].push({ key, ...value });
    });
    return parts;
  };

  const parts = getParts();

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar Navigation */}
      <div style={{
        width: '280px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        overflowY: 'auto',
        borderRight: '2px solid #34495e'
      }}>
        <h1 style={{ fontSize: '18px', marginTop: 0, marginBottom: '20px' }}>
          🚀 React Advanced
        </h1>

        {Object.entries(parts).map(([partNum, partExercises]) => (
          <div key={partNum} style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '14px', color: '#ecf0f1', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
              Part {partNum}
            </h3>

            {partExercises.map(exercise => (
              <button
                key={exercise.key}
                onClick={() => setSelectedExercise(exercise.key)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: selectedExercise === exercise.key ? '#3498db' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '8px',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (selectedExercise !== exercise.key) {
                    e.target.style.backgroundColor = '#34495e';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedExercise !== exercise.key) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <strong>{exercise.key}:</strong> {exercise.title}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#ecf0f1'
      }}>
        {CurrentComponent && (
          <>
            {/* Header */}
            <div style={{
              backgroundColor: '#34495e',
              color: 'white',
              padding: '20px',
              borderBottom: '3px solid #2c3e50'
            }}>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '28px' }}>
                Exercise {selectedExercise}
              </h1>
              <p style={{ margin: 0, color: '#bdc3c7' }}>
                {currentExercise.title}
              </p>
            </div>

            {/* Exercise Content */}
            <div style={{ padding: '20px' }}>
              <CurrentComponent />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
