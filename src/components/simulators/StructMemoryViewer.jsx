import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Zap, RefreshCw, Info } from 'lucide-react';

const INITIAL_FIELDS = [
  { id: 'f1', type: 'char', name: 'a', size: 1, align: 1, color: '#3b82f6' }, // blue-500
  { id: 'f2', type: 'int', name: 'b', size: 4, align: 4, color: '#22c55e' }, // green-500
  { id: 'f3', type: 'short', name: 'c', size: 2, align: 2, color: '#eab308' } // yellow-500
];

const StructMemoryViewer = () => {
  const [fields, setFields] = useState(INITIAL_FIELDS);

  const moveField = (index, direction) => {
    const newFields = [...fields];
    if (direction === 'up' && index > 0) {
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
    }
    setFields(newFields);
  };

  const optimizeLayout = () => {
    // Sort by alignment descending (largest alignment first)
    const sorted = [...fields].sort((a, b) => b.align - a.align);
    setFields(sorted);
  };

  const resetLayout = () => {
    setFields(INITIAL_FIELDS);
  };

  // Calculate memory layout
  const layout = useMemo(() => {
    const memory = [];
    let offset = 0;
    let maxAlign = 1;
    let usedBytes = 0;
    let padBytes = 0;

    fields.forEach(field => {
      maxAlign = Math.max(maxAlign, field.align);
      const padding = (field.align - (offset % field.align)) % field.align;
      
      // Add padding bytes
      for (let i = 0; i < padding; i++) {
        memory.push({ type: 'pad', offset: offset + i });
        padBytes++;
      }
      offset += padding;
      
      // Add field data bytes
      for (let i = 0; i < field.size; i++) {
        memory.push({ type: 'data', field, offset: offset + i, isFirst: i === 0 });
        usedBytes++;
      }
      offset += field.size;
    });

    // Add tail padding for struct alignment
    const tailPadding = (maxAlign - (offset % maxAlign)) % maxAlign;
    for (let i = 0; i < tailPadding; i++) {
      memory.push({ type: 'pad', offset: offset + i });
      padBytes++;
    }
    offset += tailPadding;

    return { memory, totalSize: offset, usedBytes, padBytes, maxAlign };
  }, [fields]);

  return (
    <div className="simulator-container bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-700 shadow-xl max-w-4xl mx-auto font-sans">
      <div className="simulator-header mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="text-yellow-400" /> Struct Memory Alignment
        </h2>
        <p className="text-slate-400 mt-2">
          Visualize how the C compiler aligns struct members in memory by inserting padding bytes (4-byte alignment).
        </p>
      </div>

      <div className="simulator-body grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Panel: Struct Definition & Controls */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-200 font-mono">struct Example {'{'}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={resetLayout}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
                  title="Reset Layout"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={optimizeLayout}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded flex items-center gap-1 transition shadow-lg"
                >
                  <Zap size={14} /> Optimize
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4 font-mono pl-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-700">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: field.color }}
                    ></span>
                    <span className="text-blue-300">{field.type}</span>
                    <span className="text-slate-300">{field.name};</span>
                    <span className="text-slate-500 text-xs ml-2">// {field.size} byte{field.size > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => moveField(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveField(index, 'down')}
                      disabled={index === fields.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-slate-200 font-mono">{'};'}</h3>
          </div>

          {/* Stats Panel */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
            <h4 className="font-semibold text-slate-300 flex items-center gap-2">
              <Info size={16} /> Memory Footprint
            </h4>
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded text-sm">
              <span className="text-slate-400">Total Size:</span>
              <span className="font-mono font-bold text-lg">{layout.totalSize} bytes</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded text-sm">
              <span className="text-slate-400">Used Data:</span>
              <span className="font-mono text-green-400">{layout.usedBytes} bytes</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded text-sm">
              <span className="text-slate-400">Padding:</span>
              <span className="font-mono text-red-400">{layout.padBytes} bytes</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Memory Grid Visualization */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-200 mb-6 w-full text-center">Memory Layout (32-bit architecture)</h3>
          
          <div className="w-full max-w-[280px]">
            {/* Header row */}
            <div className="grid grid-cols-4 gap-1 mb-2 text-center text-xs font-mono text-slate-500">
              <div>+0</div>
              <div>+1</div>
              <div>+2</div>
              <div>+3</div>
            </div>
            
            {/* Memory bytes grid - chunk into 4 columns */}
            <div className="grid grid-cols-4 gap-1">
              {layout.memory.map((byte, idx) => {
                if (byte.type === 'pad') {
                  return (
                    <div 
                      key={`pad-${idx}`}
                      className="aspect-square flex items-center justify-center text-xs font-mono font-bold text-slate-500 rounded border border-slate-600 relative overflow-hidden"
                      style={{
                        background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 5px, #334155 5px, #334155 10px)'
                      }}
                      title={`Offset ${byte.offset}: Padding byte`}
                    >
                      PAD
                    </div>
                  );
                }
                
                return (
                  <div 
                    key={`data-${idx}`}
                    className="aspect-square flex items-center justify-center text-xs font-mono font-bold text-slate-900 rounded border border-black/20 shadow-inner"
                    style={{ backgroundColor: byte.field.color }}
                    title={`Offset ${byte.offset}: ${byte.field.name} (byte ${byte.offset % byte.field.align})`}
                  >
                    {byte.isFirst ? byte.field.name : ''}
                  </div>
                );
              })}
            </div>
          </div>
          
          {layout.padBytes === 0 ? (
            <div className="mt-8 px-4 py-3 bg-green-900/30 border border-green-700 text-green-300 rounded-lg text-sm text-center">
              Great! The struct is fully packed with no padding overhead.
            </div>
          ) : (
            <div className="mt-8 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-lg text-sm text-center">
              Hint: Reorder members from largest to smallest alignment to minimize padding.
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default StructMemoryViewer;
