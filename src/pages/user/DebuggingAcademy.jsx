import React, { useState } from 'react';
import { Bug, CheckCircle, Terminal, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    title: 'HardFault: NULL Pointer Dereference',
    description: 'The system crashed with a HardFault exception immediately after initialization. Identify the vulnerability in this sensor reading function.',
    brokenCode: `void read_sensor_data(SensorData_t* pData) {
    // Reading raw value from hardware register
    pData->raw_value = I2C_ReadRegister(SENSOR_ADDR, REG_DATA);
    pData->timestamp = get_systick();
    pData->status = SENSOR_OK;
}`,
    fixedCode: `void read_sensor_data(SensorData_t* pData) {
    // Always validate pointer parameters!
    if (pData == NULL) {
        // Handle error (e.g., log, assert, or return)
        return; 
    }
    pData->raw_value = I2C_ReadRegister(SENSOR_ADDR, REG_DATA);
    pData->timestamp = get_systick();
    pData->status = SENSOR_OK;
}`,
    explanation: 'Dereferencing a NULL pointer leads to a memory access violation (HardFault on ARM Cortex-M). Always validate pointers passed into functions before accessing their members.'
  },
  {
    id: 2,
    title: 'Race Condition in ISR',
    description: 'The main loop occasionally processes corrupted data when high-frequency interrupts occur. Why is the shared variable access unsafe?',
    brokenCode: `volatile uint32_t tick_count = 0;

void SysTick_Handler(void) {
    tick_count++; // Incremented every 1ms
}

void delay_ms(uint32_t ms) {
    uint32_t start = tick_count;
    // Potentially infinite loop if interrupted!
    while((tick_count - start) < ms); 
}`,
    fixedCode: `volatile uint32_t tick_count = 0;

void SysTick_Handler(void) {
    tick_count++;
}

uint32_t get_ticks(void) {
    uint32_t ticks;
    __disable_irq(); // Disable interrupts
    ticks = tick_count; // Read atomically
    __enable_irq();  // Re-enable interrupts
    return ticks;
}`,
    explanation: 'On 8-bit or 16-bit architectures, a 32-bit read is not atomic. If an interrupt fires halfway through reading `tick_count`, the resulting value is corrupted. Disable interrupts or use hardware atomics when reading shared volatile multi-byte variables.'
  },
  {
    id: 3,
    title: 'Stack Overflow due to Large Local Variables',
    description: 'The microcontroller unexpectedly resets during a specific recursive or deep call chain. What is wrong with the local memory allocation?',
    brokenCode: `void process_image_chunk(void) {
    // 4KB array allocated on the stack!
    uint8_t image_buffer[4096]; 
    
    fetch_chunk_from_flash(image_buffer);
    apply_filter(image_buffer);
    transmit_chunk(image_buffer);
}`,
    fixedCode: `// Allocate in .bss or .data (heap/static)
static uint8_t image_buffer[4096]; 

void process_image_chunk(void) {
    // No stack allocation overhead
    fetch_chunk_from_flash(image_buffer);
    apply_filter(image_buffer);
    transmit_chunk(image_buffer);
}`,
    explanation: 'Embedded systems have very limited stack sizes (often 1KB-4KB). Allocating large arrays locally blows the stack, corrupting adjacent memory (like the heap or RTOS TCBs). Use static allocation or a memory pool for large buffers.'
  },
  {
    id: 4,
    title: 'Unaligned Memory Access',
    description: 'Code works on x86 during unit testing but throws a UsageFault on the target ARM Cortex-M0 device.',
    brokenCode: `void parse_packet(uint8_t* rx_buffer) {
    // Casting unaligned byte buffer to 32-bit pointer
    uint32_t header = *((uint32_t*)&rx_buffer[1]);
    
    if (header == VALID_MAGIC_WORD) {
        process_payload(&rx_buffer[5]);
    }
}`,
    fixedCode: `void parse_packet(uint8_t* rx_buffer) {
    uint32_t header;
    // Copy bytes safely to a naturally aligned variable
    memcpy(&header, &rx_buffer[1], sizeof(uint32_t));
    
    if (header == VALID_MAGIC_WORD) {
        process_payload(&rx_buffer[5]);
    }
}`,
    explanation: 'Certain architectures (like Cortex-M0) do not support unaligned memory accesses and will throw a UsageFault. Using `memcpy` instructs the compiler to generate safe byte-by-byte copies.'
  }
];

export default function DebuggingAcademy() {
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="page-header mb-12 border-b border-gray-700 pb-6">
          <h1 className="text-4xl font-bold flex items-center gap-3 text-red-400">
            <Bug className="w-10 h-10" />
            Debugging Academy
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Master the art of troubleshooting bare-metal and RTOS firmware.</p>
        </header>

        <div className="space-y-8">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="glass-card bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-100 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      {scenario.title}
                    </h2>
                    <p className="text-gray-300 mt-2">{scenario.description}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-gray-950 rounded-lg p-4 border border-red-900/30">
                    <div className="flex items-center gap-2 mb-2 text-red-400 text-sm font-semibold">
                      <Terminal className="w-4 h-4" />
                      Broken Code
                    </div>
                    <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                      <code>{scenario.brokenCode}</code>
                    </pre>
                  </div>
                  
                  <button 
                    onClick={() => toggleReveal(scenario.id)}
                    className="btn-primary w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {revealed[scenario.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    {revealed[scenario.id] ? 'Hide Solution' : 'Reveal Fix & Explanation'}
                  </button>

                  {revealed[scenario.id] && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
                      <div className="bg-gray-950 rounded-lg p-4 border border-green-900/30">
                        <div className="flex items-center gap-2 mb-2 text-green-400 text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Fixed Code
                        </div>
                        <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                          <code>{scenario.fixedCode}</code>
                        </pre>
                      </div>
                      
                      <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-1">Why this works:</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {scenario.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
