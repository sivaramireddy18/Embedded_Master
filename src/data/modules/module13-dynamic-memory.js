export const module13 = {
  id: 'module-13',
  title: 'Dynamic Memory & RTOS Implications',
  description: 'Understand the heap, malloc/free, memory leaks, and the critical reasons why dynamic memory allocation is heavily restricted in Real-Time Operating Systems (RTOS).',
  icon: '🧠',
  track: 'advanced-c',
  estimatedHours: 5,
  prerequisites: ['module-05', 'module-11'],
  lessons: [
    {
      id: 'lesson-13-1',
      title: 'The Heap and malloc()',
      content: 'Dynamic memory allocation allows a program to request memory at runtime from a pool of free memory known as the "Heap." In C, `malloc()` (memory allocate) is used to request a specific number of bytes. It returns a `void*` pointer to the allocated memory, or `NULL` if the allocation fails.',
      codeExamples: [
        {
          title: 'Basic malloc Usage',
          code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int num_elements = 5;\n    // Allocate memory for an array of 5 integers\n    int *arr = (int*)malloc(num_elements * sizeof(int));\n\n    if (arr == NULL) {\n        printf("Memory allocation failed!\\n");\n        return 1;\n    }\n\n    for(int i=0; i<num_elements; i++) {\n        arr[i] = i * 10;\n        printf("%d ", arr[i]);\n    }\n    \n    free(arr); // ALWAYS FREE!\n    return 0;\n}`,
          output: `0 10 20 30 40 `
        }
      ],
      keyPoints: [
        '`malloc` requests memory in bytes; always use `sizeof()` to ensure correct allocation.',
        'You must check if the returned pointer is `NULL` before using it.',
        'Memory from `malloc` is uninitialized and contains garbage data.'
      ],
      commonMistakes: [
        'Assuming `malloc` will never fail. On microcontrollers with limited RAM, the heap exhausts quickly.',
        'Forgetting to multiply the number of elements by `sizeof(type)`.'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between malloc and calloc?',
          answer: '`malloc` allocates a block of memory and leaves it uninitialized. `calloc` allocates memory for an array of elements and initializes all bytes to zero.'
        }
      ]
    },
    {
      id: 'lesson-13-2',
      title: 'Free, Memory Leaks, and Dangling Pointers',
      content: 'Memory allocated dynamically exists until the program explicitly releases it using `free()`. If a program loses the pointer to allocated memory without freeing it, that memory is permanently lost to the system—this is a **Memory Leak**.\n\nA **Dangling Pointer** occurs when you free a block of memory, but keep a pointer pointing to that address and try to use it later.',
      codeExamples: [
        {
          title: 'Creating a Dangling Pointer',
          code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int*)malloc(sizeof(int));\n    *ptr = 42;\n    \n    free(ptr); // Memory is returned to the heap\n    \n    // ptr is now a DANGLING POINTER\n    // *ptr = 100; // DANGEROUS! Undefined behavior\n    \n    ptr = NULL; // Best practice: nullify after freeing\n    return 0;\n}`,
          output: `(No output - but demonstrates a critical concept)`
        }
      ],
      keyPoints: [
        'Every `malloc` or `calloc` must have a corresponding `free`.',
        'Memory leaks in long-running embedded systems will inevitably crash the system (OOM - Out of Memory).',
        'Set pointers to `NULL` immediately after freeing them to prevent dangling pointer bugs.'
      ],
      commonMistakes: [
        'Returning a pointer to a local variable from a function, which becomes dangling immediately upon return.',
        'Calling `free()` twice on the same pointer (Double Free), which corrupts the heap management structures.'
      ],
      interviewQuestions: [
        {
          question: 'How do you detect memory leaks in a C program?',
          answer: 'On desktop systems, tools like Valgrind are used. In embedded systems, you often track allocation/deallocation counters, or monitor the remaining free heap space over time.'
        }
      ]
    },
    {
      id: 'lesson-13-3',
      title: 'Heap Fragmentation',
      content: 'As memory is continually allocated and freed in different sizes over time, the heap becomes fragmented. You might have plenty of *total* free memory, but it\'s scattered in tiny blocks. If you request a contiguous block of memory larger than any single free chunk, `malloc()` will fail.\n\nThis is the primary reason dynamic memory is feared in mission-critical systems.',
      codeExamples: [
        {
          title: 'Visualization of Fragmentation',
          code: `/* \nInitial Heap:   [---------------- 1000 bytes ----------------]\nAlloc 300, 200, 300\nHeap state:     [300 Used][200 Used][300 Used][200 Free]\nFree middle block (200 bytes)\nHeap state:     [300 Used][200 FREE][300 Used][200 Free]\n\nTry to malloc(300): FAILS! \nTotal free is 400, but largest contiguous block is only 200.\n*/`,
          output: `Conceptual Example`
        }
      ],
      keyPoints: [
        'Fragmentation breaks free memory into unusable small gaps.',
        'There is no "garbage collector" or automatic defragmentation in standard C.',
        'Long-running systems (like servers or IoT devices) are highly susceptible to fragmentation over months of uptime.'
      ],
      commonMistakes: [
        'Using `malloc/free` in a fast, repeating loop (like a sensor reading task). This rapidly accelerates fragmentation.'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between internal and external fragmentation?',
          answer: 'Internal fragmentation is wasted space inside an allocated block (e.g., allocator minimum chunk sizes). External fragmentation is free space scattered across the heap in blocks too small to satisfy new requests.'
        }
      ]
    },
    {
      id: 'lesson-13-4',
      title: 'Dynamic Memory in RTOS (FreeRTOS, Zephyr)',
      content: 'Because of fragmentation, non-deterministic execution time of `malloc` (searching for a free block takes variable time), and the risk of memory leaks, standard `malloc/free` are strictly banned in many safety-critical embedded standards (e.g., MISRA C).\n\nInstead, RTOSs provide alternative solutions:\n1. **Static Allocation:** Pre-allocating everything globally at compile time.\n2. **Memory Pools:** Creating pools of fixed-size blocks. Allocating a fixed-size block is deterministic (O(1) time) and cannot cause external fragmentation.',
      codeExamples: [
        {
          title: 'Static vs Dynamic Task Creation (Conceptual FreeRTOS)',
          code: `// DANGEROUS (Dynamic)\n// xTaskCreate(TaskFunc, "Task", STACK_SIZE, NULL, 1, NULL);\n\n// SAFE (Static Allocation)\n// uint32_t myTaskStack[ STACK_SIZE ];\n// StaticTask_t myTaskBuffer;\n// xTaskCreateStatic(TaskFunc, "Task", STACK_SIZE, NULL, 1, myTaskStack, &myTaskBuffer);`,
          output: `Conceptual Example`
        }
      ],
      keyPoints: [
        'Standard `malloc` is non-deterministic (violates real-time constraints).',
        'Memory Pools provide safe, fragmentation-free dynamic allocation by enforcing fixed block sizes.',
        'Modern safety-critical systems heavily favor 100% static memory allocation.'
      ],
      commonMistakes: [
        'Using `printf()` in an RTOS task. The standard `printf` implementation often calls `malloc` internally under the hood, introducing hidden heap usage and fragmentation.'
      ],
      interviewQuestions: [
        {
          question: 'Why is standard malloc() not used in strict Real-Time systems?',
          answer: '1) Non-deterministic execution time (breaks real-time deadlines). 2) Memory fragmentation over time leading to allocation failures. 3) Not inherently thread-safe without OS locks.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-13-1',
        type: 'mcq',
        question: 'What does `malloc(10)` return if successful?',
        options: ['An integer value 10', 'A void pointer to a 10-byte memory block', 'A char array of size 10', 'A pointer to a 10-bit block'],
        correct: 1,
        explanation: 'malloc allocates a specified number of bytes and returns a generic void pointer to the start of that block.',
        difficulty: 'beginner'
      },
      {
        id: 'q-13-2',
        type: 'mcq',
        question: 'What happens to the values in memory allocated by `calloc`?',
        options: ['They are filled with garbage data', 'They are set to a pattern like 0xDEADBEEF', 'They are initialized to zero', 'They retain the previous data in RAM'],
        correct: 2,
        explanation: 'Unlike malloc, calloc zeroes out the allocated memory before returning the pointer.',
        difficulty: 'beginner'
      },
      {
        id: 'q-13-3',
        type: 'mcq',
        question: 'What is a memory leak?',
        options: ['When another program reads your memory', 'Losing the pointer to allocated memory without calling free()', 'When stack memory overwrites heap memory', 'When the heap is completely full'],
        correct: 1,
        explanation: 'A leak occurs when dynamically allocated memory is no longer accessible by the program but hasn\'t been released back to the OS/Heap.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-13-4',
        type: 'mcq',
        question: 'Why is external fragmentation a problem?',
        options: ['It slows down CPU clock speed', 'It prevents allocation even if the total free memory is sufficient', 'It corrupts data in the heap', 'It causes the stack pointer to overflow'],
        correct: 1,
        explanation: 'External fragmentation leaves free memory in small, scattered blocks. If a request requires a contiguous block larger than any single fragment, the allocation fails.',
        difficulty: 'advanced'
      },
      {
        id: 'q-13-5',
        type: 'mcq',
        question: 'What is a Dangling Pointer?',
        options: ['A pointer that points to NULL', 'A pointer that points to uninitialized variables', 'A pointer that points to a memory location that has been freed', 'A pointer to a function'],
        correct: 2,
        explanation: 'Using a pointer after its memory has been passed to free() results in a dangling pointer, leading to unpredictable behavior.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-13-6',
        type: 'mcq',
        question: 'What is a primary reason `malloc` is non-deterministic?',
        options: ['It uses random numbers', 'The OS schedules it unpredictably', 'The time taken to search the heap for a suitable free block varies based on heap state', 'Hardware timers interrupt it'],
        correct: 2,
        explanation: 'Depending on how fragmented the heap is, malloc may find a block immediately or have to scan a long linked list of free blocks, varying its execution time.',
        difficulty: 'advanced'
      },
      {
        id: 'q-13-7',
        type: 'mcq',
        question: 'How do RTOS "Memory Pools" solve external fragmentation?',
        options: ['By running a defragmentation task periodically', 'By allocating only fixed-size memory blocks', 'By allowing overlapping memory regions', 'By moving pointers at runtime'],
        correct: 1,
        explanation: 'By dividing a large chunk of memory into blocks of equal size, any freed block can perfectly satisfy any future request for a block, eliminating external fragmentation entirely.',
        difficulty: 'advanced'
      },
      {
        id: 'q-13-8',
        type: 'mcq',
        question: 'If you want to resize an already allocated memory block, which function should you use?',
        options: ['malloc', 'calloc', 'realloc', 'free'],
        correct: 2,
        explanation: 'realloc() is used to change the size of a previously allocated memory block, moving the data to a new location if necessary.',
        difficulty: 'beginner'
      },
      {
        id: 'q-13-9',
        type: 'mcq',
        question: 'In C, what is the safest thing to do immediately after calling `free(ptr)`?',
        options: ['ptr = NULL;', 'return ptr;', 'malloc(ptr);', '*ptr = 0;'],
        correct: 0,
        explanation: 'Setting the pointer to NULL ensures that if you accidentally try to dereference it later, the program will crash predictably (Null Pointer Exception) rather than silently corrupting memory.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-13-10',
        type: 'mcq',
        question: 'Does standard C automatically free memory when a function exits?',
        options: ['Yes, all memory is freed', 'Only dynamically allocated memory is freed', 'Only stack-allocated local variables are freed automatically', 'No, nothing is freed'],
        correct: 2,
        explanation: 'Local variables on the Stack are automatically destroyed. Memory on the Heap (malloc) persists until explicitly freed.',
        difficulty: 'intermediate'
      }
    ]
  }
};

export default module13;
