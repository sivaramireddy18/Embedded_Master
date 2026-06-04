import React, { useState, useMemo, useCallback } from 'react';
import { MemoryStick, Plus, Trash2, Eye, X } from 'lucide-react';

const TYPE_COLORS = {
  int:     { bg: 'rgba(59, 130, 246, 0.12)',  border: 'var(--accent-blue)',   label: 'Blue' },
  char:    { bg: 'rgba(16, 185, 129, 0.12)',  border: 'var(--accent-green)',  label: 'Green' },
  float:   { bg: 'rgba(139, 92, 246, 0.12)',  border: 'var(--accent-violet)', label: 'Purple' },
  pointer: { bg: 'rgba(245, 158, 11, 0.12)',  border: 'var(--accent-amber)',  label: 'Orange' },
  short:   { bg: 'rgba(236, 72, 153, 0.12)',  border: 'var(--accent-pink)',   label: 'Pink' },
  double:  { bg: 'rgba(6, 182, 212, 0.12)',   border: 'var(--accent-cyan)',   label: 'Cyan' },
};

const TYPE_SIZES = { char: 1, short: 2, int: 4, float: 4, double: 8, pointer: 4 };

const defaultVars = [
  { name: 'counter', type: 'int', value: 42, address: 0x1000 },
  { name: 'flag', type: 'char', value: 65, address: 0x1004 },
  { name: 'ratio', type: 'float', value: 3.14, address: 0x1008 },
  { name: 'ptr', type: 'pointer', value: 0x1000, address: 0x100C },
];

const toBytes = (type, value) => {
  const size = TYPE_SIZES[type] || 4;
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  if (type === 'float') view.setFloat32(0, value, true);
  else if (type === 'double') view.setFloat64(0, value, true);
  else if (type === 'char') view.setUint8(0, value & 0xFF);
  else if (type === 'short') view.setInt16(0, value, true);
  else view.setInt32(0, value, true);
  return Array.from(new Uint8Array(buf)).slice(0, size);
};

