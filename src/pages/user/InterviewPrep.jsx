import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Cpu, Binary, BrainCircuit, Activity } from 'lucide-react';

const categories = [
  {
    name: 'Bit Manipulation',
    icon: <Binary className="w-5 h-5 text-blue-400" />,
    questions: [
      {
        q: 'How do you set, clear, and toggle a specific bit in a register?',
        a: 'To SET bit n: `REG |= (1 << n);`\nTo CLEAR bit n: `REG &= ~(1 << n);`\nTo TOGGLE bit n: `REG ^= (1 << n);`\nTo CHECK bit n: `if(REG & (1 << n))`'
      },
      {
        q: 'Write a macro to swap the nibbles of an 8-bit variable.',
        a: '`#define SWAP_NIBBLES(x) (((x & 0x0F) << 4) | ((x & 0xF0) >> 4))`'
      }
    ]
  },
  {
    name: 'Memory & Architecture',
    icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
    questions: [
      {
        q: 'What is the difference between Heap and Stack?',
        a: 'The Stack stores local variables, function parameters, and return addresses. It is LIFO, automatically managed, and fast but limited in size. The Heap is used for dynamic memory allocation (malloc/free), is manually managed, slower, and prone to fragmentation. In embedded systems, heap usage is often avoided.'
      },
      {
        q: 'Explain the volatile keyword in C.',
        a: '`volatile` tells the compiler that a variable may change unexpectedly (e.g., modified by an ISR or hardware peripheral). It prevents the compiler from optimizing out reads/writes to that variable.'
      }
    ]
  },
  {
    name: 'Interrupts (ISRs)',
    icon: <Activity className="w-5 h-5 text-red-400" />,
    questions: [
      {
        q: 'What are the best practices for writing an Interrupt Service Routine (ISR)?',
        a: '1. Keep it as short and fast as possible.\n2. Do not use blocking code or delays.\n3. Avoid non-reentrant functions (like printf or malloc).\n4. Use volatile for variables shared with main code.\n5. Clear the interrupt flag before exiting.'
      },
      {
        q: 'What is interrupt latency?',
        a: 'Interrupt latency is the time from when a hardware interrupt is triggered until the first instruction of the ISR is executed. It is affected by hardware architecture, current interrupt masking, and context switching overhead.'
      }
    ]
  },
  {
    name: 'RTOS Concepts',
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    questions: [
      {
        q: 'What is Priority Inversion and how do you solve it?',
        a: 'Priority inversion happens when a low-priority task holds a resource (like a mutex) needed by a high-priority task, while a medium-priority task preempts the low-priority task. Solution: Priority Inheritance, where the low-priority task temporarily inherits the priority of the highest-priority task waiting on the resource.'
      },
      {
        q: 'Mutex vs Semaphore?',
        a: 'A Mutex is used for mutual exclusion (protecting shared resources) and has a concept of ownership (only the thread that locked it can unlock it). A Semaphore is a signaling mechanism used for synchronization (e.g., ISR signals a task) and has no ownership.'
      }
    ]
  }
];

export default function InterviewPrep() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="page-header mb-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gray-800 rounded-full mb-4 shadow-lg border border-gray-700">
            <BookOpen className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Interview Prep</h1>
          <p className="text-gray-400 text-lg">Master the most frequently asked Embedded C interview questions.</p>
        </header>

        <div className="space-y-10">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-3 pb-2 border-b border-gray-700">
                {category.icon}
                {category.name}
              </h2>
              
              <div className="space-y-3">
                {category.questions.map((item, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <div 
                      key={qIdx} 
                      className="glass-card bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
                    >
                      <button 
                        onClick={() => toggleQuestion(id)}
                        className="w-full text-left p-5 flex items-start justify-between hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="font-medium text-gray-200 pr-4">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="p-5 border-t border-gray-700 bg-gray-900/50">
                          <div className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {item.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
