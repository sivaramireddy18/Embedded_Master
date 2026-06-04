import React, { useState, useMemo, useCallback } from 'react';
import { GitBranch, ChevronDown } from 'lucide-react';

const EXAMPLES = {
  'if-else': {
    label: 'If-Else Statement',
    steps: [
      { id: 's', type: 'start', label: 'Start' },
      { id: 'p1', type: 'process', label: 'Read input x' },
      { id: 'd1', type: 'decision', label: 'x > 0 ?', yes: 'p2', no: 'p3' },
      { id: 'p2', type: 'process', label: 'Print "Positive"' },
      { id: 'p3', type: 'process', label: 'Print "Non-positive"' },
      { id: 'p4', type: 'process', label: 'Continue program' },
      { id: 'e', type: 'end', label: 'End' },
    ],
  },
  'switch-case': {
    label: 'Switch-Case',
    steps: [
      { id: 's', type: 'start', label: 'Start' },
      { id: 'p1', type: 'process', label: 'Read command' },
      { id: 'd1', type: 'decision', label: 'cmd == 1?', yes: 'p2', no: 'd2' },
      { id: 'p2', type: 'process', label: 'Execute LED ON' },
      { id: 'd2', type: 'decision', label: 'cmd == 2?', yes: 'p3', no: 'p4' },
      { id: 'p3', type: 'process', label: 'Execute LED OFF' },
      { id: 'p4', type: 'process', label: 'Default: Error' },
      { id: 'p5', type: 'process', label: 'Break' },
      { id: 'e', type: 'end', label: 'End' },
    ],
  },
};

const NODE_W = 160;
const NODE_H = 48;
const DIAMOND_H = 64;
const GAP_Y = 60;
const BRANCH_OFFSET = 180;

const getNodeColor = (type, isActive) => {
  const colors = {
    start:    { fill: 'rgba(16, 185, 129, 0.15)', stroke: '#10b981', text: '#10b981' },
    end:      { fill: 'rgba(239, 68, 68, 0.15)',  stroke: '#ef4444', text: '#ef4444' },
    process:  { fill: 'rgba(59, 130, 246, 0.12)',  stroke: '#3b82f6', text: '#f0f4ff' },
    decision: { fill: 'rgba(245, 158, 11, 0.12)',  stroke: '#f59e0b', text: '#f59e0b' },
  };
  const c = colors[type] || colors.process;
  if (isActive) return { ...c, fill: c.stroke + '33', stroke: c.stroke };
  return c;
};

