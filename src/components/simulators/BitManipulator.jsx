import React, { useState, useMemo, useCallback } from 'react';
import { Cpu, ChevronDown, Code2, Zap, RotateCcw } from 'lucide-react';

const OPERATIONS = ['AND', 'OR', 'XOR', 'NOT', 'Left Shift', 'Right Shift'];

const PRESETS = [
  { label: 'Set bit N',    getCode: n => `reg |= (1 << ${n})`,    apply: (a, n) => a | (1 << n) },
  { label: 'Clear bit N',  getCode: n => `reg &= ~(1 << ${n})`,   apply: (a, n) => a & ~(1 << n) & 0xFF },
  { label: 'Toggle bit N', getCode: n => `reg ^= (1 << ${n})`,    apply: (a, n) => a ^ (1 << n) },
  { label: 'Check bit N',  getCode: n => `(reg >> ${n}) & 1`,     apply: (a, n) => (a >> n) & 1 },
];

const toBin = (v) => v.toString(2).padStart(8, '0');
const toHex = (v) => '0x' + (v & 0xFF).toString(16).toUpperCase().padStart(2, '0');

const BitRegister = ({ label, value, onChange, color, readOnly = false }) => {
  const bits = [];
  for (let i = 7; i >= 0; i--) bits.push((value >> i) & 1);

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--space-1)'
      }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          {toHex(value)} = {value}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
        {/* Position labels */}
      </div>
      <div className="bit-display" style={{ justifyContent: 'center' }}>
        {bits.map((bit, i) => (
          <div key={i}
            className={`bit-cell ${bit ? 'active' : ''}`}
            onClick={() => !readOnly && onChange(value ^ (1 << (7 - i)))}
            style={{
              cursor: readOnly ? 'default' : 'pointer',
              ...(bit ? { borderColor: color, color, background: `${color}22` } : {})
            }}
          >
            {bit}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: 2 }}>
        {[7, 6, 5, 4, 3, 2, 1, 0].map(pos => (
          <div key={pos} style={{
            width: 36, textAlign: 'center', fontSize: '10px',
            color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)'
          }}>{pos}</div>
        ))}
      </div>
    </div>
  );
};

