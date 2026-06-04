export const module11 = {
  id: 'module-11',
  title: 'Structures, Unions, and Memory Alignment',
  description: 'Master complex data types in C, understand memory alignment and padding, and learn how to map hardware registers using structures.',
  icon: '🏗️',
  track: 'advanced-c',
  estimatedHours: 6,
  prerequisites: ['module-03', 'module-05'],
  lessons: [
    {
      id: 'lesson-11-1',
      title: 'Structures and typedef',
      content: 'Structures (`struct`) in C allow you to group related variables of different data types under a single name. This is crucial for representing complex entities. Using `typedef` alongside structures simplifies the syntax for declaring variables of that structure type.\n\nIn embedded systems, structures are used extensively to manage state machines, group related configuration parameters, and most importantly, map to hardware peripheral registers.',
      codeExamples: [
        {
          title: 'Defining and Using a Structure',
          code: `#include <stdio.h>\n\ntypedef struct {\n    uint8_t id;\n    float temperature;\n    uint16_t status_flags;\n} SensorData_t;\n\nint main() {\n    SensorData_t sensor1 = { 1, 25.5f, 0x000F };\n    printf("Sensor ID: %d, Temp: %.1f\\n", sensor1.id, sensor1.temperature);\n    return 0;\n}`,
          output: `Sensor ID: 1, Temp: 25.5`
        }
      ],
      keyPoints: [
        'Structures group different data types together.',
        'typedef creates aliases for data types, making code cleaner.',
        'Structures are foundational for organizing complex embedded software.'
      ],
      commonMistakes: [
        'Forgetting the semicolon at the end of a struct definition.',
        'Passing large structures by value instead of by reference (pointer) to functions, causing unnecessary memory overhead.'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between an array and a structure?',
          answer: 'An array is a collection of elements of the same data type, accessed by index. A structure is a collection of elements of potentially different data types, accessed by member names.'
        }
      ]
    },
    {
      id: 'lesson-11-2',
      title: 'Unions',
      content: 'A `union` is a special data type in C that allows you to store different data types in the same memory location. You can define a union with many members, but only one member can contain a value at any given time. The size of the union is equal to the size of its largest member.\n\nUnions are highly useful in embedded systems for type punning (interpreting a block of memory as different types) or when dealing with data packets that can have different payloads depending on a message ID.',
      codeExamples: [
        {
          title: 'Union Example',
          code: `#include <stdio.h>\n#include <stdint.h>\n\ntypedef union {\n    uint32_t full_word;\n    uint8_t bytes[4];\n} DataPacket_t;\n\nint main() {\n    DataPacket_t packet;\n    packet.full_word = 0x11223344;\n    // Assuming Little-Endian architecture\n    printf("Byte 0: 0x%X\\n", packet.bytes[0]);\n    printf("Byte 3: 0x%X\\n", packet.bytes[3]);\n    return 0;\n}`,
          output: `Byte 0: 0x44\nByte 3: 0x11`
        }
      ],
      keyPoints: [
        'Unions allocate enough memory for their largest member.',
        'Writing to one member of a union overwrites the others.',
        'Useful for memory optimization and type conversion.'
      ],
      commonMistakes: [
        'Reading from a union member that was not the most recently written one (results in undefined or implementation-defined behavior, though often used for type punning in C).',
        'Not considering endianness when accessing individual bytes of a larger integer type using a union.'
      ],
      interviewQuestions: [
        {
          question: 'When would you use a union instead of a struct?',
          answer: 'Use a union when you need to represent mutually exclusive data fields to save memory, or when you need to interpret the same underlying memory in different ways (e.g., breaking a 32-bit integer into 4 individual bytes).'
        }
      ]
    },
    {
      id: 'lesson-11-3',
      title: 'Memory Alignment and Structure Padding',
      content: 'Processors are designed to access memory more efficiently when data is aligned to specific boundaries (e.g., 4-byte boundaries for 32-bit integers). To ensure this alignment, C compilers automatically insert "padding" bytes between structure members or at the end of the structure.\n\nWhile padding improves access speed, it increases memory usage. In memory-constrained embedded systems, or when defining structures for network packets or hardware registers, this implicit padding can cause critical issues.',
      codeExamples: [
        {
          title: 'Structure Padding in Action',
          code: `#include <stdio.h>\n#include <stdint.h>\n\nstruct Unoptimized {\n    char a;      // 1 byte\n    // 3 bytes padding here on 32-bit systems\n    int b;       // 4 bytes\n    char c;      // 1 byte\n    // 3 bytes padding here\n};\n\nstruct Optimized {\n    int b;       // 4 bytes\n    char a;      // 1 byte\n    char c;      // 1 byte\n    // 2 bytes padding at the end\n};\n\nint main() {\n    printf("Size of Unoptimized: %zu\\n", sizeof(struct Unoptimized));\n    printf("Size of Optimized: %zu\\n", sizeof(struct Optimized));\n    return 0;\n}`,
          output: `Size of Unoptimized: 12\nSize of Optimized: 8`
        }
      ],
      keyPoints: [
        'Compilers pad structures to align members for faster CPU access.',
        'Padding wastes memory space.',
        'Reordering structure members (largest to smallest) can minimize padding.'
      ],
      commonMistakes: [
        'Assuming `sizeof(struct)` equals the sum of the sizes of its members.',
        'Transmitting a padded struct over a network or UART directly; the receiver might have different padding rules, leading to data corruption.'
      ],
      interviewQuestions: [
        {
          question: 'Why does structure padding exist?',
          answer: 'Padding aligns data in memory according to the architecture\'s requirements. Unaligned memory access can cause performance penalties or hardware faults (e.g., HardFault on ARM Cortex-M0).'
        },
        {
          question: 'How can you minimize structure padding?',
          answer: 'By ordering the members in descending order of their size (e.g., 8-byte types first, then 4-byte, 2-byte, and finally 1-byte types).'
        }
      ]
    },
    {
      id: 'lesson-11-4',
      title: 'Packed Structures',
      content: 'When you must avoid structure padding entirely—such as when defining network protocol headers, parsing files, or interfacing with certain hardware—you can use compiler-specific attributes or pragmas to "pack" the structure.\n\nIn GCC, this is done using `__attribute__((packed))`. Be aware that packed structures can lead to unaligned memory accesses, which are slower or might cause exceptions on some architectures.',
      codeExamples: [
        {
          title: 'Using __attribute__((packed))',
          code: `#include <stdio.h>\n#include <stdint.h>\n\nstruct __attribute__((packed)) PackedStruct {\n    char a;      // 1 byte\n    int b;       // 4 bytes\n    char c;      // 1 byte\n};\n\nint main() {\n    printf("Size of PackedStruct: %zu\\n", sizeof(struct PackedStruct));\n    return 0;\n}`,
          output: `Size of PackedStruct: 6`
        }
      ],
      keyPoints: [
        'Packed structures have exactly 0 bytes of padding.',
        '`__attribute__((packed))` is common in GCC/Clang; `#pragma pack` is used in MSVC/others.',
        'Use packed structures cautiously due to unaligned access penalties.'
      ],
      commonMistakes: [
        'Using packed structures for everything to save memory, disregarding the performance hit of unaligned accesses.',
        'Taking the address of a packed structure member and passing it to a function expecting an aligned pointer.'
      ],
      interviewQuestions: [
        {
          question: 'What is the downside of using packed structures?',
          answer: 'Accessing unaligned members in a packed structure can be significantly slower because the CPU may need multiple read cycles to fetch the data. On some strict architectures (like ARM Cortex-M0), unaligned accesses will cause a hard fault (crash).'
        }
      ]
    },
    {
      id: 'lesson-11-5',
      title: 'Memory-Mapping Hardware Registers',
      content: 'One of the most powerful uses of C in embedded systems is mapping structures directly to memory-mapped hardware registers. By carefully designing a structure to match the layout of a peripheral\'s registers as defined in the MCU datasheet, you can access hardware with simple structure syntax.\n\nThese structures must almost always use `volatile` to prevent compiler optimizations, and they rely heavily on exact memory offsets, so understanding padding is critical.',
      codeExamples: [
        {
          title: 'Mapping a UART Peripheral',
          code: `#include <stdint.h>\n\n// Assuming UART base address is 0x40001000\n#define UART_BASE 0x40001000\n\ntypedef struct {\n    volatile uint32_t STATUS;    // Offset 0x00\n    volatile uint32_t DATA;      // Offset 0x04\n    volatile uint32_t BAUD;      // Offset 0x08\n    volatile uint32_t CTRL;      // Offset 0x0C\n} UART_RegDef_t;\n\n#define UART1 ((UART_RegDef_t*)UART_BASE)\n\nvoid UART_SendChar(char c) {\n    // Wait until TX buffer is empty (bit 1 of STATUS)\n    while (!(UART1->STATUS & (1 << 1)));\n    UART1->DATA = c;\n}`,
          output: `(No output - Hardware level code)`
        }
      ],
      keyPoints: [
        'Peripheral registers are just memory locations at specific addresses.',
        'Structures can mirror the layout of these registers.',
        '`volatile` is mandatory for hardware register access.'
      ],
      commonMistakes: [
        'Forgetting `volatile`, causing the compiler to optimize out register reads/writes.',
        'Mismatching the structure layout with the datasheet offsets (e.g., due to unexpected padding or wrong data types).'
      ],
      interviewQuestions: [
        {
          question: 'How do you access a specific memory address directly in C?',
          answer: 'By casting the numerical address to a pointer of the appropriate type and dereferencing it, e.g., `*(volatile uint32_t*)0x40001000 = 0x01;`'
        },
        {
          question: 'Why define hardware registers as a struct rather than individual macros?',
          answer: 'Structures provide better organization, easier debugging (you can view the whole peripheral in a debugger watch window), and allow you to pass a pointer to a specific peripheral instance to a generic driver function.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-11-1',
        type: 'mcq',
        question: 'What is the main purpose of `typedef`?',
        options: ['To create a new data type', 'To create an alias for an existing data type', 'To define a macro', 'To allocate memory'],
        correct: 1,
        explanation: 'typedef simply creates a new name (alias) for an existing data type, making code more readable.',
        difficulty: 'beginner'
      },
      {
        id: 'q-11-2',
        type: 'mcq',
        question: 'In a union, how is memory allocated?',
        options: ['Sum of sizes of all members', 'Size of the smallest member', 'Size of the largest member', 'Size determined at runtime'],
        correct: 2,
        explanation: 'A union allocates enough memory to hold its largest member, as all members share the same memory location.',
        difficulty: 'beginner'
      },
      {
        id: 'q-11-3',
        type: 'mcq',
        question: 'What is structure padding?',
        options: ['Adding extra structures to an array', 'Compilers inserting empty bytes to align data on memory boundaries', 'Initializing structure members to zero', 'Compressing structure data'],
        correct: 1,
        explanation: 'Compilers insert padding bytes between structure members to ensure that each member starts at an memory address suitable for its data type, improving access speed.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-11-4',
        type: 'mcq',
        question: 'Given: struct { char a; int b; char c; }; What is likely the size on a 32-bit system?',
        options: ['6 bytes', '8 bytes', '12 bytes', '4 bytes'],
        correct: 2,
        explanation: 'a (1 byte) + 3 bytes padding to align b to 4-byte boundary + b (4 bytes) + c (1 byte) + 3 bytes padding at the end to make the total size a multiple of 4. Total = 12 bytes.',
        difficulty: 'advanced'
      },
      {
        id: 'q-11-5',
        type: 'mcq',
        question: 'How do you force GCC to remove structure padding?',
        options: ['#pragma unpad', '__attribute__((packed))', 'struct_pack macro', 'volatile struct'],
        correct: 1,
        explanation: '__attribute__((packed)) tells GCC not to add any padding bytes.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-11-6',
        type: 'mcq',
        question: 'Why are packed structures dangerous on some ARM Cortex-M processors?',
        options: ['They use too much memory', 'They can cause unaligned memory access faults', 'They prevent the use of pointers', 'They corrupt other variables'],
        correct: 1,
        explanation: 'Some architectures (like ARMv6-M) do not support unaligned memory access in hardware. Trying to read a 32-bit integer that is not on a 4-byte boundary will cause a HardFault.',
        difficulty: 'advanced'
      },
      {
        id: 'q-11-7',
        type: 'mcq',
        question: 'When memory-mapping hardware registers using a struct, what keyword must be used on the members?',
        options: ['static', 'extern', 'volatile', 'const'],
        correct: 2,
        explanation: 'volatile is required to tell the compiler that the register value can change outside the program flow (by hardware), preventing the compiler from caching the value in a CPU register.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-11-8',
        type: 'mcq',
        question: 'Which of the following is a good reason to use a union?',
        options: ['Storing a student\'s name and age simultaneously', 'Interpreting a 32-bit float as 4 individual bytes to send over UART', 'Creating an array of structures', 'Preventing structure padding'],
        correct: 1,
        explanation: 'Unions are excellent for type punning, such as breaking a larger data type down into bytes for transmission.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-11-9',
        type: 'mcq',
        question: 'How can you manually optimize structure padding without using packed attributes?',
        options: ['Order members from smallest to largest', 'Order members from largest to smallest', 'Group all arrays together', 'It cannot be done manually'],
        correct: 1,
        explanation: 'Ordering members from largest data type to smallest data type generally eliminates internal padding.',
        difficulty: 'advanced'
      },
      {
        id: 'q-11-10',
        type: 'mcq',
        question: 'What does the arrow operator (->) do?',
        options: ['Accesses a member of a structure directly', 'Accesses a member of a structure via a pointer', 'Shifts bits to the right', 'Points to the next element in an array'],
        correct: 1,
        explanation: 'The arrow operator `ptr->member` is shorthand for `(*ptr).member`, used when you have a pointer to a struct.',
        difficulty: 'beginner'
      }
    ]
  }
};

export default module11;
