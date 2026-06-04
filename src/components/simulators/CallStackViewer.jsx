import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, CornerDownRight, SquareStack } from 'lucide-react';

const steps = [
  {
    desc: 'Program starts, main() is called',
    stack: [
      { name: 'main()', vars: [{ n: 'result', v: '?' }, { n: 'a', v: '5' }] }
    ],
    codeLine: 10
  },
  {
    desc: 'main() calls calculate(5)',
    stack: [
      { name: 'main()', vars: [{ n: 'result', v: '?' }, { n: 'a', v: '5' }] },
      { name: 'calculate(x=5)', vars: [{ n: 'x', v: '5' }, { n: 'temp', v: '?' }] }
    ],
    codeLine: 11
  },
  {
    desc: 'calculate(5) initializes local var temp',
    stack: [
      { name: 'main()', vars: [{ n: 'result', v: '?' }, { n: 'a', v: '5' }] },
      { name: 'calculate(x=5)', vars: [{ n: 'x', v: '5' }, { n: 'temp', v: '10' }] }
    ],
    codeLine: 2
  },
  {
    desc: 'calculate(5) calls double_it(10)',
    stack: [
      { name: 'main()', vars: [{ n: 'result', v: '?' }, { n: 'a', v: '5' }] },
      { name: 'calculate(x=5)', vars: [{ n: 'x', v: '5' }, { n: 'temp', v: '10' }] },
      { name: 'double_it(val=10)', vars: [{ n: 'val', v: '10' }] }
    ],
    codeLine: 3
  },
  {
    desc: 'double_it(10) returns 20',
    stack: [
      { name: 'main()', vars: [{ n: 'result', v: '?' }, { n: 'a', v: '5' }] },
      { name: 'calculate(x=5)', vars: [{ n: 'x', v: '5' }, { n: 'temp', v: '10' }] },
      { name: 'double_it(val=10)', vars: [{ n: 'val', v: '10' }], returning: 20 }
    ],
    codeLine: 7
  },
  {
    desc: 'double_it() frame popped. calculate(5) resumes',
    stack: [
      { name: 'main()', vars: [{ n: 'result', v: '?' }, { n: 'a', v: '5' }] },
      { name: 'calculate(x=5)', vars: [{ n: 'x', v: '5' }, { n: 'temp', v: '10' }, { n: 'return', v: '25' }] }
    ],
    codeLine: 4
  },
  {
    desc: 'calculate() returns 25 to main()',
    stack: [
      { name: 'main()', vars: [{ n: 'result', v: '25' }, { n: 'a', v: '5' }] }
    ],
    codeLine: 11
  },
  {
    desc: 'Program ends, main() frame popped',
    stack: [],
    codeLine: 12
  }
];

