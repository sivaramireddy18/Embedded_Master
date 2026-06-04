export const module = {
  id: 'module-10',
  title: 'Pointers & Memory Addresses',
  description: 'The defining feature of C. Master pointers to directly manipulate memory, pass arguments by reference, and control hardware registers at specific memory addresses.',
  icon: '👉',
  track: 'c-programming',
  estimatedHours: 8,
  prerequisites: ['module-07', 'module-08', 'module-09'],
  lessons: [
    {
      id: 'lesson-10-01',
      title: 'What is a Pointer?',
      content: `## Memory Addresses

Every variable you create in C is stored somewhere in memory. Memory can be thought of as a massive array of bytes, where each byte has a unique index called its **Address**.

If you declare \`int x = 42;\`, the computer finds 4 free bytes of memory (since an \`int\` is 4 bytes), stores the binary representation of \`42\` there, and remembers the starting address (e.g., \`0x7FFE0010\`).

You can find the address of any variable using the **Address-Of Operator (\`&\`)**.

\`\`\`c
int x = 42;
printf("Value: %d\\n", x);           // Prints 42
printf("Address: %p\\n", (void*)&x); // Prints something like 0x7FFE0010
\`\`\`

## What is a Pointer?

A pointer is simply a variable that stores a **memory address**. 
Instead of storing a number like \`42\` or a character like \`'A'\`, it stores \`0x7FFE0010\`.

### Declaring a Pointer
To declare a pointer, put an asterisk (\`*\`) between the data type and the variable name.
\`\`\`c
int x = 42;
int *ptr;     // Declares a pointer to an integer
ptr = &x;     // Stores the address of x into ptr
\`\`\`

Now, \`ptr\` "points to" \`x\`.

### The Dereference Operator (\`*\`)
If you have a pointer, you can access or modify the data at the address it points to using the **Dereference Operator (\`*\`)**.

\`\`\`c
int value = *ptr; // Reads the memory at the address stored in ptr (gets 42)
*ptr = 99;        // Writes 99 into the memory address stored in ptr (modifies x!)
\`\`\`

### Summary of Operators
- \`&\` (Address-Of): Gets the address of a variable.
- \`*\` (Dereference): Follows a pointer to the actual data.
`,
      codeExamples: [
        {
          title: 'Basic Pointer Operations',
          code: `#include <stdio.h>

int main() {
    int score = 100;
    
    // Declare a pointer and point it to score
    int *score_ptr = &score;
    
    printf("Original score: %d\\n", score);
    
    // Modify score USING the pointer
    *score_ptr = 200;
    
    printf("Modified score: %d\\n", score);
    printf("Address of score: %p\\n", (void*)score_ptr);
    
    return 0;
}`,
          output: "Original score: 100\nModified score: 200\nAddress of score: 0x7ffee6b5c9dc"
        }
      ],
      keyPoints: [
        'Every variable has a physical address in memory.',
        'The & operator returns the memory address of a variable.',
        'A pointer is a variable that stores a memory address.',
        'The * operator (dereference) accesses the value stored at a pointer\'s address.'
      ],
      commonMistakes: [
        'Confusing the asterisk (*) in a declaration (meaning "this is a pointer") with the asterisk used in an expression (meaning "dereference this pointer").',
        'Dereferencing an uninitialized pointer, which leads to a Segmentation Fault because it points to a random memory address.'
      ],
      interviewQuestions: [
        {
          question: 'What is a Segmentation Fault?',
          answer: 'A Segmentation Fault (segfault) occurs when a program tries to read or write to a memory location it does not have access to (such as read-only memory, or memory outside the program\'s allocated address space). This is almost always caused by dereferencing a NULL pointer, an uninitialized pointer, or a pointer that has gone out of bounds of an array.'
        }
      ]
    },
    {
      id: 'lesson-10-02',
      title: 'Pass by Reference',
      content: `## Solving the Pass-by-Value Problem

Earlier, we learned that C passes function arguments by value (making a copy). If a function needs to modify a variable from the caller, it cannot do it directly.

**Pointers solve this!** 

If you pass the *memory address* of a variable to a function, the function receives a copy of the *address*. It can then dereference that address to modify the original variable. This is called **Pass by Reference** (or more technically in C, "passing a pointer by value").

### Example: The Classic Swap Function
\`\`\`c
// This DOES NOT work (pass by value)
void bad_swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

// This DOES work! (using pointers)
void good_swap(int *a, int *b) {
    int temp = *a; // Read value at address a
    *a = *b;       // Write value from b into a
    *b = temp;     // Write temp into b
}

int main() {
    int x = 5, y = 10;
    good_swap(&x, &y); // Pass ADDRESSES!
}
\`\`\`

### Returning Multiple Values
A C function can only \`return\` one value. If you need a function to return multiple pieces of data, you can pass pointers as "output parameters".

\`\`\`c
void get_sensor_data(int *temp, int *humidity) {
    // Read hardware
    *temp = 24;
    *humidity = 60;
}

int main() {
    int t, h;
    get_sensor_data(&t, &h);
    // t is now 24, h is now 60
}
\`\`\`
`,
      codeExamples: [
        {
          title: 'Returning multiple values via pointers',
          code: `#include <stdio.h>

// Returns the division result, and writes the remainder into the pointer
int divide_with_remainder(int numerator, int denominator, int *remainder) {
    *remainder = numerator % denominator;
    return numerator / denominator;
}

int main() {
    int num = 17;
    int den = 5;
    int rem;
    
    int result = divide_with_remainder(num, den, &rem);
    
    printf("%d divided by %d is %d with a remainder of %d\\n", 
           num, den, result, rem);
           
    return 0;
}`,
          output: "17 divided by 5 is 3 with a remainder of 2"
        }
      ],
      keyPoints: [
        'To modify a variable inside a function, pass its address to a pointer parameter.',
        'Functions can "return" multiple values by taking pointer parameters and writing to them.',
        'This technique is heavily used in embedded C APIs (e.g., HAL_UART_Receive(&uart, &data)).'
      ],
      commonMistakes: [
        'Forgetting the & when calling the function: `good_swap(x, y)` instead of `good_swap(&x, &y)`. The compiler will warn you about passing an integer to a pointer.',
        'Forgetting to dereference the pointer inside the function: writing `a = b` instead of `*a = *b`.'
      ],
      interviewQuestions: [
        {
          question: 'Why do we use pointers to pass large structs to functions instead of passing the struct directly?',
          answer: 'Passing a struct by value copies the entire struct onto the stack. If the struct is 1000 bytes, this wastes time and heavily consumes limited stack memory. Passing a pointer to the struct only pushes a 4-byte or 8-byte address onto the stack, making it extremely fast and memory-efficient.'
        }
      ]
    },
    {
      id: 'lesson-10-03',
      title: 'Pointers and Arrays',
      content: `## The Secret Relationship

In C, arrays and pointers are almost the exact same thing. 
When you use the name of an array without brackets, it automatically **decays into a pointer to its first element**.

\`\`\`c
int arr[3] = {10, 20, 30};
int *ptr = arr; // ptr now points to arr[0]

// These two statements are identical:
printf("%d", arr[0]);
printf("%d", *ptr);
\`\`\`

### Pointer Arithmetic
Because an array is stored contiguously in memory, you can navigate it by adding or subtracting from a pointer. 

When you add \`1\` to an \`int *\`, the CPU doesn't just add 1 byte to the address; it adds **the size of the data type** (4 bytes for an \`int\`).

\`\`\`c
int arr[3] = {10, 20, 30};
int *ptr = arr; // points to address 0x1000

printf("%d", *ptr);       // Prints 10
printf("%d", *(ptr + 1)); // Points to 0x1004, Prints 20
printf("%d", *(ptr + 2)); // Points to 0x1008, Prints 30
\`\`\`

In fact, the bracket notation \`arr[i]\` is just "syntactic sugar" that the compiler translates directly into \`*(arr + i)\`!

### Passing Arrays to Functions
Because arrays decay to pointers, when you pass an array to a function, you are actually passing a pointer. **The function does not know the size of the array!** You must pass the size as a separate argument.

\`\`\`c
void print_array(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]); // We can still use bracket notation!
    }
}
\`\`\`
`,
      codeExamples: [
        {
          title: 'Pointer arithmetic vs array indexing',
          code: `#include <stdio.h>

int main() {
    int data[4] = {5, 10, 15, 20};
    int *ptr = data;
    
    printf("Using array indexing:\\n");
    for (int i = 0; i < 4; i++) {
        printf("data[%d] = %d\\n", i, data[i]);
    }
    
    printf("\\nUsing pointer arithmetic:\\n");
    for (int i = 0; i < 4; i++) {
        printf("*(ptr + %d) = %d\\n", i, *(ptr + i));
    }
    
    return 0;
}`,
          output: "Using array indexing:\ndata[0] = 5\ndata[1] = 10\ndata[2] = 15\ndata[3] = 20\n\nUsing pointer arithmetic:\n*(ptr + 0) = 5\n*(ptr + 1) = 10\n*(ptr + 2) = 15\n*(ptr + 3) = 20"
        }
      ],
      keyPoints: [
        'An array name resolves to a pointer to its first element.',
        'Pointer arithmetic scales by the size of the underlying data type.',
        'arr[i] is perfectly equivalent to *(arr + i).',
        'Functions that take array parameters are actually receiving pointers.'
      ],
      commonMistakes: [
        'Trying to use `sizeof()` on an array passed into a function. It will return the size of the pointer (4 or 8 bytes), not the size of the array.'
      ],
      interviewQuestions: [
        {
          question: 'If you have an array `int a[5]`, what is the difference between `a` and `&a`?',
          answer: 'Both `a` and `&a` evaluate to the exact same memory address (the start of the array). However, they have different TYPES. `a` is a pointer to the first element (type `int *`), so `a + 1` increments the address by sizeof(int). `&a` is a pointer to the entire array (type `int (*)[5]`), so `&a + 1` increments the address by sizeof(the entire array), which is 5 * sizeof(int).'
        }
      ]
    },
    {
      id: 'lesson-10-04',
      title: 'Memory-Mapped I/O (Embedded Magic)',
      content: `## Pointers in Embedded Systems

In PC programming, the OS controls memory addresses. In embedded bare-metal programming, **you** control the physical memory addresses!

Microcontrollers use **Memory-Mapped I/O**. This means that hardware peripherals (like GPIO pins, UARTs, Timers) are controlled by reading and writing to specific physical memory addresses using pointers.

### Casting an Address to a Pointer
If you look at the datasheet for an STM32 microcontroller, it might say:
> "The GPIO Port A Output Data Register (ODR) is located at address \`0x4001080C\`."

To control it, we tell the compiler to treat that absolute number as a pointer to a volatile 32-bit integer:

\`\`\`c
// 1. Start with the raw hex address
0x4001080C

// 2. Cast it to a pointer to a volatile uint32_t
(volatile uint32_t *) 0x4001080C

// 3. Dereference it to write data!
*(volatile uint32_t *) 0x4001080C = 0x0020; // Set pin PA5 HIGH
\`\`\`

### Using Macros for Readability
We usually hide this ugly pointer math inside a macro:
\`\`\`c
#define GPIOA_ODR (*(volatile uint32_t *) 0x4001080C)

void main() {
    GPIOA_ODR = 0x0020; // Much cleaner!
}
\`\`\`

### The \`volatile\` Keyword
Notice the \`volatile\` keyword! This is critical. It tells the compiler: "The value at this memory address can change without warning (by hardware), so **never cache it** and **never optimize away my reads/writes to it**."
`,
      codeExamples: [
        {
          title: 'Simulating a hardware register write',
          code: `#include <stdio.h>
#include <stdint.h>

// In reality, this would point to a physical hardware address.
// For this simulation on a PC, we just point it to a normal variable.
uint32_t simulated_hardware_register = 0;

// The macro looks exactly like embedded C code
#define REG_CONTROL (*(volatile uint32_t *)&simulated_hardware_register)

int main() {
    printf("Initial register value: 0x%08X\\n", REG_CONTROL);
    
    // Set bit 3 to turn on a peripheral
    REG_CONTROL |= (1 << 3);
    
    printf("After setting bit 3:  0x%08X\\n", REG_CONTROL);
    
    return 0;
}`,
          output: "Initial register value: 0x00000000\nAfter setting bit 3:  0x00000008"
        }
      ],
      keyPoints: [
        'Memory-mapped I/O allows you to control hardware by writing to physical memory addresses.',
        'You cast an absolute integer address to a pointer and dereference it.',
        'Always use the volatile keyword for hardware registers to prevent compiler optimization bugs.'
      ],
      commonMistakes: [
        'Forgetting volatile. The compiler might see a loop like `while(REG == 0)` and optimize it into an infinite loop because it doesn\'t realize hardware can change `REG`.',
        'Dereferencing the wrong address type. E.g., casting an address to a `uint8_t *` when the hardware register requires 32-bit (`uint32_t *`) access.'
      ],
      interviewQuestions: [
        {
          question: 'Write a C expression to set the 5th bit of a 32-bit hardware register located at address 0x40001000.',
          answer: '`*((volatile uint32_t *) 0x40001000) |= (1 << 5);`'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-10-01',
        type: 'mcq',
        question: 'Which operator is used to get the memory address of a variable?',
        options: ['*', '&', '->', '%'],
        correct: 1,
        explanation: 'The & operator (Address-Of) returns the memory location of a variable.',
        difficulty: 'beginner'
      },
      {
        id: 'q-10-02',
        type: 'mcq',
        question: 'What is the purpose of passing a pointer to a function instead of a regular variable?',
        options: [
          'It allows the function to execute faster.',
          'It allows the function to modify the original variable in the caller\'s scope.',
          'It is required for all variables in C.',
          'It prevents the function from modifying the variable.'
        ],
        correct: 1,
        explanation: 'Passing a pointer (pass by reference) allows the function to dereference the address and alter the original variable\'s memory directly.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-10-03',
        type: 'mcq',
        question: 'In `int arr[5]; int *ptr = arr;`, what does `*(ptr + 2)` represent?',
        options: [
          'The value at arr[0] plus 2.',
          'The memory address of arr[2].',
          'The value stored at arr[2].',
          'A compilation error.'
        ],
        correct: 2,
        explanation: 'Adding 2 to the pointer advances it by 2 integer-sizes in memory. The dereference operator (*) then retrieves the value at that new address, which is perfectly equivalent to arr[2].',
        difficulty: 'intermediate'
      },
      {
        id: 'q-10-04',
        type: 'mcq',
        question: 'Why must the volatile keyword be used when defining a pointer to a hardware register?',
        options: [
          'To make the memory access faster.',
          'To prevent the variable from being stored on the stack.',
          'To prevent the compiler from optimizing out read/write operations to that address.',
          'To ensure the memory address is read-only.'
        ],
        correct: 2,
        explanation: 'The compiler tries to optimize code. If it sees you reading a variable in a loop without changing it in the loop, it will cache the value in a CPU register. volatile tells the compiler that the value can change externally (by hardware) and must be fetched from memory every single time.',
        difficulty: 'advanced'
      }
    ]
  }
};
