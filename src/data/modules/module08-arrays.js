export const module = {
  id: 'module-08',
  title: 'Arrays & Contiguous Memory',
  description: 'Learn how to group identical data types into arrays, how they are stored in memory, and how to avoid the dangerous trap of out-of-bounds access.',
  icon: '📚',
  track: 'c-programming',
  estimatedHours: 4,
  prerequisites: ['module-06'],
  lessons: [
    {
      id: 'lesson-08-01',
      title: 'Introduction to Arrays',
      content: `## What is an Array?

An array is a collection of variables of the **same data type** stored in **contiguous (side-by-side) memory locations**. 
Instead of declaring 100 individual variables for sensor readings (\`int s1, s2, s3...\`), you declare one array that holds 100 integers.

### Syntax
\`\`\`c
// dataType arrayName[arraySize];
int sensor_data[5]; 
\`\`\`

This tells the compiler: "Reserve enough memory for 5 integers, right next to each other."

### Initialization
You can initialize an array at the time of declaration using curly braces \`{}\`.
\`\`\`c
// Fully initialized
int primes[5] = {2, 3, 5, 7, 11};

// Partially initialized (the rest are automatically set to 0)
int scores[5] = {100, 95}; // -> {100, 95, 0, 0, 0}

// Initialize all to zero
int buffer[100] = {0}; 

// Compiler infers the size (size becomes 3)
int speeds[] = {45, 60, 75}; 
\`\`\`

### Accessing Elements (Zero-Indexed)
In C, array indices start at **0**, not 1. The highest valid index is always \`size - 1\`.

\`\`\`c
int primes[5] = {2, 3, 5, 7, 11};
int first = primes[0]; // 2
int third = primes[2]; // 5
int last  = primes[4]; // 11

primes[1] = 99; // Change the second element
\`\`\`
`,
      codeExamples: [
        {
          title: 'Iterating through an array',
          code: `#include <stdio.h>

int main() {
    int adc_readings[4] = {1023, 512, 0, 800};
    int sum = 0;
    
    // Using a for loop to process the array
    for (int i = 0; i < 4; i++) {
        printf("Reading %d: %d\\n", i, adc_readings[i]);
        sum += adc_readings[i];
    }
    
    printf("Average: %d\\n", sum / 4);
    return 0;
}`,
          output: "Reading 0: 1023\nReading 1: 512\nReading 2: 0\nReading 3: 800\nAverage: 583"
        }
      ],
      keyPoints: [
        'Arrays hold multiple items of the SAME data type.',
        'Array elements are stored contiguously in memory.',
        'Array indices are 0-based. The last element is at index (size - 1).',
        'Partially initialized arrays have their remaining elements set to 0 automatically.'
      ],
      commonMistakes: [
        'Thinking arrays are 1-indexed. `array[5]` in a 5-element array is an error!',
        'Trying to assign an array directly to another array using `=`. (You must loop and copy elements individually).'
      ],
      interviewQuestions: [
        {
          question: 'If you declare `int arr[5];` inside a function without initializing it, what values does it contain?',
          answer: 'Because it is a local variable stored on the stack, the array is uninitialized and contains garbage values (whatever random data happened to be in that memory previously). If it were a global or static array, it would be automatically zero-initialized by the C runtime.'
        }
      ]
    },
    {
      id: 'lesson-08-02',
      title: 'Memory Layout & Bounds Checking',
      content: `## Contiguous Memory

The defining feature of an array is that its elements sit directly next to each other in RAM. 

If we have \`uint32_t data[3]\` and \`data[0]\` is at memory address \`0x1000\`, then:
- \`data[0]\` is at \`0x1000\` (4 bytes)
- \`data[1]\` is at \`0x1004\` (4 bytes)
- \`data[2]\` is at \`0x1008\` (4 bytes)

### The Danger: No Bounds Checking
Unlike Python, Java, or Rust, **C does NOT check if you access an array out of bounds**. 

If you have an array of size 5 and you try to write to \`index 10\`, the compiler will completely allow it. 
What happens at runtime? The CPU calculates the memory address where \`index 10\` *should* be and writes the data there. 

This will **overwrite whatever other variable happens to live at that memory address**. This is called a **Buffer Overflow**.

\`\`\`c
void dangerous_function() {
    int password_match = 0; // Lives right next to buffer
    int buffer[3] = {0, 0, 0};
    
    // writing OUT OF BOUNDS!
    buffer[3] = 1; // Overwrites password_match!
    
    if (password_match) {
        printf("Access Granted!\\n"); // Hacker gets in!
    }
}
\`\`\`

### Buffer Overflows in Embedded Systems
In embedded systems, out-of-bounds writes are catastrophic. They might overwrite the return address on the stack (causing a hard fault/crash when the function tries to return), or overwrite crucial hardware configuration registers. 
**Always verify index bounds before accessing an array!**
`,
      codeExamples: [
        {
          title: 'Calculating Array Size Safely',
          code: `#include <stdio.h>

int main() {
    int buffer[] = {10, 20, 30, 40, 50, 60};
    
    // sizeof(buffer) gives the TOTAL bytes (6 ints * 4 bytes = 24 bytes)
    // sizeof(buffer[0]) gives the size of one element (4 bytes)
    
    int num_elements = sizeof(buffer) / sizeof(buffer[0]);
    
    printf("Total bytes: %lu\\n", sizeof(buffer));
    printf("Element bytes: %lu\\n", sizeof(buffer[0]));
    printf("Number of elements: %d\\n", num_elements);
    
    // Safe iteration
    for (int i = 0; i < num_elements; i++) {
        printf("%d ", buffer[i]);
    }
    
    return 0;
}`,
          output: "Total bytes: 24\nElement bytes: 4\nNumber of elements: 6\n10 20 30 40 50 60 "
        }
      ],
      keyPoints: [
        'Array elements are stored side-by-side in memory.',
        'C trusts the programmer and does NOT check array bounds.',
        'Out-of-bounds access causes buffer overflows, which lead to crashes or severe security vulnerabilities.',
        'Use sizeof(array) / sizeof(array[0]) to calculate the number of elements dynamically.'
      ],
      commonMistakes: [
        'Writing a loop as `for(int i = 0; i <= size; i++)`. (The `=` causes an out-of-bounds access on the final iteration).',
        'Assuming sizeof(array) returns the number of elements. It returns the number of *bytes*. You must divide it by the size of one element.'
      ],
      interviewQuestions: [
        {
          question: 'What is a Buffer Overflow?',
          answer: 'A buffer overflow occurs when data is written past the allocated boundaries of an array (buffer) in memory. Because C lacks bounds checking, this overwrites adjacent memory locations. It can corrupt other variables, crash the program by overwriting stack return addresses, or be exploited maliciously to inject and execute arbitrary code.'
        }
      ]
    },
    {
      id: 'lesson-08-03',
      title: 'Multidimensional Arrays',
      content: `## 2D Arrays (Matrices)

Sometimes data is best represented as a grid, table, or matrix. A 2D array is simply an "array of arrays".

### Syntax and Initialization
\`\`\`c
// dataType arrayName[Rows][Columns];
int matrix[3][4]; // 3 rows, 4 columns
\`\`\`

You can initialize it row by row:
\`\`\`c
int grid[2][3] = {
    {1, 2, 3}, // Row 0
    {4, 5, 6}  // Row 1
};
\`\`\`

### Accessing Elements
Accessing elements requires two indices: \`[row][column]\`.
\`\`\`c
int val = grid[1][2]; // Row 1, Column 2 -> 6
grid[0][0] = 99;      // Change the top-left element
\`\`\`

### Memory Layout
Even though we visualize it as a 2D grid, **RAM is fundamentally 1-dimensional**. 
C stores 2D arrays in **Row-Major Order**. This means it stores all of Row 0, then all of Row 1, etc., contiguously in memory.

Memory layout of \`grid[2][3]\`:
\`[ 1, 2, 3, 4, 5, 6 ]\`

### Embedded Use Case
2D arrays are commonly used for images (e.g., a pixel buffer for an OLED display) or Lookup Tables (LUTs).

For example, representing a custom font character for an LCD display (where 1 is a lit pixel):
\`\`\`c
uint8_t letter_T[5][3] = {
    {1, 1, 1},
    {0, 1, 0},
    {0, 1, 0},
    {0, 1, 0},
    {0, 1, 0}
};
\`\`\`
`,
      codeExamples: [
        {
          title: 'Nested loops with 2D Arrays',
          code: `#include <stdio.h>

int main() {
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    // Process row by row
    for (int row = 0; row < 3; row++) {
        for (int col = 0; col < 3; col++) {
            printf("%d ", matrix[row][col]);
        }
        printf("\\n");
    }
    
    return 0;
}`,
          output: "1 2 3 \n4 5 6 \n7 8 9 "
        }
      ],
      keyPoints: [
        'A 2D array requires two sizes: [Rows][Columns].',
        'Use nested loops (a loop inside a loop) to iterate through 2D arrays.',
        'C stores multidimensional arrays in Row-Major order (flattened out in 1D memory).',
        'When initializing, it is good practice to use nested curly braces for clarity.'
      ],
      commonMistakes: [
        'Trying to access a 2D array like `grid[x, y]`. That is valid Python, but in C it evaluates the comma operator and results in `grid[y]`, a 1D array pointer. You MUST use `grid[x][y]`.',
        'Iterating column-first instead of row-first. Because of row-major memory layout, column-first iteration causes cache misses and is significantly slower on complex processors.'
      ],
      interviewQuestions: [
        {
          question: 'What is Row-Major vs Column-Major order?',
          answer: 'These terms describe how 2D arrays are flattened into 1D memory. Row-major (used by C/C++) stores elements row by row sequentially. Column-major (used by Fortran/MATLAB) stores elements column by column. Knowing this is important for performance, as iterating through memory sequentially (row-by-row in C) maximizes CPU cache hits.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-08-01',
        type: 'mcq',
        question: 'If you have an array `int data[10];`, what is the index of the last element?',
        options: ['10', '9', '0', '1'],
        correct: 1,
        explanation: 'C arrays are zero-indexed. An array of size 10 has elements from index 0 to index 9.',
        difficulty: 'beginner'
      },
      {
        id: 'q-08-02',
        type: 'mcq',
        question: 'What happens if you write data to `data[15]` in an array sized `int data[10];`?',
        options: [
          'The compiler throws an error and halts compilation.',
          'The program throws an "Index Out of Bounds" exception and halts safely.',
          'The program silently writes to the memory location where index 15 would be, potentially corrupting other variables.',
          'The array automatically expands its size to 16 to accommodate the new index.'
        ],
        correct: 2,
        explanation: 'C does not perform bounds checking. Writing out of bounds causes a buffer overflow, corrupting whatever memory is adjacent to the array.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-08-03',
        type: 'mcq',
        question: 'How are 2D arrays stored in physical RAM in C?',
        options: [
          'As a 2D grid of memory cells.',
          'In column-major order (flattened 1D).',
          'In row-major order (flattened 1D).',
          'As an array of pointers to randomly scattered 1D arrays.'
        ],
        correct: 2,
        explanation: 'RAM is strictly 1-dimensional. C flattens 2D arrays using row-major order, storing the first row contiguously, followed immediately by the second row.',
        difficulty: 'intermediate'
      }
    ]
  }
};
