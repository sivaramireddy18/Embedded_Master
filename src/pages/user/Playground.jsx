import React, { useState, useRef } from 'react';
import { Play, RotateCcw, Copy, Download, Terminal } from 'lucide-react';

const defaultCode = `#include <stdio.h>

int main() {
    printf("Hello, EmbedMaster! ⚡\\n");
    
    // Variables and types
    int x = 42;
    float pi = 3.14159;
    char grade = 'A';
    
    printf("Integer: %d\\n", x);
    printf("Float: %.2f\\n", pi);
    printf("Character: %c\\n", grade);
    printf("Size of int: %lu bytes\\n", sizeof(int));
    printf("Size of float: %lu bytes\\n", sizeof(float));
    printf("Size of char: %lu bytes\\n", sizeof(char));
    
    return 0;
}`;

const presets = [
  {
    name: 'Hello World',
    code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
  },
  {
    name: 'Variables & Types',
    code: defaultCode
  },
  {
    name: 'Pointers',
    code: `#include <stdio.h>\n\nint main() {\n    int x = 10;\n    int *ptr = &x;\n    \n    printf("Value of x: %d\\n", x);\n    printf("Address of x: %p\\n", (void*)&x);\n    printf("Value of ptr: %p\\n", (void*)ptr);\n    printf("Value at ptr: %d\\n", *ptr);\n    \n    *ptr = 20;\n    printf("After *ptr = 20, x = %d\\n", x);\n    \n    return 0;\n}`
  },
  {
    name: 'Bitwise Operations',
    code: `#include <stdio.h>\n\nvoid printBinary(unsigned int n) {\n    for (int i = 7; i >= 0; i--)\n        printf("%d", (n >> i) & 1);\n    printf("\\n");\n}\n\nint main() {\n    unsigned int a = 0xA5; // 10100101\n    unsigned int b = 0x3C; // 00111100\n    \n    printf("a     = 0x%02X = ", a); printBinary(a);\n    printf("b     = 0x%02X = ", b); printBinary(b);\n    printf("a & b = 0x%02X = ", a & b); printBinary(a & b);\n    printf("a | b = 0x%02X = ", a | b); printBinary(a | b);\n    printf("a ^ b = 0x%02X = ", a ^ b); printBinary(a ^ b);\n    printf("~a    = 0x%02X = ", (unsigned char)~a); printBinary((unsigned char)~a);\n    \n    // Set bit 1\n    unsigned int reg = 0x00;\n    reg |= (1 << 1);\n    printf("\\nSet bit 1: 0x%02X = ", reg); printBinary(reg);\n    \n    return 0;\n}`
  },
  {
    name: 'Structures',
    code: `#include <stdio.h>\n#include <string.h>\n\ntypedef struct {\n    char name[50];\n    int id;\n    float salary;\n} Employee;\n\nint main() {\n    Employee emp1;\n    strcpy(emp1.name, "John Doe");\n    emp1.id = 1001;\n    emp1.salary = 75000.50;\n    \n    printf("Employee Details:\\n");\n    printf("Name: %s\\n", emp1.name);\n    printf("ID: %d\\n", emp1.id);\n    printf("Salary: $%.2f\\n", emp1.salary);\n    printf("Size of Employee: %lu bytes\\n", sizeof(Employee));\n    \n    return 0;\n}`
  },
  {
    name: 'Arrays',
    code: `#include <stdio.h>\n\nint main() {\n    int numbers[5] = {10, 20, 30, 40, 50};\n    int sum = 0;\n    \n    printf("Array elements:\\n");\n    for(int i = 0; i < 5; i++) {\n        printf("numbers[%d] = %d\\n", i, numbers[i]);\n        sum += numbers[i];\n    }\n    \n    printf("\\nTotal Sum: %d\\n", sum);\n    return 0;\n}`
  },
  {
    name: 'Strings',
    code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char greeting[50] = "Hello";\n    char name[] = " EmbedMaster!";\n    \n    strcat(greeting, name);\n    \n    printf("Message: %s\\n", greeting);\n    printf("Length: %lu characters\\n", strlen(greeting));\n    \n    return 0;\n}`
  }
];

// Simulated C execution for common patterns
function simulateExecution(code) {
  const output = [];
  const printfRegex = /printf\s*\(\s*"([^"]*)"(?:\s*,\s*([^)]+))?\s*\)/g;
  let match;

  // Simple printf simulation
  while ((match = printfRegex.exec(code)) !== null) {
    let formatStr = match[1];
    formatStr = formatStr.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

    if (match[2]) {
      // Has arguments — do basic substitution
      const args = match[2].split(',').map(a => a.trim());
      let argIdx = 0;
      formatStr = formatStr.replace(/%[-+0 #]*\d*\.?\d*[diouxXeEfFgGaAcspn%lu]*/g, (fmt) => {
        if (fmt === '%%') return '%';
        const arg = args[argIdx++] || '?';
        // Try to evaluate simple expressions
        if (fmt.includes('d') || fmt.includes('i') || fmt.includes('lu')) {
          if (arg.includes('sizeof(int)')) return '4';
          if (arg.includes('sizeof(float)')) return '4';
          if (arg.includes('sizeof(char)')) return '1';
          if (arg.includes('sizeof')) return '4';
          const numMatch = code.match(new RegExp(arg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=\\s*(\\d+)'));
          if (numMatch) return numMatch[1];
          return arg;
        }
        if (fmt.includes('f')) {
          const numMatch = code.match(new RegExp(arg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=\\s*([\\d.]+)'));
          if (numMatch) {
            const precision = fmt.match(/\.(\d+)/);
            return parseFloat(numMatch[1]).toFixed(precision ? parseInt(precision[1]) : 6);
          }
          return arg;
        }
        if (fmt.includes('c')) {
          const charMatch = code.match(new RegExp(arg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\s*=\\s*'(.)'"));
          if (charMatch) return charMatch[1];
          return arg;
        }
        if (fmt.includes('s')) return arg.replace(/"/g, '');
        if (fmt.includes('p')) return '0x7ffd4a2c';
        if (fmt.includes('X') || fmt.includes('x')) return arg;
        return arg;
      });
    }

    output.push(formatStr);
  }

  if (output.length === 0) {
    return 'Program compiled successfully.\n(Note: This is a simulated execution. Complex C programs require a full compiler.)';
  }

  return output.join('');
}

export default function Playground() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef(null);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Compiling and running...');
    
    try {
      const response = await fetch('https://emacs.piston.rs/api/v2/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'c',
          version: '10.2.0',
          files: [{ content: code }]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.run && data.run.output !== undefined) {
          let out = data.run.output;
          if (data.compile && data.compile.stderr) {
            out = data.compile.stderr + '\n' + out;
          }
          setOutput(out || 'Program ran successfully with no output.');
          setIsRunning(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Piston API failed, falling back to simulation", e);
    }
    
    // Fallback to simulation
    setTimeout(() => {
      try {
        const result = simulateExecution(code);
        setOutput(result + '\n\n[Warning: Executed via regex simulation. Piston API is offline.]');
      } catch (e) {
        setOutput(`Error: ${e.message}`);
      }
      setIsRunning(false);
    }, 500);
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
  };

  const handlePreset = (preset) => {
    setCode(preset.code);
    setOutput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRun();
    }
  };

  return (
    <div className="slide-up">
      <div className="page-header">
        <h1>
          <Terminal size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-2)' }} />
          Code Playground
        </h1>
        <p>Write, compile, and execute C programs. Press Ctrl+Enter to run.</p>
      </div>

      {/* Preset selector */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {presets.map((preset) => (
          <button key={preset.name} className="btn btn-secondary btn-sm" onClick={() => handlePreset(preset)}>
            {preset.name}
          </button>
        ))}
      </div>

      <div className="playground-layout">
        {/* Editor Panel */}
        <div className="playground-panel">
          <div className="panel-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-green)' }} />
              main.c
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="btn btn-ghost btn-sm" onClick={handleCopy} title="Copy code">
                <Copy size={14} />
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset">
                <RotateCcw size={14} />
              </button>
              <button
                className={`btn btn-primary btn-sm ${isRunning ? 'pulse-glow' : ''}`}
                onClick={handleRun}
                disabled={isRunning}
              >
                <Play size={14} /> {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
          <div className="panel-body" style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              style={{
                width: '100%', height: '100%', border: 'none', outline: 'none',
                background: '#0d1117', color: '#c9d1d9', resize: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
                padding: 'var(--space-4)', lineHeight: 1.6, tabSize: 4,
                minHeight: 400,
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="playground-panel">
          <div className="panel-header">
            <span>Output</span>
            <span className="badge badge-info">{isRunning ? 'Running' : output ? 'Completed' : 'Ready'}</span>
          </div>
          <div className="panel-body code-output" style={{ flex: 1, minHeight: 400, maxHeight: 'none' }}>
            {output ? (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <span className="output-success">$ ./main</span>{'\n'}{output}
              </pre>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 'var(--space-16)' }}>
                <Terminal size={48} style={{ opacity: 0.2, marginBottom: 'var(--space-4)' }} />
                <p>Click Run or press Ctrl+Enter to execute your code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