const FlowchartViewer = ({ steps: propSteps, activeStep: propActive }) => {
  const [selectedExample, setSelectedExample] = useState('if-else');
  const [activeStep, setActiveStep] = useState(propActive || null);

  const steps = propSteps || EXAMPLES[selectedExample]?.steps || EXAMPLES['if-else'].steps;

  // Layout computation
  const layout = useMemo(() => {
    const nodes = [];
    const arrows = [];
    let y = 30;
    const centerX = 280;
    const nodeMap = {};

    // Position nodes linearly first, handle branches for decisions
    const branchTargets = new Set();
    steps.forEach(step => {
      if (step.yes) branchTargets.add(step.yes);
      if (step.no) branchTargets.add(step.no);
    });

    // Simple layout: linear with decision branches going right
    const decisionBranches = [];
    steps.forEach((step, i) => {
      const h = step.type === 'decision' ? DIAMOND_H : NODE_H;
      const node = { ...step, x: centerX, y, w: NODE_W, h, index: i };
      nodeMap[step.id] = node;

      if (step.type === 'decision') {
        // Track yes/no targets
        decisionBranches.push({
          decisionId: step.id,
          yesId: step.yes,
          noId: step.no,
          decisionY: y
        });
      }

      nodes.push(node);
      y += h + GAP_Y;
    });

    // Reposition branched nodes to the right
    decisionBranches.forEach(db => {
      const noNode = nodeMap[db.noId];
      if (noNode) {
        noNode.x = centerX + BRANCH_OFFSET;
      }
    });

    // Generate arrows: connect sequential + decision branches
    steps.forEach((step, i) => {
      const from = nodeMap[step.id];
      if (step.type === 'decision') {
        // Yes arrow goes down
        const yesNode = nodeMap[step.yes];
        if (yesNode) {
          arrows.push({
            x1: from.x, y1: from.y + from.h / 2,
            x2: yesNode.x, y2: yesNode.y - yesNode.h / 2,
            label: 'Yes', color: '#10b981'
          });
        }
        // No arrow goes right
        const noNode = nodeMap[step.no];
        if (noNode) {
          arrows.push({
            x1: from.x + from.w / 2, y1: from.y,
            x2: noNode.x, y2: noNode.y - noNode.h / 2,
            label: 'No', color: '#ef4444', isBranch: true
          });
        }
      } else if (i < steps.length - 1) {
        const next = nodeMap[steps[i + 1].id];
        // Skip if this node is a branch target that was repositioned
        if (next && next.x === from.x) {
          arrows.push({
            x1: from.x, y1: from.y + from.h / 2,
            x2: next.x, y2: next.y - next.h / 2,
            color: '#64748b'
          });
        }
      }
    });

    // Merge arrows: branch nodes reconnect back to main flow
    decisionBranches.forEach(db => {
      const noNode = nodeMap[db.noId];
      // Find next main-flow node after the no-branch
      const noIdx = steps.findIndex(s => s.id === db.noId);
      const nextMainIdx = noIdx + 1;
      if (noNode && nextMainIdx < steps.length) {
        const nextMain = nodeMap[steps[nextMainIdx].id];
        if (nextMain && nextMain.x === centerX) {
          arrows.push({
            x1: noNode.x, y1: noNode.y + noNode.h / 2,
            x2: nextMain.x, y2: nextMain.y - nextMain.h / 2,
            color: '#64748b', isMerge: true
          });
        }
      }
    });

    const svgH = y + 20;
    const svgW = centerX + BRANCH_OFFSET + NODE_W / 2 + 40;
    return { nodes, arrows, svgW, svgH };
  }, [steps]);

  const renderNode = useCallback((node) => {
    const isActive = activeStep === node.id;
    const c = getNodeColor(node.type, isActive);
    const cx = node.x;
    const cy = node.y;

    const activeGlow = isActive ? `drop-shadow(0 0 8px ${c.stroke})` : 'none';

    if (node.type === 'decision') {
      const half = DIAMOND_H / 2;
      const hw = NODE_W / 2;
      const points = `${cx},${cy - half} ${cx + hw},${cy} ${cx},${cy + half} ${cx - hw},${cy}`;
      return (
        <g key={node.id} onClick={() => setActiveStep(node.id)}
          style={{ cursor: 'pointer', filter: activeGlow }}>
          <polygon points={points} fill={c.fill} stroke={c.stroke}
            strokeWidth={isActive ? 2.5 : 1.5} rx={4} />
          <text x={cx} y={cy + 4} textAnchor="middle" fill={c.text}
            fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">
            {node.label}
          </text>
        </g>
      );
    }

    const rx = node.type === 'start' || node.type === 'end' ? NODE_H / 2 : 6;
    return (
      <g key={node.id} onClick={() => setActiveStep(node.id)}
        style={{ cursor: 'pointer', filter: activeGlow }}>
        <rect x={cx - NODE_W / 2} y={cy - NODE_H / 2}
          width={NODE_W} height={NODE_H}
          rx={rx} fill={c.fill} stroke={c.stroke}
          strokeWidth={isActive ? 2.5 : 1.5} />
        <text x={cx} y={cy + 4} textAnchor="middle" fill={c.text}
          fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">
          {node.label}
        </text>
      </g>
    );
  }, [activeStep]);

  const renderArrow = useCallback((arrow, i) => {
    const { x1, y1, x2, y2, label, color, isBranch, isMerge } = arrow;

    let path;
    if (isBranch) {
      // Right then down
      path = `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}`;
    } else if (isMerge) {
      // Down then left then down
      const midY = y2 - GAP_Y / 3;
      path = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
    } else {
      path = `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    return (
      <g key={`arrow-${i}`}>
        <path d={path} fill="none" stroke={color} strokeWidth="1.5"
          markerEnd="url(#arrowhead)" strokeDasharray={isMerge ? '4,3' : 'none'}>
          <animate attributeName="stroke-dashoffset" from="20" to="0"
            dur="1.5s" repeatCount="indefinite" />
        </path>
        {label && (
          <text
            x={isBranch ? (x1 + x2) / 2 : x1 - 12}
            y={isBranch ? y1 - 6 : (y1 + y2) / 2}
            fill={color} fontSize="10" fontWeight="700"
            fontFamily="Inter, sans-serif" textAnchor="middle">
            {label}
          </text>
        )}
      </g>
    );
  }, []);

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <GitBranch size={18} style={{ color: 'var(--accent-amber)' }} />
          <h3>Flowchart Viewer</h3>
        </div>
        {!propSteps && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Example:</span>
            <select className="form-input" value={selectedExample}
              onChange={e => { setSelectedExample(e.target.value); setActiveStep(null); }}
              style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', width: 'auto' }}>
              {Object.entries(EXAMPLES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="simulator-body" style={{ padding: 'var(--space-3)', overflow: 'auto' }}>
        {/* Legend */}
        <div style={{
          display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-3)',
          fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', flexWrap: 'wrap'
        }}>
          {[
            { type: 'start', label: 'Start/End', shape: '●' },
            { type: 'process', label: 'Process', shape: '■' },
            { type: 'decision', label: 'Decision', shape: '◆' },
          ].map(item => (
            <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: getNodeColor(item.type, false).stroke, fontSize: 14 }}>{item.shape}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>
            Click a node to highlight
          </span>
        </div>

        <svg width="100%" height={layout.svgH}
          viewBox={`0 0 ${layout.svgW} ${layout.svgH}`}
          style={{ display: 'block', maxWidth: '100%' }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6"
              refX="7" refY="3" orient="auto" fill="#64748b">
              <polygon points="0 0, 8 3, 0 6" />
            </marker>
            {/* Active glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Animated dashes */}
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Render arrows first (behind nodes) */}
          {layout.arrows.map(renderArrow)}

          {/* Render nodes */}
          {layout.nodes.map(renderNode)}
        </svg>

        {/* Active step info */}
        {activeStep && (
          <div style={{
            marginTop: 'var(--space-3)', background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)',
            border: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)'
          }}>
            <span style={{ color: 'var(--text-tertiary)' }}>Active:</span>
            <span style={{
              fontWeight: 700, color: getNodeColor(
                steps.find(s => s.id === activeStep)?.type || 'process', true
              ).stroke
            }}>
              {steps.find(s => s.id === activeStep)?.label}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              ({steps.find(s => s.id === activeStep)?.type})
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveStep(null)}
              style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 6px' }}>
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowchartViewer;