const MemoryViewer = ({ variables: propVars }) => {
  const [variables, setVariables] = useState(propVars || defaultVars);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'int', value: '0', address: '' });

  const memoryMap = useMemo(() => {
    const map = new Map();
    variables.forEach(v => {
      const bytes = toBytes(v.type, v.value);
      bytes.forEach((byte, i) => {
        map.set(v.address + i, { byte, variable: v, offset: i, total: bytes.length });
      });
    });
    return map;
  }, [variables]);

  const segments = useMemo(() => {
    const allAddrs = variables.map(v => v.address);
    const minAddr = Math.min(...allAddrs);
    const maxAddr = Math.max(...allAddrs) + 8;
    const startRow = Math.floor(minAddr / 16) * 16;
    const endRow = Math.ceil(maxAddr / 16) * 16;
    const rows = [];
    for (let addr = startRow; addr < endRow; addr += 16) {
      rows.push(addr);
    }
    return rows;
  }, [variables]);

  const getSegmentLabel = (addr) => {
    if (addr >= 0x2000) return { label: 'STACK', color: 'var(--accent-red)' };
    if (addr >= 0x1000) return { label: 'HEAP', color: 'var(--accent-amber)' };
    if (addr >= 0x0800) return { label: 'DATA', color: 'var(--accent-green)' };
    return { label: 'TEXT', color: 'var(--accent-blue)' };
  };

  const addVariable = useCallback(() => {
    const addr = parseInt(form.address, 16) || (Math.max(...variables.map(v => v.address)) + 16);
    const val = form.type === 'float' || form.type === 'double'
      ? parseFloat(form.value) : parseInt(form.value, 10);
    setVariables(prev => [...prev, { name: form.name || 'var', type: form.type, value: val || 0, address: addr }]);
    setForm({ name: '', type: 'int', value: '0', address: '' });
    setShowForm(false);
  }, [form, variables]);

  const removeVariable = useCallback((name) => {
    setVariables(prev => prev.filter(v => v.name !== name));
  }, []);

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <MemoryStick size={18} style={{ color: 'var(--accent-violet)' }} />
          <h3>Memory Viewer</h3>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(p => !p)}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showForm ? 'Cancel' : 'Add Variable'}</span>
        </button>
      </div>

      <div className="simulator-body">
        {/* Add Variable Form */}
        {showForm && (
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)', marginBottom: 'var(--space-4)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: '1 1 100px' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Name</label>
                <input className="form-input" value={form.name} placeholder="myVar"
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Type</label>
                <select className="form-input" value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {Object.keys(TYPE_COLORS).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Value</label>
                <input className="form-input" value={form.value}
                  onChange={e => setForm(p => ({ ...p, value: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: '1 1 80px' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Address (hex)</label>
                <input className="form-input" value={form.address} placeholder="auto"
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <button className="btn btn-primary btn-sm" onClick={addVariable}>Add</button>
            </div>
          </div>
        )}

        {/* Variable Legend */}
        <div style={{
          display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap',
          marginBottom: 'var(--space-4)', fontSize: 'var(--text-xs)'
        }}>
          {variables.map(v => {
            const tc = TYPE_COLORS[v.type] || TYPE_COLORS.int;
            return (
              <div key={v.name} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                background: tc.bg, border: `1px solid ${tc.border}`,
                borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: tc.border
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{v.name}</span>
                <span style={{ opacity: 0.7 }}>({v.type}={v.type === 'pointer' ? '0x' + v.value.toString(16) : v.value})</span>
                <button onClick={() => removeVariable(v.name)}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                  <Trash2 size={10} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Memory Grid */}
        <div style={{ overflowX: 'auto' }}>
          {/* Column headers */}
          <div style={{ display: 'flex', gap: '1px', marginBottom: '1px', paddingLeft: 88 }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                width: 38, textAlign: 'center', fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontWeight: 600
              }}>
                +{i.toString(16).toUpperCase()}
              </div>
            ))}
          </div>

          {segments.map(rowAddr => {
            const seg = getSegmentLabel(rowAddr);
            return (
              <div key={rowAddr} style={{ display: 'flex', gap: '1px', marginBottom: '1px' }}>
                {/* Segment label */}
                <div style={{
                  width: 42, fontSize: '9px', fontWeight: 700, color: seg.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  letterSpacing: '0.05em', writingMode: 'vertical-lr', textOrientation: 'mixed',
                  transform: 'rotate(180deg)'
                }}>
                  {seg.label}
                </div>
                {/* Address */}
                <div className="memory-address" style={{
                  display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)', minWidth: 44
                }}>
                  {`0x${rowAddr.toString(16).toUpperCase().padStart(4, '0')}`}
                </div>
                {/* 16 bytes */}
                {Array.from({ length: 16 }).map((_, col) => {
                  const addr = rowAddr + col;
                  const cell = memoryMap.get(addr);
                  const tc = cell ? (TYPE_COLORS[cell.variable.type] || TYPE_COLORS.int) : null;
                  const isHovered = hoveredCell && hoveredCell.address === cell?.variable.address;
                  return (
                    <div key={col}
                      onMouseEnter={() => cell && setHoveredCell(cell.variable)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`memory-value ${cell ? 'highlight' : ''}`}
                      style={{
                        width: 38, textAlign: 'center', fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)', position: 'relative', cursor: cell ? 'pointer' : 'default',
                        background: cell ? tc.bg : 'var(--bg-surface)',
                        color: cell ? tc.border : 'var(--text-muted)',
                        borderBottom: cell && cell.offset === 0 ? `2px solid ${tc.border}` : undefined,
                        fontWeight: cell ? 600 : 400,
                        outline: isHovered ? `1px solid ${tc?.border}` : 'none',
                        transition: 'all 150ms ease'
                      }}>
                      {cell ? cell.byte.toString(16).toUpperCase().padStart(2, '0') : '00'}
                      {/* Tooltip */}
                      {isHovered && cell?.offset === 0 && (
                        <div style={{
                          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                          transform: 'translateX(-50%)', background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
                          padding: 'var(--space-2) var(--space-3)', whiteSpace: 'nowrap',
                          zIndex: 500, boxShadow: 'var(--shadow-lg)', fontSize: 'var(--text-xs)',
                          color: 'var(--text-primary)', textAlign: 'left'
                        }}>
                          <div style={{ fontWeight: 700, marginBottom: 2 }}>{cell.variable.name}</div>
                          <div>Type: <span style={{ color: tc.border }}>{cell.variable.type}</span></div>
                          <div>Value: {cell.variable.type === 'pointer'
                            ? '0x' + cell.variable.value.toString(16) : cell.variable.value}</div>
                          <div>Addr: 0x{cell.variable.address.toString(16).toUpperCase()}</div>
                          <div>Size: {TYPE_SIZES[cell.variable.type]} byte(s)</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Type Legend */}
        <div style={{
          display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)',
          fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', flexWrap: 'wrap'
        }}>
          {Object.entries(TYPE_COLORS).map(([type, c]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c.border }} />
              <span>{type} ({TYPE_SIZES[type]}B)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryViewer;
