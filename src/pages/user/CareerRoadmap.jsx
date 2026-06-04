import React from 'react';
import { Route, Map, Flag, Compass, Terminal, ShieldAlert, Cpu, Network } from 'lucide-react';

const roadmapSteps = [
  {
    id: 1,
    title: 'Bare-Metal C & Fundamentals',
    icon: <Terminal className="w-6 h-6 text-blue-400" />,
    description: 'Master C programming with a focus on memory management, pointers, and bitwise operations. Understand how the compiler and linker work.',
    skills: ['Pointers & Arrays', 'Bit Manipulation', 'Volatile & Structs', 'Makefiles / CMake'],
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'MCU Architecture & Peripherals',
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    description: 'Dive deep into microcontroller internals. Learn to read datasheets and write drivers by interacting directly with memory-mapped registers.',
    skills: ['ARM Cortex-M Core', 'GPIO, Timers, PWM', 'ADC / DAC', 'Interrupts (NVIC)'],
    color: 'bg-purple-500'
  },
  {
    id: 3,
    title: 'Communication Protocols',
    icon: <Network className="w-6 h-6 text-emerald-400" />,
    description: 'Learn how embedded devices talk to each other and the outside world. Implement protocol drivers using logic analyzers to debug.',
    skills: ['UART / USART', 'I2C & SPI', 'CAN Bus', 'DMA (Direct Memory Access)'],
    color: 'bg-emerald-500'
  },
  {
    id: 4,
    title: 'Real-Time Operating Systems (RTOS)',
    icon: <Map className="w-6 h-6 text-orange-400" />,
    description: 'Move beyond the super-loop. Structure complex applications using multiple threads while ensuring deterministic timing constraints.',
    skills: ['Task Scheduling', 'Mutexes & Semaphores', 'Message Queues', 'FreeRTOS'],
    color: 'bg-orange-500'
  },
  {
    id: 5,
    title: 'Embedded Linux & Systems',
    icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
    description: 'Scale up to complex SoCs (System on Chip). Build custom Linux images and write kernel space device drivers.',
    skills: ['Yocto / Buildroot', 'U-Boot', 'Device Trees', 'Kernel Modules'],
    color: 'bg-red-500'
  },
  {
    id: 6,
    title: 'Firmware Architect',
    icon: <Flag className="w-6 h-6 text-yellow-400" />,
    description: 'Design robust, secure, and OTA-updatable systems. Focus on power optimization, security, and test-driven development.',
    skills: ['Secure Boot', 'OTA Updates', 'System Design', 'TDD/CI-CD'],
    color: 'bg-yellow-500'
  }
];

export default function CareerRoadmap() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="page-header mb-16 text-center">
          <div className="inline-flex justify-center items-center mb-6">
            <Compass className="w-12 h-12 text-blue-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Roadmap</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From blinking an LED to architecting complex IoT ecosystems. Follow this structured 
            path to master embedded systems engineering.
          </p>
        </header>

        <div className="relative border-l-4 border-gray-700 ml-6 md:ml-12 space-y-12 pb-12">
          {roadmapSteps.map((step, index) => (
            <div key={step.id} className="relative pl-8 md:pl-16">
              
              {/* Timeline Marker */}
              <div className={`absolute -left-[1.35rem] top-1 w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-900 shadow-xl flex items-center justify-center z-10`}>
                {React.cloneElement(step.icon, { className: 'w-5 h-5 text-gray-300' })}
                <div className={`absolute inset-0 rounded-full opacity-20 ${step.color}`}></div>
              </div>

              {/* Content Card */}
              <div className="glass-card bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-100">
                    <span className="text-gray-500 text-lg mr-2 font-mono">0{step.id}.</span>
                    {step.title}
                  </h2>
                </div>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {step.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {step.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1 bg-gray-900 text-gray-300 text-xs font-semibold rounded-md border border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