export default function CallStackViewer() {
  const [stepIdx, setStepIdx] = useState(0);
  
  const step = steps[stepIdx];
  const maxStackHeight = 4;
  
  return (
    <div className="simulator-container glass-card no-hover">
      <div className="simulator-header">
        <h3><SquareStack size={20} /> Call Stack Viewer</h3>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setStepIdx(0)}>
            <RotateCcw size={14} /> Reset
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setStepIdx(s => Math.min(steps.length - 1, s + 1))}
            disabled={stepIdx >= steps.length - 1}
          >
            <StepForward size={14} /> Step
          </button>
        </div>
      </div>
      
      <div className="simulator-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        
        {/* Code Panel */}
        <div className="panel" style={{ background: '#0d1117', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <div style={{ color: '#8b949e', marginBottom: 'var(--space-2)' }}>// Source Code</div>
          <div style={{ color: '#c9d1d9', lineHeight: 1.6 }}>
            <div style={{ display: 'flex' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>1</span>
              <span><span style={{ color: '#ff7b72' }}>int</span> <span style={{ color: '#d2a8ff' }}>calculate</span>(<span style={{ color: '#ff7b72' }}>int</span> x) {'{'}</span>
            </div>
            <div style={{ display: 'flex', background: step.codeLine === 2 ? 'rgba(210, 168, 255, 0.15)' : 'transparent' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>2</span>
              <span>    <span style={{ color: '#ff7b72' }}>int</span> temp = x + <span style={{ color: '#79c0ff' }}>5</span>;</span>
            </div>
            <div style={{ display: 'flex', background: step.codeLine === 3 ? 'rgba(210, 168, 255, 0.15)' : 'transparent' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>3</span>
              <span>    <span style={{ color: '#ff7b72' }}>int</span> res = <span style={{ color: '#d2a8ff' }}>double_it</span>(temp);</span>
            </div>
            <div style={{ display: 'flex', background: step.codeLine === 4 ? 'rgba(210, 168, 255, 0.15)' : 'transparent' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>4</span>
              <span>    <span style={{ color: '#ff7b72' }}>return</span> res + x;</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>5</span>
              <span>{'}'}</span>
            </div>
            
            <div style={{ display: 'flex' }}><span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>6</span></div>
            
            <div style={{ display: 'flex' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>7</span>
              <span><span style={{ color: '#ff7b72' }}>int</span> <span style={{ color: '#d2a8ff' }}>double_it</span>(<span style={{ color: '#ff7b72' }}>int</span> val) {'{'}</span>
            </div>
            <div style={{ display: 'flex', background: step.codeLine === 7 ? 'rgba(210, 168, 255, 0.15)' : 'transparent' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>8</span>
              <span>    <span style={{ color: '#ff7b72' }}>return</span> val * <span style={{ color: '#79c0ff' }}>2</span>;</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>9</span>
              <span>{'}'}</span>
            </div>
            
            <div style={{ display: 'flex' }}><span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>10</span></div>
            
            <div style={{ display: 'flex', background: step.codeLine === 10 ? 'rgba(210, 168, 255, 0.15)' : 'transparent' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>11</span>
              <span><span style={{ color: '#ff7b72' }}>int</span> <span style={{ color: '#d2a8ff' }}>main</span>() {'{'}</span>
            </div>
            <div style={{ display: 'flex', background: step.codeLine === 11 ? 'rgba(210, 168, 255, 0.15)' : 'transparent' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>12</span>
              <span>    <span style={{ color: '#ff7b72' }}>int</span> a = <span style={{ color: '#79c0ff' }}>5</span>;</span>
            </div>
            <div style={{ display: 'flex', background: step.codeLine === 12 ? 'rgba(210, 168, 255, 0.15)' : 'transparent' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>13</span>
              <span>    <span style={{ color: '#ff7b72' }}>int</span> result = <span style={{ color: '#d2a8ff' }}>calculate</span>(a);</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>14</span>
              <span>    <span style={{ color: '#ff7b72' }}>return</span> <span style={{ color: '#79c0ff' }}>0</span>;</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ width: 30, color: '#484f58', userSelect: 'none' }}>15</span>
              <span>{'}'}</span>
            </div>
          </div>
        </div>
        
        {/* Stack Panel */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>The Call Stack (LIFO)</div>
          
          <div style={{ 
            flex: 1, 
            border: '2px solid rgba(255,255,255,0.1)', 
            borderTop: 'none', 
            borderRadius: '0 0 8px 8px',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'flex-start',
            gap: 'var(--space-2)',
            background: 'rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            {step.stack.map((frame, i) => (
              <div 
                key={i} 
                className="stack-frame slide-up" 
                style={{ 
                  background: i === step.stack.length - 1 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${i === step.stack.length - 1 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative'
                }}
              >
                <div style={{ fontWeight: 600, color: i === step.stack.length - 1 ? 'var(--accent-violet)' : 'var(--text-secondary)', marginBottom: 'var(--space-2)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 'var(--space-1)' }}>
                  {frame.name} {i === step.stack.length - 1 && <span style={{ fontSize: '10px', float: 'right', background: 'var(--accent-violet)', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>ACTIVE</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {frame.vars.map((v, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>{v.n}:</span>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{v.v}</span>
                    </div>
                  ))}
                  {frame.returning !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: 'var(--space-1)' }}>
                      <span style={{ color: 'var(--accent-green)' }}>return:</span>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{frame.returning}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {step.stack.length === 0 && (
              <div style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                Stack is empty
              </div>
            )}
            
            {/* Top of stack marker */}
            {step.stack.length > 0 && (
              <div style={{ position: 'absolute', top: -30, right: 10, display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-violet)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                Stack Pointer <CornerDownRight size={14} style={{ transform: 'rotate(90deg)' }} />
              </div>
            )}
          </div>
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
        <strong>Step {stepIdx + 1}:</strong> {step.desc}
      </div>
    </div>
  );
}
