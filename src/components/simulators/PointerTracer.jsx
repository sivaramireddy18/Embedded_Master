import React, { useState } from 'react';
import { RefreshCw, StepForward, ArrowRight } from 'lucide-react';

const steps = [
  {
    code: 'int x = 42;',
    desc: 'Allocates 4 bytes for x at address 0x1000. Value is 42.',
    mem: [
      { name: 'x', addr: '0x1000', val: '42', type: 'int', target: null }
    ],
    highlight: 0
  },
  {
    code: 'int *ptr;',
    desc: 'Allocates memory for ptr. It currently holds garbage.',
    mem: [
      { name: 'x', addr: '0x1000', val: '42', type: 'int', target: null },
      { name: 'ptr', addr: '0x1004', val: '0x????', type: 'int*', target: null }
    ],
    highlight: 1
  },
  {
    code: 'ptr = &x;',
    desc: 'Address-Of operator (&) gets the address of x (0x1000) and stores it in ptr.',
    mem: [
      { name: 'x', addr: '0x1000', val: '42', type: 'int', target: null },
      { name: 'ptr', addr: '0x1004', val: '0x1000', type: 'int*', target: 'x' }
    ],
    highlight: 2
  },
  {
    code: '*ptr = 99;',
    desc: 'Dereference operator (*) follows the address in ptr and modifies x.',
    mem: [
      { name: 'x', addr: '0x1000', val: '99', type: 'int', target: null, changed: true },
      { name: 'ptr', addr: '0x1004', val: '0x1000', type: 'int*', target: 'x' }
    ],
    highlight: 3
  },
  {
    code: 'int **dptr = &ptr;',
    desc: 'A pointer to a pointer! dptr stores the address of ptr (0x1004).',
    mem: [
      { name: 'x', addr: '0x1000', val: '99', type: 'int', target: null },
      { name: 'ptr', addr: '0x1004', val: '0x1000', type: 'int*', target: 'x' },
      { name: 'dptr', addr: '0x1008', val: '0x1004', type: 'int**', target: 'ptr' }
    ],
    highlight: 4
  },
  {
    code: '**dptr = 0;',
    desc: 'Double dereference! Follows dptr to ptr, then follows ptr to x, setting x to 0.',
    mem: [
      { name: 'x', addr: '0x1000', val: '0', type: 'int', target: null, changed: true },
      { name: 'ptr', addr: '0x1004', val: '0x1000', type: 'int*', target: 'x' },
      { name: 'dptr', addr: '0x1008', val: '0x1004', type: 'int**', target: 'ptr' }
    ],
    highlight: 5
  }
];

export default function PointerTracer() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];

  return (
    <div className="simulator-container glass-card no-hover">
      <div className="simulator-header">
        <h3>👉 Pointer Tracer</h3>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setStepIdx(0)}>
            <RefreshCw size={14} /> Reset
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setStepIdx(s => Math.min(steps.length - 1, s + 1))}
            disabled={stepIdx >= steps.length - 1}
          >
            <StepForward size={14} /> Step Forward
          </button>
        </div>
      </div>
      
      <div className="simulator-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--space-4)' }}>
        
        {/* Code View */}
        <div className="panel" style={{ background: '#0d1117', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
          {steps.map((s, i) => (
            <div 
              key={i} 
              style={{ 
                padding: 'var(--space-2)', 
                background: step.highlight === i ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                borderLeft: step.highlight === i ? '3px solid var(--accent-blue)' : '3px solid transparent',
                color: step.highlight === i ? '#fff' : '#8b949e',
                transition: 'all 0.2s'
              }}
            >
              {s.code}
            </div>
          ))}
        </div>
        
        {/* Memory View */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {step.mem.map((m, i) => (
            <div 
              key={m.name} 
              className="slide-up"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(0,0,0,0.2)', 
                border: `1px solid \${m.changed ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                position: 'relative'
              }}
            >
              <div style={{ width: 80 }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>{m.addr}</div>
                <div style={{ fontWeight: 600, color: 'var(--accent-violet)' }}>{m.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{m.type}</div>
              </div>
              
              <div style={{ 
                flex: 1, 
                textAlign: 'center', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '1.2rem',
                color: m.changed ? 'var(--accent-green)' : 'var(--text-primary)'
              }}>
                {m.val}
              </div>
              
              {/* Pointer Arrow Visualization */}
              {m.target && (
                <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center' }}>
                  <ArrowRight size={20} />
                  <span style={{ fontSize: '10px', marginLeft: 4 }}>points to {m.target}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ 
        marginTop: 'var(--space-4)', 
        padding: 'var(--space-3)', 
        background: 'rgba(59, 130, 246, 0.1)', 
        borderLeft: '4px solid var(--accent-blue)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        fontSize: 'var(--text-sm)'
      }}>
        {step.desc}
      </div>
    </div>
  );
}
