export const module = {
  id: 'module-01',
  title: 'Computer Fundamentals',
  description:
    'Understand the building blocks of computing — from CPU architecture and memory hierarchy to number systems and the compilation process. Essential foundations for embedded C programming.',
  icon: '🖥️',
  track: 'c-programming',
  estimatedHours: 6,
  prerequisites: [],
  lessons: [
    {
      id: 'lesson-01-01',
      title: 'What is a Computer? Hardware vs Software',
      content: `## What is a Computer?

A computer is an electronic device that accepts **input**, **processes** it according to a set of instructions (a **program**), **stores** intermediate and final results, and produces **output**.

In the embedded world, a computer can be as small as an 8-bit microcontroller inside a washing machine or as powerful as a multi-core ARM processor in a smartphone.

### Hardware vs Software

| Aspect | Hardware | Software |
|--------|----------|----------|
| Definition | Physical electronic components | Instructions that tell hardware what to do |
| Examples | CPU, RAM, resistors, PCB | Firmware, OS, application code |
| Tangibility | Can be touched and measured | Intangible, stored as binary data |
| Wear | Degrades over time | Does not wear out but can become obsolete |

### Embedded System Perspective

In an embedded system like an **Arduino Uno**:
- **Hardware**: ATmega328P microcontroller chip, crystal oscillator, voltage regulator, GPIO pins
- **Software**: The C/C++ firmware you flash onto the chip

The tight coupling between hardware and software is what makes embedded programming unique. You write C code that directly manipulates hardware registers to control LEDs, read sensors, and communicate over UART/SPI/I2C.`,
      codeExamples: [
        {
          title: 'Bare-metal LED Blink (AVR)',
          code: `#include <avr/io.h>
#include <util/delay.h>

int main(void) {
    // Hardware: Set pin PB5 as output
    DDRB |= (1 << PB5);

    while (1) {
        PORTB ^= (1 << PB5);  // Toggle LED
        _delay_ms(500);
    }
    return 0;
}`,
          output: 'LED connected to PB5 blinks every 500ms'
        }
      ],
      keyPoints: [
        'A computer follows the Input → Process → Store → Output cycle',
        'Hardware is the physical layer; software is the instruction layer',
        'Embedded systems are specialized computers designed for dedicated tasks',
        'In embedded C, software directly manipulates hardware registers'
      ],
      commonMistakes: [
        'Confusing firmware with application software — firmware is low-level software stored in non-volatile memory',
        'Thinking embedded systems always have an operating system — many run bare-metal code'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between a microcontroller and a microprocessor?',
          answer:
            'A microprocessor contains only a CPU and requires external memory and peripherals (e.g., Intel i7). A microcontroller integrates CPU, RAM, ROM/Flash, and peripherals (UART, ADC, timers) on a single chip (e.g., STM32, ATmega328P). Microcontrollers are used in embedded systems for their self-contained design and lower cost.'
        },
        {
          question: 'What is firmware?',
          answer:
            'Firmware is specialized software stored in non-volatile memory (Flash/ROM) of an embedded device. It provides low-level control of the hardware and is typically written in C or assembly. Unlike application software, firmware is rarely updated and runs directly on the hardware without an OS in many cases.'
        }
      ]
    },
    {
      id: 'lesson-01-02',
      title: 'CPU Architecture: ALU, Registers, and Control Unit',
      content: `## Central Processing Unit (CPU)

The CPU is the brain of the computer. It consists of three main components:

### 1. Arithmetic Logic Unit (ALU)
The ALU performs all arithmetic operations (addition, subtraction, multiplication, division) and logical operations (AND, OR, NOT, XOR, comparisons). In embedded processors, the ALU width determines the data size it can process in one clock cycle:
- **8-bit ALU**: Processes 8 bits at a time (e.g., ATmega328P)
- **32-bit ALU**: Processes 32 bits at a time (e.g., ARM Cortex-M4)

### 2. Control Unit (CU)
The Control Unit orchestrates the **fetch-decode-execute** cycle:
1. **Fetch**: Reads the next instruction from memory using the Program Counter (PC)
2. **Decode**: Interprets the instruction opcode
3. **Execute**: Sends signals to the ALU, registers, or memory to carry out the instruction

### 3. Registers
Registers are the fastest storage inside the CPU. Common registers include:
- **Program Counter (PC)**: Holds the address of the next instruction
- **Stack Pointer (SP)**: Points to the top of the stack in RAM
- **Accumulator (ACC)**: Stores ALU results
- **General-Purpose Registers (GPR)**: R0–R15 in ARM, used for temporary data
- **Status Register (SREG/PSR)**: Contains flags — Zero (Z), Carry (C), Negative (N), Overflow (V)

### ARM Cortex-M Register Set
\`\`\`
R0  - R12  : General-purpose registers
R13 (SP)   : Stack Pointer
R14 (LR)   : Link Register (return address)
R15 (PC)   : Program Counter
xPSR       : Program Status Register
\`\`\`

Understanding registers is crucial for debugging embedded systems with tools like GDB and JTAG debuggers.`,
      codeExamples: [
        {
          title: 'Checking CPU status flags in C (conceptual)',
          code: `#include <stdio.h>

int main() {
    int a = 127;
    int b = 1;
    int result = a + b;  // 128

    // In an 8-bit CPU, 127 + 1 causes overflow
    // The Overflow flag (V) would be set in SREG
    // In C, we check manually:
    if (result > 127 || result < -128) {
        printf("8-bit overflow detected!\\n");
    }

    printf("Result: %d\\n", result);
    return 0;
}`,
          output: '8-bit overflow detected!\nResult: 128'
        },
        {
          title: 'Understanding the fetch-decode-execute cycle',
          code: `// Assembly-like pseudocode showing CPU cycle:
// Memory:
//   0x0000: LOAD R0, #5     ; Fetch from 0x0000, decode LOAD, execute: R0 = 5
//   0x0004: LOAD R1, #3     ; Fetch from 0x0004, decode LOAD, execute: R1 = 3
//   0x0008: ADD  R2, R0, R1 ; Fetch from 0x0008, decode ADD,  execute: R2 = R0 + R1 = 8
//   0x000C: STORE R2, 0x100 ; Fetch from 0x000C, decode STORE, execute: MEM[0x100] = 8

// In C, the compiler generates these instructions for us:
#include <stdio.h>
int main() {
    int a = 5;       // LOAD-like operation
    int b = 3;       // LOAD-like operation
    int c = a + b;   // ADD operation
    printf("%d\\n", c); // Multiple instructions for function call
    return 0;
}`,
          output: '8'
        }
      ],
      keyPoints: [
        'The CPU executes the fetch-decode-execute cycle continuously',
        'ALU handles all arithmetic and logical computations',
        'Registers are the fastest memory, located inside the CPU',
        'ARM Cortex-M processors have R0–R12 general-purpose registers plus SP, LR, PC',
        'Status flags (Zero, Carry, Overflow, Negative) are set automatically by the ALU'
      ],
      commonMistakes: [
        'Confusing the Program Counter with a general-purpose register — PC always holds the next instruction address',
        'Forgetting that register width defines the processor architecture (8-bit, 16-bit, 32-bit, 64-bit)'
      ],
      interviewQuestions: [
        {
          question: 'What is the role of the Program Counter in a CPU?',
          answer:
            'The Program Counter (PC) is a special register that holds the memory address of the next instruction to be fetched and executed. After each fetch, the PC is incremented (typically by 2 or 4 bytes depending on instruction size). Branch/jump instructions modify the PC to change the execution flow.'
        },
        {
          question: 'What happens during a function call at the register level?',
          answer:
            'When a function is called: (1) The current PC value is saved to the Link Register (LR) or pushed onto the stack, (2) Function arguments are placed in R0–R3 (ARM calling convention), (3) The PC is loaded with the function address. On return, LR is moved back to PC, restoring execution to the caller.'
        }
      ]
    },
    {
      id: 'lesson-01-03',
      title: 'Memory: RAM, ROM, Flash, and Memory Hierarchy',
      content: `## Types of Memory

### Volatile Memory (loses data when power is off)
- **RAM (Random Access Memory)**: Fast read/write memory used for variables, stack, heap during program execution
  - **SRAM (Static RAM)**: Faster, more expensive, used in microcontroller internal RAM and CPU cache. No refresh needed.
  - **DRAM (Dynamic RAM)**: Slower, cheaper, higher density. Used in PC main memory. Needs periodic refresh.

### Non-Volatile Memory (retains data without power)
- **ROM (Read-Only Memory)**: Programmed once during manufacturing. Cannot be modified.
- **EEPROM**: Electrically erasable, byte-level write. Slower, limited write cycles (~100,000). Used for configuration data.
- **Flash Memory**: Block-erasable, faster than EEPROM. Used for firmware storage. Limited write cycles (~10,000–100,000).

### Memory in an Embedded System (e.g., STM32F103)
\`\`\`
┌─────────────────────────────┐
│  Flash Memory (64–512 KB)   │ ← Stores your C program (firmware)
├─────────────────────────────┤
│  SRAM (20 KB)               │ ← Variables, stack, heap at runtime
├─────────────────────────────┤
│  Peripheral Registers       │ ← Memory-mapped I/O (GPIO, UART, etc.)
├─────────────────────────────┤
│  System Memory (Bootloader) │ ← Factory-programmed boot ROM
└─────────────────────────────┘
\`\`\`

### Memory Hierarchy (fastest → slowest)

\`\`\`
  Registers     ← ~1 CPU cycle,  few bytes
      ↓
  L1 Cache      ← ~3-4 cycles,   32-64 KB
      ↓
  L2 Cache      ← ~10 cycles,    256 KB - 1 MB
      ↓
  L3 Cache      ← ~30-40 cycles, 2-32 MB
      ↓
  Main Memory   ← ~100 cycles,   1-64 GB
      ↓
  Flash/SSD     ← ~10,000 cycles
      ↓
  Hard Disk     ← ~1,000,000 cycles
\`\`\`

The key principle: **smaller and faster** memory is more expensive, so computers use a hierarchy. Data the CPU needs frequently is kept in cache; less-used data stays in slower memory.`,
      codeExamples: [
        {
          title: 'Variables in different memory sections',
          code: `#include <stdio.h>

// Stored in Flash (ROM) — read-only
const int FIRMWARE_VERSION = 3;

// Stored in RAM (.data section) — initialized global
int sensor_count = 10;

// Stored in RAM (.bss section) — uninitialized global (zeroed)
int error_log[100];

int main() {
    // Stored in RAM (stack) — local variable
    int temperature = 25;

    // Stored in RAM (heap) — dynamically allocated
    // (rarely used in embedded due to fragmentation risks)

    printf("Firmware v%d\\n", FIRMWARE_VERSION);
    printf("Sensor count: %d\\n", sensor_count);
    printf("Temperature: %d\\n", temperature);
    return 0;
}`,
          output: 'Firmware v3\nSensor count: 10\nTemperature: 25'
        }
      ],
      keyPoints: [
        'RAM is volatile; ROM/Flash/EEPROM are non-volatile',
        'SRAM is used in microcontrollers for speed; DRAM is used in PCs for capacity',
        'Flash stores firmware; SRAM holds runtime variables and stack',
        'Memory hierarchy trades off speed, size, and cost',
        'In embedded systems, memory is extremely limited — optimize every byte'
      ],
      commonMistakes: [
        'Using dynamic memory allocation (malloc) in safety-critical embedded systems — it can cause fragmentation and unpredictable behavior',
        'Forgetting that Flash has limited write cycles — avoid writing to Flash in loops',
        'Confusing SRAM (static RAM, volatile) with Flash (non-volatile) — they serve different purposes'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between SRAM and DRAM?',
          answer:
            'SRAM uses flip-flops (6 transistors per bit), is faster, does not need refresh, but is more expensive and less dense. DRAM uses capacitors (1 transistor + 1 capacitor per bit), is cheaper and denser but slower and requires periodic refresh. SRAM is used in CPU cache and microcontroller RAM; DRAM is used for main memory in PCs.'
        },
        {
          question: 'Where are global variables, local variables, and constants stored in an embedded system?',
          answer:
            'Initialized global/static variables are stored in the .data section (copied from Flash to RAM at startup). Uninitialized globals go in .bss (zeroed in RAM). Local variables live on the stack (RAM). Constants declared with const may be stored in Flash (ROM) to save RAM. The firmware code itself is stored in Flash and executed from there (or copied to RAM for faster execution).'
        }
      ]
    },
    {
      id: 'lesson-01-04',
      title: 'System Bus: Address, Data, and Control Bus',
      content: `## The System Bus

The system bus is the communication highway connecting the CPU to memory and peripherals. It consists of three sub-buses:

### 1. Address Bus
- Carries the **memory address** the CPU wants to read from or write to
- **Unidirectional**: CPU → Memory/Peripherals
- Width determines addressable memory: \`2^n\` addresses for n-bit bus
  - 16-bit address bus → 2^16 = 64 KB addressable memory
  - 32-bit address bus → 2^32 = 4 GB addressable memory

### 2. Data Bus
- Carries the actual **data** being transferred
- **Bidirectional**: data flows both ways between CPU and memory
- Width determines how much data transfers per cycle:
  - 8-bit data bus → 1 byte per transfer
  - 32-bit data bus → 4 bytes per transfer

### 3. Control Bus
- Carries **control signals** that coordinate operations
- Signals include: Read/Write, Clock, Interrupt Request (IRQ), Bus Request, Reset
- **Bidirectional**: different signals flow in different directions

### Bus Architecture Diagram
\`\`\`
    ┌─────────┐     Address Bus (→)      ┌──────────┐
    │         │━━━━━━━━━━━━━━━━━━━━━━━━━▶│          │
    │   CPU   │     Data Bus (↔)         │  Memory  │
    │         │◀━━━━━━━━━━━━━━━━━━━━━━━━▶│  & I/O   │
    │         │     Control Bus (↔)       │          │
    │         │◀━━━━━━━━━━━━━━━━━━━━━━━━▶│          │
    └─────────┘                           └──────────┘
\`\`\`

### Memory-Mapped I/O in Embedded Systems
In ARM Cortex-M processors, peripherals are accessed through **memory-mapped I/O**. Each peripheral register has a specific memory address. Writing to that address controls the hardware.

For example, on STM32:
- GPIO Port A output register is at address \`0x4001080C\`
- Writing \`0x0020\` to that address sets pin PA5 HIGH`,
      codeExamples: [
        {
          title: 'Memory-mapped I/O — controlling GPIO directly',
          code: `#include <stdint.h>

// Memory-mapped register addresses for STM32F103 GPIO Port A
#define GPIOA_BASE    0x40010800
#define GPIOA_CRL     (*(volatile uint32_t *)(GPIOA_BASE + 0x00))
#define GPIOA_ODR     (*(volatile uint32_t *)(GPIOA_BASE + 0x0C))

void toggle_led(void) {
    // Toggle pin PA5 using XOR on the output data register
    GPIOA_ODR ^= (1 << 5);
}

// The CPU places 0x4001080C on the address bus,
// the data on the data bus, and asserts WRITE on the control bus.`,
          output: 'PA5 pin toggles HIGH/LOW on each call'
        },
        {
          title: 'Calculating addressable memory from bus width',
          code: `#include <stdio.h>
#include <math.h>

int main() {
    int address_bits[] = {8, 16, 20, 24, 32};
    int count = sizeof(address_bits) / sizeof(address_bits[0]);

    printf("Address Bus Width → Addressable Memory\\n");
    printf("----------------------------------------\\n");

    for (int i = 0; i < count; i++) {
        double bytes = pow(2, address_bits[i]);
        if (bytes >= 1073741824)
            printf("%2d bits → %.0f GB\\n", address_bits[i], bytes / 1073741824);
        else if (bytes >= 1048576)
            printf("%2d bits → %.0f MB\\n", address_bits[i], bytes / 1048576);
        else
            printf("%2d bits → %.0f KB\\n", address_bits[i], bytes / 1024);
    }
    return 0;
}`,
          output:
            'Address Bus Width → Addressable Memory\n----------------------------------------\n 8 bits → 256 Bytes\n16 bits → 64 KB\n20 bits → 1 MB\n24 bits → 16 MB\n32 bits → 4 GB'
        }
      ],
      keyPoints: [
        'Address bus is unidirectional (CPU → memory); data bus is bidirectional',
        'Address bus width determines total addressable memory (2^n bytes)',
        'Data bus width determines how many bytes transfer per clock cycle',
        'Embedded systems use memory-mapped I/O to control peripherals via addresses',
        'The volatile keyword in C prevents the compiler from optimizing away register reads/writes'
      ],
      commonMistakes: [
        'Forgetting the volatile keyword when accessing hardware registers — the compiler may cache the value and miss hardware changes',
        'Confusing address bus width with data bus width — they are independent and serve different purposes'
      ],
      interviewQuestions: [
        {
          question: 'What is memory-mapped I/O? How is it different from port-mapped I/O?',
          answer:
            'In memory-mapped I/O, peripheral registers share the same address space as RAM, so normal load/store instructions access them (used by ARM). In port-mapped I/O, peripherals have a separate address space accessed via special instructions like IN/OUT (used by x86). Memory-mapped I/O is simpler because it uses the same instructions for memory and peripherals.'
        },
        {
          question: 'Why do we use the volatile keyword when accessing hardware registers in C?',
          answer:
            'The volatile keyword tells the compiler that the value at that memory address can change at any time (by hardware, interrupts, or other threads) and must not be optimized away. Without volatile, the compiler might cache the register value in a CPU register and never re-read it from the actual hardware address, causing bugs.'
        }
      ]
    },
    {
      id: 'lesson-01-05',
      title: 'Number Systems: Binary and Hexadecimal',
      content: `## Why Number Systems Matter

Computers operate in **binary** (base-2) because digital circuits have two states: ON (1) and OFF (0). As programmers, we use **hexadecimal** (base-16) as a human-friendly shorthand for binary. Understanding these systems is essential for embedded programming where you manipulate individual bits.

### Binary (Base-2)
Each digit (bit) is either 0 or 1. Bit positions represent powers of 2.

\`\`\`
Binary: 1  0  1  1  0  1  0  0
Power:  2⁷ 2⁶ 2⁵ 2⁴ 2³ 2² 2¹ 2⁰
Value: 128 64 32 16  8  4  2  1
       128 + 0 + 32 + 16 + 0 + 4 + 0 + 0 = 180
\`\`\`

### Hexadecimal (Base-16)
Digits: 0–9 and A–F (A=10, B=11, C=12, D=13, E=14, F=15)
Each hex digit represents exactly 4 binary bits (a nibble).

\`\`\`
Binary:  1011  0100
Hex:       B     4     → 0xB4

0xB4 = 11×16 + 4 = 180 (decimal)
\`\`\`

### Common Conversions
| Decimal | Binary | Hex |
|---------|--------|-----|
| 0 | 0000 | 0x0 |
| 5 | 0101 | 0x5 |
| 10 | 1010 | 0xA |
| 15 | 1111 | 0xF |
| 255 | 1111 1111 | 0xFF |

### Signed Integers: Two's Complement
Negative numbers use **two's complement** representation:
1. Write the positive number in binary
2. Invert all bits (one's complement)
3. Add 1

Example: -5 in 8-bit:
\`\`\`
 5 = 0000 0101
~5 = 1111 1010  (invert)
+1 = 1111 1011  → -5 in two's complement (0xFB)
\`\`\`

The MSB (Most Significant Bit) is the sign bit: 0 = positive, 1 = negative.`,
      codeExamples: [
        {
          title: 'Number system conversions in C',
          code: `#include <stdio.h>

int main() {
    int decimal = 180;
    int hex_val = 0xB4;     // Same as 180
    int binary_val = 0b10110100;  // GCC extension, same as 180

    printf("Decimal: %d\\n", decimal);
    printf("Hex:     0x%X\\n", decimal);
    printf("Octal:   %o\\n", decimal);

    // Prove they are the same
    printf("\\nAll equal? %s\\n",
           (decimal == hex_val && hex_val == binary_val) ? "YES" : "NO");

    // Two's complement demonstration
    signed char negative = -5;
    printf("\\n-5 as unsigned byte: %u (0x%02X)\\n",
           (unsigned char)negative, (unsigned char)negative);
    return 0;
}`,
          output:
            "Decimal: 180\nHex:     0xB4\nOctal:   264\n\nAll equal? YES\n\n-5 as unsigned byte: 251 (0xFB)"
        },
        {
          title: 'Printing binary representation',
          code: `#include <stdio.h>

void print_binary(unsigned char byte) {
    for (int i = 7; i >= 0; i--) {
        printf("%d", (byte >> i) & 1);
        if (i == 4) printf(" ");  // nibble separator
    }
    printf("\\n");
}

int main() {
    unsigned char values[] = {0, 5, 10, 15, 127, 255};
    int n = sizeof(values) / sizeof(values[0]);

    printf("Dec  Hex   Binary\\n");
    printf("---  ----  ---------\\n");
    for (int i = 0; i < n; i++) {
        printf("%3d  0x%02X  ", values[i], values[i]);
        print_binary(values[i]);
    }
    return 0;
}`,
          output:
            'Dec  Hex   Binary\n---  ----  ---------\n  0  0x00  0000 0000\n  5  0x05  0000 0101\n 10  0x0A  0000 1010\n 15  0x0F  0000 1111\n127  0x7F  0111 1111\n255  0xFF  1111 1111'
        }
      ],
      keyPoints: [
        'Binary uses base-2; each bit is a power of 2',
        'Hexadecimal uses base-16; each hex digit = 4 binary bits',
        'Prefix 0x for hex, 0b for binary (GCC), 0 for octal in C',
        'Negative integers use two\'s complement: invert bits and add 1',
        'Hex is preferred in embedded programming for register values and memory addresses'
      ],
      commonMistakes: [
        'Confusing 0x10 (decimal 16) with decimal 10 — always be clear about the base',
        'Forgetting that signed char ranges from -128 to 127, not 0 to 255',
        'Using decimal in bitmask operations — always use hex (0xFF) or binary (0b11111111) for clarity'
      ],
      interviewQuestions: [
        {
          question: 'Convert -1 to its binary representation in 32-bit two\'s complement.',
          answer:
            '-1 in 32-bit two\'s complement is 0xFFFFFFFF (all 32 bits set to 1). This is because: +1 = 0x00000001, inverting gives 0xFFFFFFFE, adding 1 gives 0xFFFFFFFF. This is why (unsigned int)(-1) gives the maximum unsigned value 4294967295.'
        },
        {
          question: 'Why is hexadecimal preferred over decimal when working with registers?',
          answer:
            'Hexadecimal directly maps to binary — each hex digit represents exactly 4 bits. This makes it easy to visualize which bits are set. For example, 0x0F clearly shows the lower 4 bits are set (0000 1111), whereas decimal 15 requires mental conversion. When dealing with 32-bit registers, 0x800000FF is much more readable than 2147483903.'
        }
      ]
    },
    {
      id: 'lesson-01-06',
      title: 'The Compilation Process: From Source to Executable',
      content: `## How C Code Becomes a Running Program

The C compilation process has four stages:

### Stage 1: Preprocessing (\`gcc -E\`)
The preprocessor handles all lines starting with \`#\`:
- **#include**: Copies the contents of header files into the source
- **#define**: Replaces macros with their values
- **#ifdef / #ifndef**: Conditional compilation
- Removes comments

Output: Expanded source code (still C, but with all macros resolved)

### Stage 2: Compilation (\`gcc -S\`)
The compiler translates the preprocessed C code into **assembly language** for the target architecture (x86, ARM, RISC-V, etc.).

Output: Assembly file (.s)

### Stage 3: Assembly (\`gcc -c\`)
The assembler converts assembly language into **machine code** (binary instructions the CPU understands) and produces an object file.

Output: Object file (.o) — contains machine code but unresolved external references

### Stage 4: Linking (\`gcc -o\`)
The linker combines one or more object files with library code, resolves all external references (e.g., \`printf\` from libc), and assigns final memory addresses.

Output: Executable binary (ELF on Linux, .hex/.bin for embedded)

### The Complete Pipeline
\`\`\`
  main.c ──→ [Preprocessor] ──→ main.i (expanded source)
                                    │
                                    ▼
                              [Compiler] ──→ main.s (assembly)
                                    │
                                    ▼
                              [Assembler] ──→ main.o (object file)
                                    │
                                    ▼
  libc.a ──→ [Linker] ◀── startup.o
                  │
                  ▼
            main.elf (executable)
                  │
                  ▼
            main.hex / main.bin (for flashing to embedded device)
\`\`\`

### Cross-Compilation for Embedded Systems
When developing for embedded targets, you use a **cross-compiler** that runs on your PC but generates code for the target architecture:
- \`arm-none-eabi-gcc\` — for ARM Cortex-M (bare-metal)
- \`avr-gcc\` — for AVR microcontrollers (Arduino)`,
      codeExamples: [
        {
          title: 'Observing each compilation stage',
          code: `// Save as hello.c
#include <stdio.h>

#define MESSAGE "Hello, Embedded World!"

int main() {
    printf("%s\\n", MESSAGE);
    return 0;
}

// Run each stage separately:
// Step 1: Preprocessing
//   gcc -E hello.c -o hello.i
//   (hello.i contains stdio.h expanded + MESSAGE replaced)

// Step 2: Compilation to assembly
//   gcc -S hello.c -o hello.s
//   (hello.s contains x86/ARM assembly instructions)

// Step 3: Assembly to object file
//   gcc -c hello.c -o hello.o
//   (hello.o contains machine code, viewable with: objdump -d hello.o)

// Step 4: Linking to executable
//   gcc hello.o -o hello
//   (hello is the final executable)`,
          output: 'Hello, Embedded World!'
        },
        {
          title: 'Understanding the preprocessor with macros',
          code: `#include <stdio.h>

// These are processed BEFORE compilation
#define MAX_SENSORS  8
#define SENSOR_ADDR  0x48
#define READ_TEMP(id) (base_temps[id] + offset)

// Conditional compilation for different targets
#ifdef STM32
    #define LED_PIN 5
#elif defined(ARDUINO)
    #define LED_PIN 13
#else
    #define LED_PIN 0
#endif

int main() {
    int base_temps[] = {22, 25, 19, 30, 28, 21, 23, 26};
    int offset = 2;

    printf("Max sensors: %d\\n", MAX_SENSORS);
    printf("Sensor I2C address: 0x%02X\\n", SENSOR_ADDR);
    printf("LED Pin: %d\\n", LED_PIN);

    for (int i = 0; i < MAX_SENSORS; i++) {
        printf("Sensor %d: %d°C\\n", i, READ_TEMP(i));
    }
    return 0;
}`,
          output:
            'Max sensors: 8\nSensor I2C address: 0x48\nLED Pin: 0\nSensor 0: 24°C\nSensor 1: 27°C\n...'
        }
      ],
      keyPoints: [
        'C compilation has 4 stages: Preprocessing → Compilation → Assembly → Linking',
        'The preprocessor handles #include, #define, and conditional compilation',
        'The compiler converts C to architecture-specific assembly',
        'The linker resolves external references and produces the final binary',
        'Embedded development uses cross-compilers (e.g., arm-none-eabi-gcc)'
      ],
      commonMistakes: [
        'Thinking #define creates a variable — it is a text replacement done before compilation',
        'Forgetting to link required libraries (e.g., -lm for math.h functions)',
        'Not understanding that .o files cannot run on their own — they need linking'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between a compiler and a cross-compiler?',
          answer:
            'A compiler generates machine code for the same platform it runs on (e.g., gcc on x86 Linux produces x86 binaries). A cross-compiler runs on one platform but generates code for a different target (e.g., arm-none-eabi-gcc runs on x86 but produces ARM Cortex-M binaries). Cross-compilation is essential in embedded development because the target device typically cannot run a compiler itself.'
        },
        {
          question:
            'What is the difference between static linking and dynamic linking?',
          answer:
            'Static linking copies library code into the final executable at link time, making it self-contained but larger. Dynamic linking keeps library code in shared objects (.so/.dll) loaded at runtime, making executables smaller but dependent on the library being present. Embedded bare-metal systems almost always use static linking since there is no OS to load shared libraries.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-01-01',
        type: 'mcq',
        question:
          'Which component of the CPU performs addition and logical AND operations?',
        options: [
          'Control Unit',
          'Arithmetic Logic Unit (ALU)',
          'Program Counter',
          'Memory Management Unit'
        ],
        correct: 1,
        explanation:
          'The ALU (Arithmetic Logic Unit) is responsible for all arithmetic operations (add, subtract, multiply, divide) and logical operations (AND, OR, NOT, XOR). The Control Unit orchestrates the fetch-decode-execute cycle but does not compute.',
        difficulty: 'beginner'
      },
      {
        id: 'q-01-02',
        type: 'mcq',
        question: 'What is the decimal value of the binary number 1010 1100?',
        options: ['156', '172', '182', '204'],
        correct: 1,
        explanation:
          '1010 1100 = 128 + 0 + 32 + 0 + 8 + 4 + 0 + 0 = 172. Break it into nibbles: 1010 = 10 (0xA), 1100 = 12 (0xC), so 0xAC = 10×16 + 12 = 172.',
        difficulty: 'beginner'
      },
      {
        id: 'q-01-03',
        type: 'mcq',
        question:
          'A microcontroller has a 16-bit address bus. How much memory can it address?',
        options: ['16 KB', '32 KB', '64 KB', '128 KB'],
        correct: 2,
        explanation:
          'With a 16-bit address bus, the addressable memory is 2^16 = 65,536 bytes = 64 KB. Each additional bit doubles the addressable space.',
        difficulty: 'beginner'
      },
      {
        id: 'q-01-04',
        type: 'mcq',
        question:
          'Which type of memory is used to store firmware in a microcontroller?',
        options: ['SRAM', 'DRAM', 'Flash Memory', 'Cache'],
        correct: 2,
        explanation:
          'Flash memory is non-volatile and retains data without power, making it ideal for storing firmware (the program). SRAM is volatile and used for runtime data (variables, stack). DRAM is not used in typical microcontrollers.',
        difficulty: 'beginner'
      },
      {
        id: 'q-01-05',
        type: 'mcq',
        question:
          'What does the volatile keyword do when accessing a hardware register in C?',
        options: [
          'Makes the variable constant',
          'Stores the variable in Flash memory',
          'Prevents the compiler from optimizing away reads/writes to that address',
          'Makes the variable accessible from interrupts only'
        ],
        correct: 2,
        explanation:
          'The volatile keyword tells the compiler that the value at that memory location can change unexpectedly (by hardware or interrupts), so the compiler must always read from and write to the actual memory address instead of caching the value in a register.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-01-06',
        type: 'mcq',
        question:
          'In the compilation process, which stage replaces #define macros with their values?',
        options: ['Compilation', 'Assembly', 'Preprocessing', 'Linking'],
        correct: 2,
        explanation:
          'The preprocessor stage handles all directives starting with # — including #define (macro replacement), #include (file inclusion), and #ifdef (conditional compilation). This happens before the actual C compiler sees the code.',
        difficulty: 'beginner'
      },
      {
        id: 'q-01-07',
        type: 'mcq',
        question: 'What is the hexadecimal representation of decimal 255?',
        options: ['0xEF', '0xFF', '0xF0', '0xFE'],
        correct: 1,
        explanation:
          '255 in binary is 1111 1111. Each nibble (4 bits) of 1111 = F in hex. So 255 = 0xFF. This is the maximum value for an unsigned 8-bit number.',
        difficulty: 'beginner'
      },
      {
        id: 'q-01-08',
        type: 'mcq',
        question:
          'What is the two\'s complement representation of -1 in 8 bits?',
        options: ['0x01', '0x80', '0xFE', '0xFF'],
        correct: 3,
        explanation:
          'To find -1: start with +1 (0000 0001), invert all bits (1111 1110 = 0xFE), add 1 (1111 1111 = 0xFF). So -1 in two\'s complement is 0xFF — all bits set to 1.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-01-09',
        type: 'mcq',
        question:
          'Which register holds the address of the next instruction to be executed?',
        options: [
          'Stack Pointer (SP)',
          'Link Register (LR)',
          'Program Counter (PC)',
          'Accumulator (ACC)'
        ],
        correct: 2,
        explanation:
          'The Program Counter (PC) always holds the address of the next instruction to be fetched. It is automatically incremented after each fetch. Branch and jump instructions explicitly modify the PC to redirect execution flow.',
        difficulty: 'beginner'
      },
      {
        id: 'q-01-10',
        type: 'mcq',
        question:
          'The linker stage of compilation is responsible for:',
        options: [
          'Replacing macros with their definitions',
          'Converting C code to assembly language',
          'Combining object files and resolving external symbol references',
          'Converting assembly to machine code'
        ],
        correct: 2,
        explanation:
          'The linker combines multiple object files (.o), resolves references to external symbols (like printf from libc), assigns final memory addresses, and produces the executable binary. Preprocessing handles macros, compilation produces assembly, and the assembler produces object files.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-01-11',
        type: 'mcq',
        question:
          'What is the key difference between SRAM and DRAM?',
        options: [
          'SRAM is non-volatile, DRAM is volatile',
          'SRAM uses capacitors, DRAM uses flip-flops',
          'SRAM is faster and does not need refresh; DRAM is cheaper but needs refresh',
          'SRAM is only used in hard drives'
        ],
        correct: 2,
        explanation:
          'SRAM uses flip-flops (6 transistors per bit) and holds data as long as power is supplied without needing refresh. DRAM uses capacitors (1 transistor + 1 capacitor per bit) that leak charge and must be periodically refreshed. Both are volatile. SRAM is faster but more expensive per bit.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-01-12',
        type: 'mcq',
        question:
          'In an ARM Cortex-M processor, what is the Link Register (LR/R14) used for?',
        options: [
          'Storing the stack size',
          'Holding the return address when a function is called',
          'Counting the number of interrupts',
          'Storing the main function address'
        ],
        correct: 1,
        explanation:
          'When a function (or subroutine) is called using a BL (Branch with Link) instruction, the current PC value (return address) is automatically saved in LR (R14). When the function finishes, it loads LR into PC to return to the caller. For nested calls, LR is pushed onto the stack.',
        difficulty: 'advanced'
      }
    ]
  }
};
