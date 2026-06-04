import React from 'react';
import { Cpu, HardDrive, Clock, BarChart, Rocket, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Custom Bare-Metal Bootloader',
    icon: <HardDrive className="w-8 h-8 text-blue-400" />,
    difficulty: 'Advanced',
    time: '20-25 hours',
    description: 'Design and implement a custom bootloader for an ARM Cortex-M MCU that can parse hex files over UART and flash application code to memory.',
    concepts: [
      'Linker Scripts & Memory Maps',
      'Vector Table Relocation',
      'In-Application Programming (IAP)',
      'UART communication & checksums'
    ],
    color: 'border-blue-500'
  },
  {
    id: 2,
    title: 'Preemptive RTOS Scheduler',
    icon: <Cpu className="w-8 h-8 text-purple-400" />,
    difficulty: 'Expert',
    time: '30-40 hours',
    description: 'Build a simplified RTOS kernel from scratch. Implement context switching, a priority-based scheduler, and basic inter-task communication (semaphores).',
    concepts: [
      'ARM Architecture & Registers',
      'PendSV & SysTick Exceptions',
      'Context Switching (Assembly)',
      'Task Control Blocks (TCB)'
    ],
    color: 'border-purple-500'
  },
  {
    id: 3,
    title: 'I2C Weather Station',
    icon: <Rocket className="w-8 h-8 text-emerald-400" />,
    difficulty: 'Intermediate',
    time: '10-15 hours',
    description: 'Interface a BME280 sensor via I2C to read temperature and humidity, then display it on a small OLED screen without using bloated HAL libraries.',
    concepts: [
      'I2C Protocol & Timing',
      'Datasheet Navigation',
      'Register-Level Programming',
      'Bitwise Operations'
    ],
    color: 'border-emerald-500'
  },
  {
    id: 4,
    title: 'USB HID Keyboard Emulator',
    icon: <Layers className="w-8 h-8 text-orange-400" />,
    difficulty: 'Advanced',
    time: '25-30 hours',
    description: 'Implement a USB device stack capable of enumerating as a Human Interface Device (HID) and sending keystrokes to a host PC.',
    concepts: [
      'USB 2.0 Specifications',
      'Endpoints & Descriptors',
      'Interrupt Transfers',
      'State Machine Design'
    ],
    color: 'border-orange-500'
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <header className="page-header text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Project Blueprints
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Bridge the gap between theory and practice. Build real-world embedded systems 
            to stand out in your firmware engineering interviews.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={`glass-card bg-gray-800 rounded-2xl p-6 border-l-4 ${project.color} border-t border-r border-b border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-900 rounded-lg shadow-inner">
                  {project.icon}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-gray-900 rounded-full text-gray-300">
                    <BarChart className="w-3 h-3" /> {project.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-gray-900 rounded-full text-gray-300">
                    <Clock className="w-3 h-3" /> {project.time}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-100 mb-2">{project.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>

              <div className="space-y-3 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Key Concepts</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {project.concepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="btn-primary mt-auto w-full group py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors flex items-center justify-center gap-2 font-medium">
                Start Project
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
