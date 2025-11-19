import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (!v) return;
    setTodos(prev => [...prev, v]);
    setInput('');
  };

  const remove = index => setTodos(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Todo ({todos.length})</h1>

        <div className="controls">
          <input
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Add todo and press Enter"
            aria-label="Add todo"
          />
          <button className="btn" onClick={add}>Add</button>
        </div>

        <ul className="list" aria-live="polite">
          {todos.map((todo, i) => (
            <li className="item" key={i}>
              <span className="itemText">{todo}</span>
              <button
                className="removeBtn"
                onClick={() => remove(i)}
                aria-label={`remove-${i}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}