export const module15 = {
  id: 'module-15',
  title: 'Embedded C Specifics & ISRs',
  description: 'Learn the core concepts that separate generic C programming from Embedded C: the volatile keyword, const placement, function pointers for callbacks, and writing Interrupt Service Routines (ISRs).',
  icon: '🎛️',
  track: 'advanced-c',
  estimatedHours: 6,
  prerequisites: ['module-06', 'module-11'],
  lessons: [
    {
      id: 'lesson-15-1',
      title: 'The volatile Keyword Deep Dive',
      content: 'In embedded systems, hardware registers and memory locations shared with interrupts can change independently of the main program flow. The `volatile` keyword tells the compiler: "Do not optimize read/write operations to this variable. Always fetch it fresh from RAM/hardware."\n\nWithout `volatile`, modern optimizing compilers will cache hardware registers in CPU registers, resulting in infinite loops or ignored hardware signals.',
      codeExamples: [
        {
          title: 'Waiting for a Hardware Flag',
          code: `#include <stdint.h>\n\n// Bad: Compiler might optimize this to 'while(1)' if bit is 0 initially\n// uint8_t *status_reg = (uint8_t *)0x40001000;\n\n// Good: Compiler must read the address every loop iteration\nvolatile uint8_t *status_reg = (volatile uint8_t *)0x40001000;\n\nvoid wait_for_ready() {\n    // Wait until bit 0 becomes 1 (Hardware changes it)\n    while ( (*status_reg & 0x01) == 0 ) {\n        // Do nothing\n    }\n}`,
          output: `(No output - Hardware polling loop)`
        }
      ],
      keyPoints: [
        '`volatile` prevents aggressive compiler optimizations.',
        'Use it for: Memory-mapped peripheral registers, Global variables modified by an ISR, Global variables shared between RTOS tasks.',
        '`volatile` does NOT make operations atomic or thread-safe.'
      ],
      commonMistakes: [
        'Forgetting `volatile` on flags shared between `main()` and an ISR. The `main` loop will never see the flag change.',
        'Using `volatile` to fix thread-safety issues (you need mutexes or atomic operations for that).'
      ],
      interviewQuestions: [
        {
          question: 'Can a pointer be both `const` and `volatile`?',
          answer: 'Yes. `const volatile uint32_t *reg;` means the pointer points to a hardware register that the hardware can change (volatile), but the software is not allowed to write to it (const), such as a Read-Only hardware status register.'
        }
      ]
    },
    {
      id: 'lesson-15-2',
      title: 'const and ROM placement',
      content: 'In embedded systems, RAM is heavily constrained (often just kilobytes), while Flash (ROM) is larger. By declaring variables as `const`, you not only prevent accidental modification in software, but the linker will physically place the data in Flash memory rather than RAM.',
      codeExamples: [
        {
          title: 'Saving RAM with const',
          code: `#include <stdio.h>\n\n// Goes in RAM (.data section). Uses RAM permanently.\nchar greeting_ram[] = "Hello World"; \n\n// Goes in Flash/ROM (.rodata section). Saves RAM!\nconst char greeting_rom[] = "Hello World"; \n\n// Look up tables should ALWAYS be const\nconst float sine_wave[256] = {0.0, 0.024, 0.049, /* ... */};\n\nint main() {\n    printf("%s\\n", greeting_rom);\n    return 0;\n}`,
          output: `Hello World`
        }
      ],
      keyPoints: [
        '`const` enforces read-only access at compile time.',
        'In embedded toolchains, `const` data is stored in the `.rodata` section (Flash memory).',
        'Always use `const` for strings, lookup tables, and configuration structures.'
      ],
      commonMistakes: [
        'Declaring large lookup tables without `const`. On boot, the startup code will copy the entire table from Flash into RAM, wasting precious RAM.'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between `const char *ptr` and `char * const ptr`?',
          answer: '`const char *ptr` is a pointer to constant data (cannot change characters, can point elsewhere). `char * const ptr` is a constant pointer (cannot point elsewhere, but can change characters). `const char * const ptr` means neither can change.'
        }
      ]
    },
    {
      id: 'lesson-15-3',
      title: 'Interrupt Service Routines (ISRs)',
      content: 'An ISR (or Interrupt Handler) is a special function triggered by hardware (e.g., a timer ticking, a button press, a UART byte arriving). ISRs preempt the main program, execute quickly, and return control.\n\nWriting ISRs in C requires following strict rules: keep them extremely short, do not use blocking delays, and do not use non-reentrant functions (like `printf` or `malloc`).',
      codeExamples: [
        {
          title: 'A Typical ISR',
          code: `#include <stdint.h>\n#include <stdbool.h>\n\nvolatile bool data_ready = false;\nvolatile uint8_t rx_data = 0;\n\n// Compiler-specific attribute to mark as interrupt\nvoid __attribute__((interrupt)) UART_RX_ISR(void) {\n    // 1. Read hardware data\n    rx_data = *(volatile uint8_t*)0x40001004; \n    \n    // 2. Set flag for main loop\n    data_ready = true;\n    \n    // 3. Clear hardware interrupt pending flag\n    *(volatile uint8_t*)0x40001000 &= ~(1<<4);\n}\n\nint main() {\n    while(1) {\n        if (data_ready) {\n            data_ready = false; // clear flag\n            // Process rx_data here...\n        }\n    }\n}`,
          output: `(No output - hardware execution)`
        }
      ],
      keyPoints: [
        'ISRs must be fast and never block.',
        'Communicate from ISR to main loop using `volatile` flags or RTOS queues.',
        'Clear the hardware interrupt pending flag inside the ISR, or it will trigger infinitely.'
      ],
      commonMistakes: [
        'Putting a `delay_ms(100)` or `printf()` inside an ISR. This ruins system timing and can cause crashes.',
        'Forgetting to clear the interrupt flag.'
      ],
      interviewQuestions: [
        {
          question: 'What happens if you use `printf()` inside an ISR?',
          answer: '`printf` is slow, uses dynamically allocated memory (often), and is not reentrant. Calling it in an ISR can stall the system, cause missed interrupts, or corrupt data if `printf` was already executing in the main loop.'
        }
      ]
    },
    {
      id: 'lesson-15-4',
      title: 'Function Pointers and Callback Tables',
      content: 'Function pointers store the memory address of a function. In embedded C, they are vital for creating hardware abstraction layers (HALs), state machines, and dynamic interrupt vector tables (callbacks).',
      codeExamples: [
        {
          title: 'Using Function Pointers for Callbacks',
          code: `#include <stdio.h>\n\n// Define a function pointer type\ntypedef void (*ButtonCallback_t)(void);\n\nButtonCallback_t current_callback = NULL;\n\n// Register the callback\nvoid register_button_callback(ButtonCallback_t cb) {\n    current_callback = cb;\n}\n\n// Simulated ISR\nvoid Hardware_Button_ISR() {\n    if (current_callback != NULL) {\n        current_callback(); // Execute the callback\n    }\n}\n\nvoid on_button_press() {\n    printf("Button was clicked!\\n");\n}\n\nint main() {\n    register_button_callback(on_button_press);\n    Hardware_Button_ISR(); // Simulate interrupt\n    return 0;\n}`,
          output: `Button was clicked!`
        }
      ],
      keyPoints: [
        'Syntax: `return_type (*pointer_name)(parameter_types);`',
        '`typedef` makes function pointers much easier to read.',
        'Always check if a function pointer is `NULL` before executing it.'
      ],
      commonMistakes: [
        'Confusing function pointers with normal pointers, resulting in syntax errors.',
        'Executing a `NULL` function pointer, which jumps the PC (Program Counter) to address 0x00000000, causing a HardFault.'
      ],
      interviewQuestions: [
        {
          question: 'How do you create an array of function pointers?',
          answer: '`void (*func_array[10])(void);` or preferably using a typedef: `typedef void (*FuncPtr)(void); FuncPtr func_array[10];`. This is heavily used in state machines.'
        }
      ]
    },
    {
      id: 'lesson-15-5',
      title: 'Reentrancy and Thread Safety',
      content: 'A function is "reentrant" if it can be interrupted in the middle of its execution, called again (e.g., by an ISR or another thread), and still function correctly. Non-reentrant functions usually rely on global or static variables. In an interrupt-driven or RTOS environment, calling non-reentrant functions concurrently causes data corruption.',
      codeExamples: [
        {
          title: 'Non-Reentrant vs Reentrant',
          code: `// NON-REENTRANT: Uses a global static variable\nstatic int temp_result = 0;\nint non_reentrant_add(int a, int b) {\n    temp_result = a + b;\n    // If interrupted here, temp_result gets overwritten!\n    return temp_result;\n}\n\n// REENTRANT: Uses only local stack variables\nint reentrant_add(int a, int b) {\n    int result = a + b; // Each call has its own 'result' on the stack\n    return result;\n}`,
          output: `Conceptual Example`
        }
      ],
      keyPoints: [
        'Reentrant functions only use local variables (stack) and arguments.',
        'Avoid `static` or global variables inside functions used by multiple tasks/ISRs unless protected by critical sections (disabling interrupts) or mutexes.',
        'Standard library functions like `strtok` and `rand` are traditionally non-reentrant (use `strtok_r` instead).'
      ],
      commonMistakes: [
        'Calling standard `printf` from both main and an ISR simultaneously, resulting in garbled text on the UART.'
      ],
      interviewQuestions: [
        {
          question: 'What makes a function non-reentrant?',
          answer: 'A function is non-reentrant if it modifies global/static variables, modifies hardware registers without protection, calls other non-reentrant functions, or uses dynamic memory.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-15-1',
        type: 'mcq',
        question: 'What does the `volatile` keyword do?',
        options: ['Speeds up execution', 'Prevents the compiler from optimizing away memory accesses', 'Stores the variable in Flash memory', 'Makes the variable thread-safe'],
        correct: 1,
        explanation: 'volatile forces the compiler to emit memory load/store instructions every time the variable is accessed, preventing it from caching the value in a CPU register.',
        difficulty: 'beginner'
      },
      {
        id: 'q-15-2',
        type: 'mcq',
        question: 'Where should a large lookup table (like a sine wave array) be stored in an embedded system?',
        options: ['RAM', 'EEPROM', 'Flash (ROM)', 'Registers'],
        correct: 2,
        explanation: 'Lookup tables are read-only. Declaring them as `const` places them in Flash memory, saving precious RAM for dynamic data.',
        difficulty: 'beginner'
      },
      {
        id: 'q-15-3',
        type: 'mcq',
        question: 'Which of the following is a strict rule for writing Interrupt Service Routines (ISRs)?',
        options: ['They must return an integer', 'They should use malloc to allocate buffers', 'They should be as short and fast as possible', 'They should print debug messages via UART'],
        correct: 2,
        explanation: 'ISRs preempt the main code. Long ISRs block other interrupts and ruin the real-time responsiveness of the system. Never use malloc or print in an ISR.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-15-4',
        type: 'mcq',
        question: 'What happens if you do not clear the hardware interrupt pending flag inside an ISR?',
        options: ['The microcontroller resets', 'The ISR will execute exactly once and never again', 'The ISR will re-trigger immediately upon exit, locking up the system', 'The compiler throws an error'],
        correct: 2,
        explanation: 'The hardware keeps requesting the interrupt until the software acknowledges it by clearing the specific flag in the peripheral\'s status register.',
        difficulty: 'advanced'
      },
      {
        id: 'q-15-5',
        type: 'mcq',
        question: 'What does `typedef void (*Callback)(int);` define?',
        options: ['A function that returns a void pointer', 'An integer array', 'A new type named Callback which is a pointer to a function taking an int and returning void', 'A volatile variable'],
        correct: 2,
        explanation: 'This is the standard syntax for defining a function pointer type, making it easy to pass functions as arguments to other functions.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-15-6',
        type: 'mcq',
        question: 'Why must a flag shared between an ISR and a while(1) loop in main be declared `volatile`?',
        options: ['To save memory', 'Because the compiler cannot see the ISR modifying the flag from the context of main', 'To make it read-only', 'To increase polling speed'],
        correct: 1,
        explanation: 'Without volatile, the compiler analyzing `main()` sees a loop polling a variable that `main()` never modifies. It optimizes it to an infinite loop, ignoring the ISR updates.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-15-7',
        type: 'mcq',
        question: 'What makes a function reentrant?',
        options: ['It uses static variables', 'It uses dynamic memory', 'It relies solely on local stack variables and arguments', 'It disables interrupts'],
        correct: 2,
        explanation: 'Because every task/interrupt has its own stack, functions that only use stack variables are naturally safe to be interrupted and called concurrently.',
        difficulty: 'advanced'
      },
      {
        id: 'q-15-8',
        type: 'mcq',
        question: 'Can you pass arguments to an ISR?',
        options: ['Yes, exactly one argument', 'Yes, standard argc and argv', 'No, ISRs take no arguments and return void', 'Only pointers can be passed'],
        correct: 2,
        explanation: 'ISRs are called by the hardware/CPU core, not by software. The hardware does not pass arguments to the C function. Data must be accessed via registers or global variables.',
        difficulty: 'beginner'
      },
      {
        id: 'q-15-9',
        type: 'mcq',
        question: 'What is a "Hard Fault" in ARM Cortex-M?',
        options: ['A compiler error', 'An exception caused by a severe system error, like jumping to NULL or unaligned memory access', 'A broken pin on the microcontroller', 'A memory leak'],
        correct: 1,
        explanation: 'HardFault is the default exception handler for fatal hardware errors, such as executing data (dereferencing a bad function pointer) or misaligned memory access.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-15-10',
        type: 'mcq',
        question: 'What does `const volatile uint32_t *ptr;` indicate?',
        options: ['A syntax error', 'A pointer to a memory location that hardware can change, but software cannot write to', 'A pointer that software can change, but hardware cannot', 'A pointer that points to itself'],
        correct: 1,
        explanation: 'This is exactly how you map a read-only hardware status register (like a timer counter). It\'s volatile because the timer increments it, and const because writing to it from C makes no sense.',
        difficulty: 'advanced'
      }
    ]
  }
};

export default module15;
