export const module = {
  id: 'module-02',
  title: 'Introduction to C Programming',
  description:
    'Explore the origins of C, understand why it dominates embedded systems, and write your first C programs. Learn the anatomy of a C program, the role of header files, and how code flows from source to execution.',
  icon: '📝',
  track: 'c-programming',
  estimatedHours: 5,
  prerequisites: ['module-01'],
  lessons: [
    {
      id: 'lesson-02-01',
      title: 'History of C and Why It Matters',
      content: `## The Birth of C

C was created by **Dennis Ritchie** at **Bell Labs** in **1972** as an evolution of the B programming language (created by Ken Thompson). It was originally designed to rewrite the **UNIX operating system**, which was previously written in assembly language.

### Timeline
| Year | Milestone |
|------|-----------|
| 1969 | Ken Thompson creates B language |
| 1972 | Dennis Ritchie creates C at Bell Labs |
| 1978 | "The C Programming Language" book (K&R C) by Kernighan & Ritchie |
| 1989 | ANSI C standard (C89/C90) |
| 1999 | C99 standard (inline, variable-length arrays, // comments) |
| 2011 | C11 standard (threads, atomic operations, _Generic) |
| 2018 | C17 standard (bug fixes to C11) |
| 2023 | C23 standard (latest) |

### Why C Dominates Embedded Systems

1. **Direct Hardware Access**: C can manipulate memory addresses, registers, and individual bits — essential for controlling hardware peripherals
2. **Minimal Runtime Overhead**: No garbage collector, no virtual machine. C code compiles to lean machine code that runs directly on the CPU
3. **Portability**: Write once, compile for any architecture — from 8-bit AVR to 64-bit ARM
4. **Deterministic Behavior**: Predictable memory usage and execution timing, critical for real-time systems
5. **Small Footprint**: A bare-metal C program can run in as little as 2 KB of Flash and 256 bytes of RAM
6. **Mature Ecosystem**: Decades of optimized compilers (GCC, Clang, IAR, Keil), debuggers (GDB, JTAG), and libraries

### Where C is Used Today
- **Operating Systems**: Linux kernel, Windows kernel, macOS kernel (XNU)
- **Embedded Systems**: Automotive ECUs, medical devices, IoT sensors, drones
- **Databases**: PostgreSQL, MySQL, SQLite
- **Compilers**: GCC, Clang/LLVM
- **Game Engines**: Parts of Unreal Engine, id Tech
- **Networking**: Network protocol stacks, routers, switches`,
      codeExamples: [
        {
          title: 'The classic first C program',
          code: `/* Dennis Ritchie's original style */
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
          output: 'Hello, World!'
        },
        {
          title: 'Embedded-style "Hello" — UART output',
          code: `// On a microcontroller, there is no terminal.
// We send text over UART (serial port) instead.

#include <stdint.h>

#define UART_BASE  0x40011000
#define UART_DR    (*(volatile uint32_t *)(UART_BASE + 0x04))
#define UART_SR    (*(volatile uint32_t *)(UART_BASE + 0x00))
#define TX_EMPTY   (1 << 7)

void uart_send_char(char c) {
    while (!(UART_SR & TX_EMPTY));  // Wait until transmit buffer is empty
    UART_DR = c;                    // Write character to data register
}

void uart_send_string(const char *str) {
    while (*str) {
        uart_send_char(*str++);
    }
}

int main(void) {
    uart_send_string("Hello, Embedded World!\\r\\n");
    while (1);  // Embedded programs never return
}`,
          output: 'Hello, Embedded World! (on serial terminal)'
        }
      ],
      keyPoints: [
        'C was created by Dennis Ritchie at Bell Labs in 1972',
        'C89/ANSI C is the most widely supported standard in embedded compilers',
        'C provides direct hardware access, minimal overhead, and deterministic behavior',
        'Most operating system kernels and embedded firmware are written in C',
        'C is portable across architectures — the same logic works on AVR, ARM, x86, RISC-V'
      ],
      commonMistakes: [
        'Thinking C is outdated — it remains the #1 language for systems and embedded programming',
        'Confusing C with C++ — C++ adds OOP features but is a different language with larger overhead',
        'Using C99/C11 features without checking if your embedded compiler supports them'
      ],
      interviewQuestions: [
        {
          question: 'Why is C preferred over C++ in resource-constrained embedded systems?',
          answer:
            'C has a simpler runtime with no exceptions, no RTTI, no virtual function tables, and no name mangling overhead. The generated binary is smaller and more predictable. In systems with 2-16 KB of Flash and 256 bytes to 2 KB of RAM (e.g., ATtiny, PIC), C++ features like classes, templates, and STL would consume too much memory. However, many 32-bit ARM projects do use C++ selectively.'
        },
        {
          question: 'What is the MISRA C standard, and why is it important?',
          answer:
            'MISRA C is a set of coding guidelines for safety-critical embedded C code, widely used in automotive (ISO 26262), medical (IEC 62304), and aerospace (DO-178C). It restricts dangerous C features like dynamic memory allocation, recursion, goto, and pointer arithmetic. Following MISRA C helps prevent undefined behavior, memory leaks, and runtime errors in life-critical systems.'
        }
      ]
    },
    {
      id: 'lesson-02-02',
      title: 'Structure of a C Program',
      content: `## Anatomy of a C Program

Every C program follows a defined structure. Understanding each section is crucial for writing organized, maintainable code.

### Basic Structure
\`\`\`
┌─────────────────────────────────────┐
│  1. Preprocessor Directives         │  #include, #define
├─────────────────────────────────────┤
│  2. Global Declarations             │  Global variables, function prototypes
├─────────────────────────────────────┤
│  3. main() Function                 │  Entry point of execution
├─────────────────────────────────────┤
│  4. User-Defined Functions          │  Helper functions
└─────────────────────────────────────┘
\`\`\`

### Section Details

**1. Preprocessor Directives** (lines starting with #)
- Processed before compilation
- \`#include\` brings in header files
- \`#define\` creates macros and constants

**2. Global Declarations**
- Variables accessible from all functions
- Function prototypes (declarations before definitions)
- Type definitions (\`typedef\`, \`struct\`, \`enum\`)

**3. The main() Function**
- Execution always begins at \`main()\`
- Returns \`int\` (0 for success, non-zero for error)
- Can accept command-line arguments: \`int main(int argc, char *argv[])\`

**4. User-Defined Functions**
- Modular blocks of code that perform specific tasks
- Declared before \`main()\` (prototype) and defined after (or before) \`main()\`

### Comments in C
\`\`\`c
/* This is a multi-line comment.
   Works in all C standards. */

// This is a single-line comment (C99 and later)
\`\`\`

### Embedded Systems Note
In embedded bare-metal programs, \`main()\` is called by a **startup file** (usually written in assembly) that:
1. Sets up the stack pointer
2. Copies initialized data from Flash to RAM
3. Zeros out the .bss section
4. Calls \`main()\`

The program typically never returns from \`main()\` — it runs an infinite loop.`,
      codeExamples: [
        {
          title: 'Complete C program structure',
          code: `/* ============================================
 * File: temperature_monitor.c
 * Purpose: Read sensor data and display alerts
 * Author: EmbedMaster Student
 * ============================================ */

// 1. Preprocessor Directives
#include <stdio.h>
#include <stdbool.h>

#define MAX_TEMP    85     // Maximum safe temperature in °C
#define MIN_TEMP    -40    // Minimum operating temperature
#define NUM_SENSORS 4

// 2. Global Declarations
int sensor_readings[NUM_SENSORS];

// Function prototypes (declarations)
void read_sensors(void);
bool check_alarm(int temp);
void display_status(int sensor_id, int temp);

// 3. main() Function — Entry Point
int main(void) {
    printf("Temperature Monitor v1.0\\n");
    printf("========================\\n\\n");

    read_sensors();

    for (int i = 0; i < NUM_SENSORS; i++) {
        display_status(i, sensor_readings[i]);
    }

    return 0;  // 0 = success
}

// 4. User-Defined Functions
void read_sensors(void) {
    // Simulated sensor values
    sensor_readings[0] = 25;
    sensor_readings[1] = 72;
    sensor_readings[2] = 90;   // Over limit!
    sensor_readings[3] = -10;
}

bool check_alarm(int temp) {
    return (temp > MAX_TEMP || temp < MIN_TEMP);
}

void display_status(int sensor_id, int temp) {
    printf("Sensor %d: %3d°C  [%s]\\n",
           sensor_id, temp,
           check_alarm(temp) ? "ALARM!" : "OK");
}`,
          output:
            'Temperature Monitor v1.0\n========================\n\nSensor 0:  25°C  [OK]\nSensor 1:  72°C  [OK]\nSensor 2:  90°C  [ALARM!]\nSensor 3: -10°C  [OK]'
        }
      ],
      keyPoints: [
        'C programs have 4 sections: preprocessor directives, global declarations, main(), user functions',
        'Execution always begins at the main() function',
        'Function prototypes must appear before the function is called',
        'main() returns int — 0 for success, non-zero for error',
        'In embedded systems, main() is called by a startup file and typically never returns'
      ],
      commonMistakes: [
        'Declaring main() as void main() — the standard requires int main(). Some embedded compilers accept void main() but it is non-standard',
        'Forgetting to declare function prototypes before main() — this causes implicit declaration warnings',
        'Placing executable statements outside of any function — only declarations are allowed at global scope'
      ],
      interviewQuestions: [
        {
          question: 'What happens before main() is called in an embedded system?',
          answer:
            'The startup code (usually in an assembly file like startup.s) runs first. It: (1) Initializes the stack pointer to the end of RAM, (2) Copies initialized global variables from Flash (.data section) to RAM, (3) Zeros the .bss section in RAM, (4) Optionally initializes the FPU and clock system, (5) Calls SystemInit() or similar for clock configuration, (6) Finally calls main(). This startup code is provided by the chip vendor or written manually.'
        },
        {
          question: 'Why does main() return int and not void in standard C?',
          answer:
            'The return value of main() communicates the exit status to the operating system or calling environment. A return value of 0 indicates successful execution; non-zero values indicate error conditions. The C standard (C89/C99/C11) specifies that main() must return int. Using void main() is non-standard and may cause undefined behavior on some platforms.'
        }
      ]
    },
    {
      id: 'lesson-02-03',
      title: 'Header Files and the Preprocessor',
      content: `## Header Files

Header files (**.h** files) contain **declarations** that are shared across multiple source files. They do not contain executable code (usually) — they declare interfaces.

### What Goes in a Header File
- Function prototypes (declarations)
- Macro definitions (\`#define\`)
- Type definitions (\`typedef\`, \`struct\`, \`enum\`)
- Global variable declarations (\`extern\`)
- Include guards

### Standard Library Headers
| Header | Purpose |
|--------|---------|
| \`<stdio.h>\` | Input/output: printf, scanf, fopen |
| \`<stdlib.h>\` | Memory allocation: malloc, free, atoi, exit |
| \`<string.h>\` | String operations: strlen, strcpy, strcmp |
| \`<stdint.h>\` | Fixed-width types: uint8_t, int32_t, uint16_t |
| \`<stdbool.h>\` | Boolean type: bool, true, false |
| \`<math.h>\` | Math functions: sin, cos, sqrt, pow |
| \`<stddef.h>\` | NULL, size_t, offsetof |

### \`<stdint.h>\` — Essential for Embedded
In embedded programming, exact data sizes matter. The standard \`int\` might be 16-bit on one platform and 32-bit on another. \`<stdint.h>\` guarantees exact sizes:

\`\`\`c
uint8_t   → exactly 8 bits,  unsigned (0 to 255)
int8_t    → exactly 8 bits,  signed   (-128 to 127)
uint16_t  → exactly 16 bits, unsigned (0 to 65535)
int16_t   → exactly 16 bits, signed   (-32768 to 32767)
uint32_t  → exactly 32 bits, unsigned (0 to 4294967295)
int32_t   → exactly 32 bits, signed
\`\`\`

### Include Guards
Prevent a header from being included multiple times (which would cause redefinition errors):

\`\`\`c
#ifndef SENSOR_H      // If SENSOR_H is NOT defined...
#define SENSOR_H      // ...define it

// Header contents here
void sensor_init(void);
int sensor_read(int channel);

#endif // SENSOR_H    // End of guard
\`\`\`

Modern alternative: \`#pragma once\` (supported by most compilers but not part of the C standard)

### \`#include <...>\` vs \`#include "..."\`
- **\`#include <stdio.h>\`**: Searches system/compiler include directories
- **\`#include "my_header.h"\`**: Searches the current directory first, then system directories`,
      codeExamples: [
        {
          title: 'Creating and using a custom header file',
          code: `// ---- sensor.h ---- (Header file)
#ifndef SENSOR_H
#define SENSOR_H

#include <stdint.h>

#define SENSOR_COUNT     4
#define TEMP_OFFSET      (-40)   // Sensor raw-to-celsius offset

typedef enum {
    SENSOR_OK,
    SENSOR_ERROR,
    SENSOR_TIMEOUT
} SensorStatus;

// Function prototypes
SensorStatus sensor_init(void);
int16_t sensor_read_temp(uint8_t channel);

#endif // SENSOR_H

// ---- sensor.c ---- (Implementation)
// #include "sensor.h"
// SensorStatus sensor_init(void) { ... }
// int16_t sensor_read_temp(uint8_t channel) { ... }

// ---- main.c ---- (Usage)
#include <stdio.h>
// #include "sensor.h"  // In real project

// Simulating the header contents here for a standalone example:
#include <stdint.h>
#define SENSOR_COUNT 4

int main() {
    printf("Monitoring %d sensors...\\n", SENSOR_COUNT);
    printf("Using uint8_t: size = %zu byte\\n", sizeof(uint8_t));
    printf("Using uint16_t: size = %zu bytes\\n", sizeof(uint16_t));
    printf("Using uint32_t: size = %zu bytes\\n", sizeof(uint32_t));
    return 0;
}`,
          output:
            'Monitoring 4 sensors...\nUsing uint8_t: size = 1 byte\nUsing uint16_t: size = 2 bytes\nUsing uint32_t: size = 4 bytes'
        }
      ],
      keyPoints: [
        'Header files contain declarations (prototypes, macros, types) — not definitions',
        'Use <stdint.h> for fixed-width integer types in embedded C',
        'Include guards (#ifndef / #define / #endif) prevent double inclusion',
        '#include <> searches system paths; #include "" searches current directory first',
        'Every .c file should include only the headers it actually needs'
      ],
      commonMistakes: [
        'Putting function definitions (not just declarations) in header files — this causes multiple definition errors when included by two .c files',
        'Forgetting include guards — leads to redefinition errors in multi-file projects',
        'Using int instead of uint8_t/uint32_t in embedded code — int size varies by platform'
      ],
      interviewQuestions: [
        {
          question:
            'Why should you use uint8_t instead of unsigned char in embedded systems?',
          answer:
            'uint8_t from <stdint.h> is explicitly 8 bits on every platform, making the code self-documenting and portable. unsigned char is also 8 bits on most platforms, but the name does not convey the intent of storing a numeric value versus a character. In a team, uint8_t clearly communicates that the variable holds an 8-bit unsigned integer, improving readability and preventing mistakes.'
        },
        {
          question:
            'What is the difference between #include <file.h> and #include "file.h"?',
          answer:
            '#include <file.h> searches only the system/compiler include paths (e.g., /usr/include, toolchain paths). #include "file.h" first searches the directory of the current source file, then falls back to the system paths. Use <> for standard library and third-party library headers; use "" for your project headers.'
        }
      ]
    },
    {
      id: 'lesson-02-04',
      title: 'Compilation, Linking, and Execution Flow',
      content: `## From Source Code to Running Program

Let us trace the complete journey of a multi-file C project from source to execution.

### Multi-File Compilation
Real embedded projects have many source files. Each \`.c\` file is compiled independently into an object file, then all object files are linked together.

\`\`\`
  main.c ──→ [gcc -c] ──→ main.o ─┐
                                    ├──→ [gcc -o] ──→ firmware.elf
  sensor.c ──→ [gcc -c] ──→ sensor.o ┘
                                         │
                                    libc.a (standard library)
\`\`\`

### Using Makefiles for Build Automation
In embedded projects, a **Makefile** automates the build process:

\`\`\`makefile
CC = arm-none-eabi-gcc
CFLAGS = -mcpu=cortex-m4 -mthumb -O2 -Wall

all: firmware.elf

firmware.elf: main.o sensor.o
    $(CC) $(CFLAGS) main.o sensor.o -o firmware.elf -T linker.ld

main.o: main.c sensor.h
    $(CC) $(CFLAGS) -c main.c -o main.o

sensor.o: sensor.c sensor.h
    $(CC) $(CFLAGS) -c sensor.c -o sensor.o

clean:
    rm -f *.o *.elf
\`\`\`

### The Linker Script
In embedded systems, a **linker script** (.ld) tells the linker where to place code and data in the target's memory map:

\`\`\`
MEMORY {
    FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 256K
    RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 64K
}

SECTIONS {
    .text : { *(.text*) } > FLASH          /* Code in Flash */
    .rodata : { *(.rodata*) } > FLASH      /* Constants in Flash */
    .data : { *(.data*) } > RAM AT > FLASH /* Initialized data */
    .bss : { *(.bss*) } > RAM              /* Uninitialized data */
}
\`\`\`

### Program Execution Flow
\`\`\`
Power On / Reset
     │
     ▼
Reset Handler (startup.s)
     │ → Set stack pointer
     │ → Copy .data from Flash to RAM
     │ → Zero .bss in RAM
     │ → Call SystemInit() (clock setup)
     │
     ▼
main()
     │
     ▼
  Infinite loop (while(1))
     │ → Read sensors
     │ → Process data
     │ → Update outputs
     │ → Handle interrupts
\`\`\``,
      codeExamples: [
        {
          title: 'Multi-file project example',
          code: `// ---- main.c ----
#include <stdio.h>

// Function prototype (declared in utils.h in real projects)
int add(int a, int b);
int multiply(int a, int b);

int main() {
    int x = 5, y = 3;

    printf("Add: %d + %d = %d\\n", x, y, add(x, y));
    printf("Mul: %d * %d = %d\\n", x, y, multiply(x, y));

    return 0;
}

// ---- utils.c ---- (separate file in real project)
// In this demo, we define them in the same file
int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

// Compile in real project:
// gcc -c main.c -o main.o
// gcc -c utils.c -o utils.o
// gcc main.o utils.o -o program`,
          output: 'Add: 5 + 3 = 8\nMul: 5 * 3 = 15'
        },
        {
          title: 'Viewing compilation stages',
          code: `// Compile with verbose output to see all stages:
// gcc -v -save-temps main.c -o main
//
// This produces:
//   main.i   — preprocessed file (all #includes expanded)
//   main.s   — assembly language
//   main.o   — object file (machine code)
//   main     — linked executable
//
// Useful commands for embedded developers:
//   arm-none-eabi-objdump -d main.o    # Disassemble
//   arm-none-eabi-size main.elf        # Show section sizes
//   arm-none-eabi-nm main.o            # List symbols

#include <stdio.h>
int main() {
    // This simple program goes through all 4 compilation stages
    printf("Compilation stages demo\\n");
    return 0;
}`,
          output: 'Compilation stages demo'
        }
      ],
      keyPoints: [
        'Each .c file is compiled independently into a .o object file',
        'The linker combines all .o files and libraries into the final executable',
        'Makefiles automate the build process — essential for multi-file projects',
        'Linker scripts define the memory layout for embedded targets',
        'Use arm-none-eabi-objdump and arm-none-eabi-size to inspect embedded binaries'
      ],
      commonMistakes: [
        'Forgetting to recompile all dependent files after changing a header — Makefiles handle this automatically',
        'Not using a linker script for embedded targets — the default linker script is for hosted (PC) environments',
        'Confusing compilation errors (syntax, type errors) with linker errors (undefined reference, multiple definition)'
      ],
      interviewQuestions: [
        {
          question:
            'What is the difference between a compilation error and a linker error?',
          answer:
            'A compilation error occurs when the compiler cannot parse or type-check the C code (e.g., syntax errors, undeclared variables, type mismatches). A linker error occurs when the linker cannot find a symbol definition (undefined reference) or finds duplicate definitions (multiple definition). Compilation errors are per-file; linker errors involve relationships between files.'
        },
        {
          question: 'What is a linker script and why is it needed in embedded systems?',
          answer:
            'A linker script (.ld) tells the linker where to place each section of the program in the target memory. It defines the memory regions (Flash start address, RAM start address, sizes) and maps sections (.text → Flash, .data → RAM, .bss → RAM). Without it, the linker uses a default layout designed for a PC OS, which would not match the embedded target memory map.'
        }
      ]
    },
    {
      id: 'lesson-02-05',
      title: 'Writing and Running Your First C Programs',
      content: `## Setting Up and Writing C Programs

### Development Environment Options
1. **PC (Linux/macOS/Windows)**: Install GCC and a text editor or IDE
   - Linux: \`sudo apt install gcc\` or \`sudo apt install build-essential\`
   - macOS: \`xcode-select --install\` (installs Clang as \`gcc\`)
   - Windows: Install MinGW-w64 or use WSL (Windows Subsystem for Linux)

2. **Embedded**: Install a cross-compiler toolchain
   - ARM: \`arm-none-eabi-gcc\` (from ARM GNU Toolchain)
   - AVR: \`avr-gcc\` (for Arduino)

### Compile and Run on Linux
\`\`\`bash
# Write your program
nano hello.c

# Compile
gcc hello.c -o hello -Wall -Wextra

# Run
./hello
\`\`\`

### Important GCC Flags
| Flag | Purpose |
|------|---------|
| \`-Wall\` | Enable all common warnings |
| \`-Wextra\` | Enable extra warnings |
| \`-Werror\` | Treat warnings as errors |
| \`-std=c99\` | Use C99 standard |
| \`-O0\` | No optimization (best for debugging) |
| \`-O2\` | Optimize for speed (release builds) |
| \`-Os\` | Optimize for size (embedded) |
| \`-g\` | Include debug symbols (for GDB) |
| \`-pedantic\` | Strict ISO C compliance |

### Best Practices for Beginners
1. **Always compile with warnings**: \`gcc -Wall -Wextra -Werror\`
2. **Read the error messages carefully**: GCC errors tell you the file, line number, and what went wrong
3. **Compile frequently**: Don't write 100 lines and then compile — compile after every small change
4. **Use a debugger**: Learn \`gdb\` early — \`printf\` debugging has limits
5. **Version control**: Use \`git init\` from day one`,
      codeExamples: [
        {
          title: 'Basic input and output',
          code: `#include <stdio.h>

int main() {
    char name[50];
    int age;
    float gpa;

    printf("Enter your name: ");
    scanf("%49s", name);    // %49s limits input to prevent buffer overflow

    printf("Enter your age: ");
    scanf("%d", &age);

    printf("Enter your GPA: ");
    scanf("%f", &gpa);

    printf("\\n--- Student Record ---\\n");
    printf("Name: %s\\n", name);
    printf("Age:  %d years\\n", age);
    printf("GPA:  %.2f\\n", gpa);

    return 0;
}`,
          output:
            'Enter your name: Siva\nEnter your age: 22\nEnter your GPA: 8.5\n\n--- Student Record ---\nName: Siva\nAge:  22 years\nGPA:  8.50'
        },
        {
          title: 'Printf format specifiers',
          code: `#include <stdio.h>
#include <stdint.h>

int main() {
    int decimal = 42;
    float pi = 3.14159f;
    char letter = 'A';
    char greeting[] = "Hello";
    uint32_t address = 0x40010800;

    // Common format specifiers
    printf("%%d  (int):          %d\\n", decimal);
    printf("%%u  (unsigned):     %u\\n", (unsigned)decimal);
    printf("%%x  (hex lower):    %x\\n", decimal);
    printf("%%X  (hex upper):    %X\\n", decimal);
    printf("%%o  (octal):        %o\\n", decimal);
    printf("%%f  (float):        %f\\n", pi);
    printf("%%.2f (2 decimals):  %.2f\\n", pi);
    printf("%%e  (scientific):   %e\\n", pi);
    printf("%%c  (char):         %c\\n", letter);
    printf("%%s  (string):       %s\\n", greeting);
    printf("%%p  (pointer):      %p\\n", (void *)&decimal);
    printf("%%08X (padded hex):  0x%08X\\n", address);
    printf("%%zu (size_t):       %zu\\n", sizeof(int));

    return 0;
}`,
          output:
            '%d  (int):          42\n%u  (unsigned):     42\n%x  (hex lower):    2a\n%X  (hex upper):    2A\n%o  (octal):        52\n%f  (float):        3.141590\n%.2f (2 decimals):  3.14\n%e  (scientific):   3.141590e+00\n%c  (char):         A\n%s  (string):       Hello\n%p  (pointer):      0x7ffd12345678\n%08X (padded hex):  0x40010800\n%zu (size_t):       4'
        },
        {
          title: 'Common beginner mistakes and fixes',
          code: `#include <stdio.h>

int main() {
    int x = 10;

    // MISTAKE 1: Missing & in scanf
    // scanf("%d", x);     // WRONG — crashes! (segfault)
    // scanf("%d", &x);    // CORRECT — pass address of x

    // MISTAKE 2: Using = instead of ==
    // if (x = 5)    // WRONG — this assigns 5 to x, always true
    // if (x == 5)   // CORRECT — this compares x with 5

    // MISTAKE 3: Integer division truncation
    int a = 7, b = 2;
    printf("7 / 2 = %d (integer division truncates!)\\n", a / b);
    printf("7 / 2 = %.1f (use float cast)\\n", (float)a / b);

    // MISTAKE 4: Forgetting \\n in printf
    printf("Line 1");     // No newline — next output appends here
    printf(" Line 2\\n");  // Newline at end

    return 0;
}`,
          output:
            '7 / 2 = 3 (integer division truncates!)\n7 / 2 = 3.5 (use float cast)\nLine 1 Line 2'
        }
      ],
      keyPoints: [
        'Always compile with -Wall -Wextra to catch potential issues early',
        'scanf requires the address-of operator (&) for non-array variables',
        'printf format specifiers must match the argument types exactly',
        'Integer division in C truncates the fractional part — cast to float if needed',
        'Use -Os for size optimization in embedded builds'
      ],
      commonMistakes: [
        'Forgetting & in scanf(&variable) — causes segmentation fault or undefined behavior',
        'Using = (assignment) instead of == (comparison) in if conditions',
        'Not checking the return value of scanf — it returns the number of items successfully read',
        'Buffer overflow with scanf("%s", ...) — always limit input size with %49s or use fgets'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between printf() and sprintf()?',
          answer:
            'printf() writes formatted output to stdout (the screen or serial terminal). sprintf() writes formatted output to a character buffer (string) in memory. In embedded systems without a display, sprintf() is useful for formatting data into a buffer before sending it over UART, SPI, or storing it in memory. snprintf() is preferred over sprintf() because it takes a size limit and prevents buffer overflow.'
        },
        {
          question: 'What are the risks of using scanf() in production code?',
          answer:
            'scanf() has several risks: (1) Buffer overflow with %s if input exceeds buffer size (use %Ns with a limit), (2) It leaves the newline character in the input buffer, causing issues with subsequent reads, (3) It does not handle invalid input gracefully — if the user enters "abc" for %d, scanf fails and leaves the input in the buffer causing infinite loops. In production embedded code, custom parsing functions or fgets() + sscanf() are safer alternatives.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-02-01',
        type: 'mcq',
        question: 'Who created the C programming language?',
        options: [
          'Bjarne Stroustrup',
          'Dennis Ritchie',
          'James Gosling',
          'Guido van Rossum'
        ],
        correct: 1,
        explanation:
          'Dennis Ritchie created C at Bell Labs in 1972. Bjarne Stroustrup created C++, James Gosling created Java, and Guido van Rossum created Python.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-02',
        type: 'mcq',
        question: 'What is the correct return type of main() in standard C?',
        options: ['void', 'int', 'float', 'char'],
        correct: 1,
        explanation:
          'The C standard specifies that main() must return int. A return value of 0 indicates success; non-zero indicates an error. void main() is non-standard and may cause undefined behavior.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-03',
        type: 'mcq',
        question:
          'Which header file provides fixed-width integer types like uint8_t and int32_t?',
        options: ['<stdio.h>', '<stdlib.h>', '<stdint.h>', '<string.h>'],
        correct: 2,
        explanation:
          '<stdint.h> (introduced in C99) provides exact-width integer types: int8_t, uint8_t, int16_t, uint16_t, int32_t, uint32_t, etc. These are essential in embedded programming where exact data sizes matter.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-04',
        type: 'mcq',
        question:
          'What does the GCC flag -Wall do?',
        options: [
          'Links all libraries automatically',
          'Enables all common compiler warnings',
          'Compiles for Windows',
          'Optimizes for wall-clock speed'
        ],
        correct: 1,
        explanation:
          '-Wall enables all commonly used compiler warnings. It helps catch potential bugs like unused variables, missing return values, and implicit type conversions. Always use -Wall (and -Wextra) during development.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-05',
        type: 'mcq',
        question:
          'In a multi-file C project, what is the role of the linker?',
        options: [
          'Checks syntax of C code',
          'Replaces #include directives',
          'Converts C to assembly',
          'Combines object files and resolves external references'
        ],
        correct: 3,
        explanation:
          'The linker takes object files (.o) produced by the compiler, resolves references between them (e.g., a function called in main.o but defined in utils.o), links with library code, and produces the final executable.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-02-06',
        type: 'mcq',
        question:
          'What is the output of: printf("%d", 7/2); ?',
        options: ['3.5', '3', '4', '3.0'],
        correct: 1,
        explanation:
          'Integer division in C truncates the decimal part. 7/2 = 3 (not 3.5). Both operands are int, so the result is int. To get 3.5, you would need: (float)7/2 or 7.0/2.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-07',
        type: 'mcq',
        question:
          'What is the purpose of include guards in header files?',
        options: [
          'To encrypt the header file contents',
          'To prevent the header from being included more than once',
          'To make the header file compile faster',
          'To restrict access to certain functions'
        ],
        correct: 1,
        explanation:
          'Include guards (#ifndef / #define / #endif) prevent a header file from being included multiple times in the same translation unit, which would cause redefinition errors. When the header is first included, the guard macro is defined. Subsequent includes see the macro is already defined and skip the contents.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-08',
        type: 'mcq',
        question:
          'What is wrong with: scanf("%d", x); where x is an int?',
        options: [
          'Nothing, it is correct',
          'Missing & operator — should be scanf("%d", &x)',
          '%d should be %i',
          'scanf cannot read integers'
        ],
        correct: 1,
        explanation:
          'scanf needs the memory address of the variable to store the input value. Without &, you pass the value of x (not its address), which causes undefined behavior — typically a segmentation fault. The correct form is scanf("%d", &x). Arrays do not need & because the array name already decays to a pointer.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-09',
        type: 'mcq',
        question:
          'Which C standard introduced single-line comments (//) and the bool type?',
        options: ['C89 (ANSI C)', 'C99', 'C11', 'C23'],
        correct: 1,
        explanation:
          'C99 (1999) introduced single-line comments (//), the bool type (via <stdbool.h>), variable-length arrays, inline functions, designated initializers, and declarations mixed with code. C89 only had /* */ comments and no native boolean type.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-02-10',
        type: 'mcq',
        question:
          'In embedded systems, what does the startup code do before calling main()?',
        options: [
          'Compiles the source code',
          'Downloads firmware from the internet',
          'Initializes stack pointer, copies .data to RAM, zeros .bss, configures clocks',
          'Runs the operating system bootloader'
        ],
        correct: 2,
        explanation:
          'The startup code (startup.s) is the first code that runs after reset. It sets the stack pointer to the top of RAM, copies initialized global variables from Flash to RAM (.data section), zeros uninitialized globals (.bss section), optionally configures the clock system, and then calls main().',
        difficulty: 'intermediate'
      },
      {
        id: 'q-02-11',
        type: 'mcq',
        question:
          'What is the difference between #include <file.h> and #include "file.h"?',
        options: [
          'No difference — they are identical',
          '<file.h> is for C files, "file.h" is for C++ files',
          '<file.h> searches system paths; "file.h" searches current directory first',
          '<file.h> includes the whole file; "file.h" includes only declarations'
        ],
        correct: 2,
        explanation:
          '#include <file.h> searches only the system/compiler include directories. #include "file.h" first searches the directory of the current source file, then falls back to system directories. Use angle brackets for standard library headers and quotes for your project\'s own headers.',
        difficulty: 'beginner'
      },
      {
        id: 'q-02-12',
        type: 'mcq',
        question:
          'Why is C preferred over Python for programming microcontrollers?',
        options: [
          'C has more libraries available',
          'C compiles to native machine code with minimal runtime overhead and deterministic timing',
          'Python does not support if-else statements',
          'C programs are always shorter than Python programs'
        ],
        correct: 1,
        explanation:
          'C compiles directly to machine code that runs on the bare CPU with no interpreter, no virtual machine, and no garbage collector. This gives C programs minimal memory usage, deterministic execution timing (crucial for real-time systems), and direct hardware access. Python requires a runtime environment that is too large for most microcontrollers.',
        difficulty: 'intermediate'
      }
    ]
  }
};
