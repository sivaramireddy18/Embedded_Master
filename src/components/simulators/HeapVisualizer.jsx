import React, { useState } from 'react';
import { Plus, Trash2, PlayCircle, Info, RefreshCw } from 'lucide-react';

const HEAP_SIZE = 64;

const INITIAL_STATE = [
  { id: 'free-0', isFree: true, start: 0, size: HEAP_SIZE, label: 'Free' }
];

const HeapVisualizer = () => {
  const [blocks, setBlocks] = useState(INITIAL_STATE);
  const [allocationSize, setAllocationSize] = useState(8);
  const [errorMsg, setErrorMsg] = useState('');
  const [nextIdChar, setNextIdChar] = useState('A');

  const getNextLabel = (currentChar) => {
    return String.fromCharCode(currentChar.charCodeAt(0) + 1);
  };

  const malloc = (size) => {
    setErrorMsg('');
    const parsedSize = parseInt(size, 10);
    
    if (isNaN(parsedSize) || parsedSize <= 0 || parsedSize > HEAP_SIZE) {
      setErrorMsg('Invalid allocation size.');
      return;
    }

    const newBlocks = [...blocks];
    let allocated = false;

    // First-fit allocation strategy
    for (let i = 0; i < newBlocks.length; i++) {
      if (newBlocks[i].isFree && newBlocks[i].size >= parsedSize) {
        const freeBlock = newBlocks[i];
        const remainingSize = freeBlock.size - parsedSize;

        const newBlock = {
          id: `alloc-${Date.now()}-${Math.random()}`,
          isFree: false,
          start: freeBlock.start,
          size: parsedSize,
          label: `Block ${nextIdChar}`
        };

        if (remainingSize > 0) {
          const newFreeBlock = {
            id: `free-${Date.now()}-${Math.random()}`,
            isFree: true,
            start: freeBlock.start + parsedSize,
            size: remainingSize,
            label: 'Free'
          };
          newBlocks.splice(i, 1, newBlock, newFreeBlock);
        } else {
          newBlocks.splice(i, 1, newBlock);
        }

        setBlocks(newBlocks);
        setNextIdChar(getNextLabel(nextIdChar));
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      setErrorMsg(`Allocation Failed! Could not find a continuous free block of size ${parsedSize}. This is memory fragmentation.`);
    }
  };

  const free = (index) => {
    setErrorMsg('');
    const newBlocks = [...blocks];
    
    // Mark block as free
    newBlocks[index] = { 
      ...newBlocks[index], 
      isFree: true, 
      label: 'Free',
      id: `free-${Date.now()}-${Math.random()}`
    };

    // Coalesce (merge) adjacent free blocks
    let i = 0;
    while (i < newBlocks.length - 1) {
      if (newBlocks[i].isFree && newBlocks[i + 1].isFree) {
        newBlocks[i].size += newBlocks[i + 1].size;
        newBlocks.splice(i + 1, 1);
      } else {
        i++;
      }
    }
    
    setBlocks(newBlocks);
  };

  const runPreset = () => {
    const presetBlocks = [
      { id: 'p1', isFree: false, start: 0, size: 8, label: 'Block A' },
      { id: 'p2', isFree: true, start: 8, size: 12, label: 'Free' },
      { id: 'p3', isFree: false, start: 20, size: 8, label: 'Block C' },
      { id: 'p4', isFree: false, start: 28, size: 16, label: 'Block D' },
      { id: 'p5', isFree: true, start: 44, size: 20, label: 'Free' }
    ];
    setBlocks(presetBlocks);
    setNextIdChar('E');
    setErrorMsg('Fragmentation Scenario Loaded: Block B (size 12) was freed. Block D (size 16) could not fit in the freed space and was pushed further down.');
  };

  const reset = () => {
    setBlocks(INITIAL_STATE);
    setNextIdChar('A');
    setErrorMsg('');
  };

  return (
    <div className="simulator-container bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-700 shadow-xl max-w-5xl mx-auto font-sans">
      <div className="simulator-header mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Info className="text-purple-400" /> Heap Memory & Fragmentation
        </h2>
        <p className="text-slate-400 mt-2">
          Allocate and free memory blocks on the heap. Watch out for fragmentation where total free memory is sufficient but contiguous memory is not!
        </p>
      </div>

      <div className="simulator-body grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Top Panel: Visualizer (Span 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Memory Array (Total: {HEAP_SIZE} units)</h3>
              <div className="flex gap-2">
                <button 
                  onClick={reset}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
                  title="Reset Heap"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={runPreset}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded flex items-center gap-1 transition shadow-lg"
                >
                  <PlayCircle size={14} /> Load Scenario
                </button>
              </div>
            </div>

            {/* Heap Bar */}
            <div className="flex h-32 w-full rounded-lg overflow-hidden border-2 border-slate-600 bg-slate-950 relative shadow-inner">
              {blocks.map((b, i) => (
                <div
                  key={b.id}
                  className={`group relative h-full flex flex-col items-center justify-center border-r border-slate-950 transition-all duration-300 ${
                    b.isFree 
                      ? 'bg-slate-700/50 hover:bg-slate-600/60 text-slate-400' 
                      : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg z-10'
                  }`}
                  style={{ width: `${(b.size / HEAP_SIZE) * 100}%` }}
                >
                  <span className="text-sm font-bold truncate px-1 max-w-full">{b.label}</span>
                  <span className="text-xs opacity-80">{b.size} u</span>
                  
                  {!b.isFree && (
                    <button 
                      onClick={() => free(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-400 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      title="free(ptr)"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Legend / Metrics */}
            <div className="mt-4 flex gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <span>Allocated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-700/50 border border-slate-600 rounded-sm"></div>
                <span>Free Space</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className={`p-4 rounded-lg border text-sm ${
              errorMsg.includes('Failed') 
                ? 'bg-red-900/30 border-red-700 text-red-300' 
                : 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
            }`}>
              {errorMsg}
            </div>
          )}
        </div>

        {/* Right Panel: Controls & Info */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 font-mono">malloc(size)</h3>
            <div className="flex gap-2">
              <input 
                type="number"
                min="1"
                max={HEAP_SIZE}
                value={allocationSize}
                onChange={(e) => setAllocationSize(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-blue-500"
                placeholder="Size..."
              />
              <button 
                onClick={() => malloc(allocationSize)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded flex items-center gap-1 transition shadow-lg"
              >
                <Plus size={18} /> Alloc
              </button>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 text-sm">
            <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Info size={16} className="text-blue-400" /> What is Fragmentation?
            </h4>
            <p className="text-slate-400 mb-3 leading-relaxed">
              <strong>External fragmentation</strong> occurs when free memory is separated into small blocks and is interspersed by allocated memory.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Even if the <em>total</em> free memory is large enough for a new allocation, the allocator will fail if there is no single <em>contiguous</em> block large enough to fit the request.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeapVisualizer;
