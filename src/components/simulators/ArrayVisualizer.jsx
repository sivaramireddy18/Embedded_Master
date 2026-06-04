import React, { useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function ArrayVisualizer() {
  const [elements, setElements] = useState([10, 20, 30, 40, 50]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [accessMode, setAccessMode] = useState('safe');
  const [targetIndex, setTargetIndex] = useState(2);
  const [newValue, setNewValue] = useState(99);
  const [errorMsg, setErrorMsg] = useState('');
  
  const baseAddress = 0x1000;
  
  const handleAccess = () => {
    setErrorMsg('');
    setActiveIndex(targetIndex);
    
    if (targetIndex < 0 || targetIndex >= 5) {
      setErrorMsg(`BUFFER OVERFLOW! You accessed memory outside the array bounds. This overwrites other variables or causes a Segmentation Fault.`);
    } else {
      const newArr = [...elements];
      newArr[targetIndex] = newValue;
      setElements(newArr);
    }
  };
  
  const handleReset = () => {
    setElements([10, 20, 30, 40, 50]);
    setActiveIndex(null);
    setErrorMsg('');
    setTargetIndex(2);
  };
  
  return (
    <div className="simulator-container glass-card no-hover">
      <div className="simulator-header">
        <h3>📚 Contiguous Memory Visualizer</h3>
        <button className="btn btn-secondary btn-sm" onClick={handleReset}>
          <RefreshCw size={14} /> Reset
        </button>
      </div>
      
      <div className="simulator-body">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <code>int data[5] = {'{'}{elements.join(', ')}{'}'};</code>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
            Each <code>int</code> takes 4 bytes. The array elements are stored back-to-back in memory.
          </p>
        </div>
        
        {/* Memory Grid */}
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 'var(--space-4)' }}>
          {/* Safe bounds */}
          {elements.map((val, i) => (
            <div 
              key={i} 
              style={{
                flex: '0 0 80px',
                border: `2px solid \${activeIndex === i ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.1)'}`,
                background: activeIndex === i ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden'
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.05)', fontSize: '10px', textAlign: 'center', padding: '4px 0', fontFamily: 'var(--font-mono)' }}>
                data[{i}]
              </div>
              <div style={{ padding: 'var(--space-3) 0', textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {val}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', fontSize: '10px', textAlign: 'center', padding: '4px 0', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                0x{(baseAddress + (i * 4)).toString(16).toUpperCase()}
              </div>
            </div>
          ))}
          
          {/* Out of bounds marker */}
          <div style={{ width: '2px', background: 'var(--accent-red)', margin: '0 8px' }} />
          
          {/* Out of bounds memory */}
          {[5, 6].map(i => (
            <div 
              key={i} 
              style={{
                flex: '0 0 80px',
                border: `2px dashed \${activeIndex === i ? 'var(--accent-red)' : 'rgba(239, 68, 68, 0.3)'}`,
                background: activeIndex === i ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                opacity: 0.7
              }}
            >
               <div style={{ background: 'rgba(239,68,68,0.05)', fontSize: '10px', textAlign: 'center', padding: '4px 0', fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>
                data[{i}] ??
              </div>
              <div style={{ padding: 'var(--space-3) 0', textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {activeIndex === i ? newValue : '???'}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', fontSize: '10px', textAlign: 'center', padding: '4px 0', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                0x{(baseAddress + (i * 4)).toString(16).toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)', marginTop: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>Target Index</label>
            <input 
              type="number" 
              value={targetIndex} 
              onChange={e => setTargetIndex(parseInt(e.target.value) || 0)}
              style={{ width: 80, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>New Value</label>
            <input 
              type="number" 
              value={newValue} 
              onChange={e => setNewValue(parseInt(e.target.value) || 0)}
              style={{ width: 80, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAccess}>
            Execute: data[{targetIndex}] = {newValue};
          </button>
        </div>
        
        {errorMsg && (
          <div className="slide-up" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-red)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <AlertTriangle color="var(--accent-red)" size={24} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 'var(--text-sm)', color: '#fff' }}>{errorMsg}</div>
          </div>
        )}
      </div>
    </div>
  );
}
