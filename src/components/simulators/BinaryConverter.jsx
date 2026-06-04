import React, { useState, useCallback, useMemo } from 'react';
import { Binary, ToggleLeft, ToggleRight, Hash, Info, RotateCcw } from 'lucide-react';

const BinaryConverter = () => {
  const [bitMode, setBitMode] = useState(8);
  const [value, setValue] = useState(0);
  const [twosComplement, setTwosComplement] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const maxVal = bitMode === 8 ? 255 : 65535;
  const totalBits = bitMode;

  const bits = useMemo(() => {
    const arr = [];
    for (let i = totalBits - 1; i >= 0; i--) {
      arr.push((value >> i) & 1);
    }
    return arr;
  }, [value, totalBits]);

  const signedValue = useMemo(() => {
    if (!twosComplement) return null;
    const msb = (value >> (totalBits - 1)) & 1;
    if (msb === 0) return value;
    return value - (1 << totalBits);
  }, [value, twosComplement, totalBits]);

  const hexStr = useMemo(() => '0x' + value.toString(16).toUpperCase().padStart(totalBits / 4, '0'), [value, totalBits]);
  const octStr = useMemo(() => '0o' + value.toString(8), [value]);
  const binStr = useMemo(() => '0b' + value.toString(2).padStart(totalBits, '0'), [value, totalBits]);

  const toggleBit = useCallback((position) => {
    const bitIndex = totalBits - 1 - position;
    setValue(prev => prev ^ (1 << bitIndex));
  }, [totalBits]);

  const handleDecimalInput = useCallback((e) => {
    const num = parseInt(e.target.value, 10);
    if (isNaN(num)) { setValue(0); return; }
    setValue(Math.max(0, Math.min(num, maxVal)));
  }, [maxVal]);

  const handleHexInput = useCallback((e) => {
    const num = parseInt(e.target.value, 16);
    if (isNaN(num)) return;
    setValue(Math.max(0, Math.min(num, maxVal)));
  }, [maxVal]);

  const reset = useCallback(() => setValue(0), []);

  const toggleMode = useCallback(() => {
    setBitMode(prev => {
      const next = prev === 8 ? 16 : 8;
      if (next === 8) setValue(v => v & 0xFF);
      return next;
    });
  }, []);

  const explanation = useMemo(() => {
    const steps = [];
    steps.push(`Decimal ${value} in binary:`);
    let remaining = value;
    const divisions = [];
    if (remaining === 0) {
      divisions.push('0 ÷ 2 = 0 remainder 0');
    } else {
      let temp = remaining;
      while (temp > 0) {
        divisions.push(`${temp} ÷ 2 = ${Math.floor(temp / 2)} remainder ${temp % 2}`);
        temp = Math.floor(temp / 2);
      }
    }
    steps.push(...divisions);
    steps.push(`Read remainders bottom-to-top: ${value.toString(2)}`);
    if (twosComplement && signedValue < 0) {
      steps.push('');
      steps.push(`Two's complement: MSB is 1 → negative`);
      steps.push(`Signed value: ${value} - ${1 << totalBits} = ${signedValue}`);
    }
    return steps;
  }, [value, twosComplement, signedValue, totalBits]);

  const getNibbleColor = (index) => {
    const nibbleGroup = Math.floor(index / 4);
    const colors = [
      'var(--accent-cyan)', 'var(--accent-violet)',
      'var(--accent-pink)', 'var(--accent-amber)'
    ];
    return colors[nibbleGroup % colors.length];
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Binary size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3>Binary Converter</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button className="btn btn-ghost btn-sm" onClick={toggleMode}>
            {bitMode}-bit
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setTwosComplement(p => !p)}
            title="Toggle two's complement">
            {twosComplement ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            <span style={{ fontSize: 'var(--text-xs)' }}>Signed</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset} title="Reset">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="simulator-body">
        {/* Input Row */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: '1 1 120px' }}>
            <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Decimal</label>
            <input className="form-input" type="number" min={0} max={maxVal}
              value={value} onChange={handleDecimalInput}
              style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: '1 1 120px' }}>
            <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Hexadecimal</label>
            <input className="form-input" type="text"
              value={value.toString(16).toUpperCase()} onChange={handleHexInput}
              style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: '1 1 120px' }}>
            <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Octal</label>
            <input className="form-input" type="text" readOnly value={value.toString(8)}
              style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }} />
          </div>
        </div>

        {/* Bit Position Labels */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-1)' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {bits.map((_, i) => (
              <div key={`lbl-${i}`} style={{
                width: 36, textAlign: 'center', fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)'
              }}>
                {totalBits - 1 - i}
              </div>
            ))}
          </div>
        </div>

        {/* Bit Cells */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
          <div className="bit-display">
            {bits.map((bit, i) => (
              <React.Fragment key={i}>
                {i > 0 && i % 4 === 0 && (
                  <div style={{ width: 8 }} />
                )}
                <div
                  className={`bit-cell ${bit === 1 ? 'active' : ''}`}
                  onClick={() => toggleBit(i)}
                  style={bit === 1 ? { borderColor: getNibbleColor(i), color: getNibbleColor(i),
                    background: `${getNibbleColor(i)}22` } : {}}
                >
                  {bit}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Nibble labels */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: totalBits / 4 }).map((_, g) => (
              <div key={`nibble-${g}`} style={{
                width: 4 * 36 + 3 * 2 + (g > 0 ? 0 : 0),
                textAlign: 'center', fontSize: 'var(--text-xs)', color: getNibbleColor(g * 4),
                fontFamily: 'var(--font-mono)', marginRight: g < totalBits / 4 - 1 ? 8 : 0,
              }}>
                Nibble {totalBits / 4 - 1 - g}
              </div>
            ))}
          </div>
        </div>

        {/* Value Display Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--space-3)', marginBottom: 'var(--space-5)'
        }}>
          {[
            { label: 'Decimal', val: twosComplement && signedValue !== null ? signedValue : value, color: 'var(--accent-blue)' },
            { label: 'Binary', val: binStr, color: 'var(--accent-cyan)' },
            { label: 'Hex', val: hexStr, color: 'var(--accent-violet)' },
            { label: 'Octal', val: octStr, color: 'var(--accent-amber)' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color, fontSize: 'var(--text-sm)' }}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* Explanation Panel */}
        <div>
          <button className="btn btn-ghost btn-sm"
            onClick={() => setShowExplanation(p => !p)}
            style={{ marginBottom: 'var(--space-2)', gap: 'var(--space-1)' }}>
            <Info size={14} />
            {showExplanation ? 'Hide' : 'Show'} Conversion Steps
          </button>
          {showExplanation && (
            <div className="explanation-box">
              {explanation.map((line, i) => (
                <div key={i} style={{
                  fontFamily: line.includes('÷') || line.includes('=') ? 'var(--font-mono)' : 'inherit',
                  fontSize: 'var(--text-xs)', lineHeight: 1.8,
                  color: line === '' ? 'transparent' : i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: i === 0 || line.startsWith('Read') || line.startsWith('Two') ? 600 : 400,
                }}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BinaryConverter;