const BitManipulator = () => {
  const [regA, setRegA] = useState(0b11001010);
  const [regB, setRegB] = useState(0b10110101);
  const [operation, setOperation] = useState('AND');
  const [shiftAmount, setShiftAmount] = useState(1);
  const [presetBitN, setPresetBitN] = useState(3);
  const [showPresets, setShowPresets] = useState(false);

  const result = useMemo(() => {
    switch (operation) {
      case 'AND': return (regA & regB) & 0xFF;
      case 'OR':  return (regA | regB) & 0xFF;
      case 'XOR': return (regA ^ regB) & 0xFF;
      case 'NOT': return (~regA) & 0xFF;
      case 'Left Shift':  return (regA << shiftAmount) & 0xFF;
      case 'Right Shift': return (regA >> shiftAmount) & 0xFF;
      default: return 0;
    }
  }, [regA, regB, operation, shiftAmount]);

  const cCode = useMemo(() => {
    switch (operation) {
      case 'AND': return `result = A & B;  // ${toHex(regA)} & ${toHex(regB)} = ${toHex(result)}`;
      case 'OR':  return `result = A | B;  // ${toHex(regA)} | ${toHex(regB)} = ${toHex(result)}`;
      case 'XOR': return `result = A ^ B;  // ${toHex(regA)} ^ ${toHex(regB)} = ${toHex(result)}`;
      case 'NOT': return `result = ~A;     // ~${toHex(regA)} = ${toHex(result)}`;
      case 'Left Shift':  return `result = A << ${shiftAmount};  // ${toHex(regA)} << ${shiftAmount} = ${toHex(result)}`;
      case 'Right Shift': return `result = A >> ${shiftAmount};  // ${toHex(regA)} >> ${shiftAmount} = ${toHex(result)}`;
      default: return '';
    }
  }, [operation, regA, regB, result, shiftAmount]);

  const explanation = useMemo(() => {
    const lines = [];
    const aBin = toBin(regA), bBin = toBin(regB), rBin = toBin(result);
    lines.push(`  A = ${aBin}  (${toHex(regA)})`);
    if (operation !== 'NOT' && !operation.includes('Shift')) {
      lines.push(`  B = ${aBin.replace(/./g, ' ').slice(0, -bBin.length)}${bBin}  (${toHex(regB)})`);
    }
    const opSymbol = { AND: '&', OR: '|', XOR: '^', NOT: '~', 'Left Shift': '<<', 'Right Shift': '>>' }[operation];
    lines.push(`${opSymbol.padStart(3)} ${'─'.repeat(8)}`);
    lines.push(`  R = ${rBin}  (${toHex(result)})`);
    lines.push('');
    switch (operation) {
      case 'AND': lines.push('Each bit: 1 only if BOTH bits are 1'); break;
      case 'OR':  lines.push('Each bit: 1 if EITHER bit is 1'); break;
      case 'XOR': lines.push('Each bit: 1 if bits DIFFER'); break;
      case 'NOT': lines.push('Each bit: flipped (0→1, 1→0)'); break;
      case 'Left Shift': lines.push(`Bits shift left by ${shiftAmount}, zeros fill from right`); break;
      case 'Right Shift': lines.push(`Bits shift right by ${shiftAmount}, zeros fill from left`); break;
    }
    return lines;
  }, [regA, regB, result, operation, shiftAmount]);

  const reset = useCallback(() => { setRegA(0); setRegB(0); }, []);

  const applyPreset = useCallback((preset) => {
    const res = preset.apply(regA, presetBitN);
    setRegA(res & 0xFF);
  }, [regA, presetBitN]);

  const needsB = operation !== 'NOT' && !operation.includes('Shift');
  const needsShift = operation.includes('Shift');

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Cpu size={18} style={{ color: 'var(--accent-green)' }} />
          <h3>Bit Manipulator</h3>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowPresets(p => !p)}>
            <Zap size={14} /> Presets
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="simulator-body">
        {/* Operation Selector */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
          {OPERATIONS.map(op => (
            <button key={op}
              className={`btn btn-sm ${operation === op ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setOperation(op)}>
              {op}
            </button>
          ))}
          {needsShift && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>by</span>
              <select className="form-input" value={shiftAmount}
                onChange={e => setShiftAmount(Number(e.target.value))}
                style={{ width: 50, padding: '2px 4px', fontSize: 'var(--text-xs)' }}>
                {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Registers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <BitRegister label="Register A" value={regA} onChange={setRegA} color="var(--accent-cyan)" />

          {needsB && (
            <BitRegister label="Register B" value={regB} onChange={setRegB} color="var(--accent-violet)" />
          )}

          {/* Operation Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: '0 var(--space-2)'
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)',
              color: 'var(--accent-amber)', padding: '2px 12px',
              background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)'
            }}>
              {operation}
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          </div>

          <BitRegister label="Result" value={result} onChange={() => {}} color="var(--accent-green)" readOnly />
        </div>

        {/* C Code Equivalent */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)'
          }}>
            <Code2 size={12} /> C Equivalent
          </div>
          <code style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            color: 'var(--accent-green)', background: 'none', padding: 0
          }}>
            {cCode}
          </code>
        </div>

        {/* Step-by-step */}
        <div className="explanation-box" style={{ marginBottom: 'var(--space-4)' }}>
          {explanation.map((line, i) => (
            <div key={i} style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              lineHeight: 1.8, whiteSpace: 'pre',
              color: line.startsWith('  R') ? 'var(--accent-green)' :
                     line.includes('─') ? 'var(--text-tertiary)' :
                     i === explanation.length - 1 ? 'var(--accent-amber)' : 'var(--text-secondary)',
              fontWeight: i === explanation.length - 1 ? 600 : 400,
            }}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>

        {/* Presets Panel */}
        {showPresets && (
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)', border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              marginBottom: 'var(--space-3)'
            }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                Common Embedded Operations
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>N =</span>
                <select className="form-input" value={presetBitN}
                  onChange={e => setPresetBitN(Number(e.target.value))}
                  style={{ width: 44, padding: '1px 4px', fontSize: 'var(--text-xs)' }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              {PRESETS.map((preset) => (
                <button key={preset.label} className="btn btn-secondary btn-sm"
                  onClick={() => applyPreset(preset)}
                  style={{ justifyContent: 'flex-start', textAlign: 'left', flexDirection: 'column', alignItems: 'flex-start', padding: 'var(--space-2) var(--space-3)', height: 'auto' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{preset.label}</span>
                  <code style={{ fontSize: '10px', background: 'none', padding: 0, color: 'var(--accent-green)' }}>
                    {preset.getCode(presetBitN)}
                  </code>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BitManipulator;
