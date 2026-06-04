export const module = {
  id: 'module-06',
  title: 'Control Flow: Loops',
  description: 'Master repetition in C using while, for, and do-while loops. Learn how to break, continue, and write safe infinite loops for embedded real-time systems.',
  icon: '🔁',
  track: 'c-programming',
  estimatedHours: 4,
  prerequisites: ['module-03', 'module-04', 'module-05'],
  lessons: [
    {
      id: 'lesson-06-01',
      title: 'The while Loop',
      content: `## The \`while\` Loop

The \`while\` loop is the simplest looping structure in C. It repeats a block of code **as long as** a given condition remains true.

### Syntax
\`\`\`c
while (condition) {
    // code to execute
}
\`\`\`

1. The condition is evaluated **before** the code block executes.
2. If the condition is non-zero (true), the code block executes.
3. If the condition is 0 (false), the loop terminates, and execution continues after the loop.

### Embedded Context: The Infinite Loop
In PC programming, programs eventually exit and return control to the OS. In embedded bare-metal programming, your firmware **must never exit** \`main()\`. If it does, the microcontroller will either crash, halt, or reset. 

Therefore, every embedded C program has an infinite \`while (1)\` loop, often called the "Super Loop".

\`\`\`c
int main() {
    // 1. Initialization (runs once)
    hardware_init();
    
    // 2. Super Loop (runs forever)
    while (1) {
        check_sensors();
        update_display();
        // optionally sleep to save power
    }
    
    return 0; // We should never reach here
}
\`\`\`

### Polling Hardware Registers
\`while\` loops are frequently used to "poll" (wait for) hardware events, such as waiting for an Analog-to-Digital Converter (ADC) to finish reading, or a UART transmitter to be ready.

\`\`\`c
// Wait until the TXE (Transmit Data Register Empty) bit is set
while (!(USART1->SR & (1 << 7))) {
    // wait...
}
// Now it's safe to transmit the next byte
USART1->DR = 'A';
\`\`\`
`,
      codeExamples: [
        {
          title: 'Basic while loop counting',
          code: `#include <stdio.h>

int main() {
    int counter = 5;
    
    printf("Countdown started:\\n");
    while (counter > 0) {
        printf("%d...\\n", counter);
        counter--; // Important: update the condition variable!
    }
    printf("Liftoff!\\n");
    
    return 0;
}`,
          output: "Countdown started:\n5...\n4...\n3...\n2...\n1...\nLiftoff!"
        }
      ],
      keyPoints: [
        'The condition in a while loop is checked before the code block executes.',
        'If the condition is initially false, the loop body may never execute (0 times).',
        'Always ensure the condition will eventually become false, unless you intentionally want an infinite loop.',
        'while(1) or while(true) is used in embedded systems as the main application loop.'
      ],
      commonMistakes: [
        'Forgetting to update the loop variable inside the loop, resulting in an unintentional infinite loop.',
        'Placing a semicolon right after the while condition: `while(i > 0); { ... }` - this creates an infinite empty loop!'
      ],
      interviewQuestions: [
        {
          question: 'What is a "Super Loop" architecture in embedded systems?',
          answer: 'A Super Loop is a software architecture where the main program enters an infinite while(1) loop after hardware initialization. Inside the loop, it continuously polls sensors, updates state machines, and drives outputs sequentially. It is the simplest architecture for bare-metal systems without an RTOS.'
        }
      ]
    },
    {
      id: 'lesson-06-02',
      title: 'The for Loop',
      content: `## The \`for\` Loop

The \`for\` loop is ideal when you know **exactly how many times** you want to repeat a block of code. It consolidates initialization, condition checking, and updating into a single line.

### Syntax
\`\`\`c
for (initialization; condition; update) {
    // code to execute
}
\`\`\`

1. **Initialization**: Executed exactly once before the loop begins.
2. **Condition**: Checked before every iteration. If true, the loop body runs.
3. **Update**: Executed after the loop body finishes, just before the next condition check.

### Equivalence to while
A \`for\` loop can be directly translated to a \`while\` loop:
\`\`\`c
// This for loop:
for (int i = 0; i < 5; i++) {
    printf("%d", i);
}

// Is exactly identical to:
int i = 0;
while (i < 5) {
    printf("%d", i);
    i++;
}
\`\`\`

### Common Use Cases
- Iterating over arrays (which we will cover soon)
- Generating precise timing delays
- Executing an operation a fixed number of times

### Omitting Expressions
Any of the three expressions in a \`for\` loop can be omitted. If the condition is omitted, it defaults to true (infinite loop).
\`\`\`c
// Another way to write an infinite loop
for (;;) {
    // super loop
}
\`\`\`
`,
      codeExamples: [
        {
          title: 'Iterating with a for loop',
          code: `#include <stdio.h>

int main() {
    // Print even numbers from 0 to 10
    printf("Even numbers: ");
    for (int i = 0; i <= 10; i += 2) {
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`,
          output: "Even numbers: 0 2 4 6 8 10"
        },
        {
          title: 'Multiple variables in for loop',
          code: `#include <stdio.h>

int main() {
    // You can initialize and update multiple variables using the comma operator
    for (int i = 0, j = 10; i < j; i++, j--) {
        printf("i = %d, j = %d\\n", i, j);
    }
    return 0;
}`,
          output: "i = 0, j = 10\ni = 1, j = 9\ni = 2, j = 8\ni = 3, j = 7\ni = 4, j = 6"
        }
      ],
      keyPoints: [
        'The for loop is best used for a known, fixed number of iterations.',
        'Variables declared in the initialization section (like int i = 0) are only in scope within the loop (in C99 and later).',
        'for(;;) is functionally identical to while(1).'
      ],
      commonMistakes: [
        'Off-by-one errors: using `i <= size` instead of `i < size` when iterating exactly `size` times.',
        'Modifying the loop counter variable inside the loop body (e.g., doing `i++` inside the block when the loop header already does `i++`).'
      ],
      interviewQuestions: [
        {
          question: 'Can you write a for loop without a condition? What happens?',
          answer: 'Yes, any of the three parts of a for loop can be omitted. `for(;;)` has no condition. In C, an omitted condition evaluates to true, resulting in an infinite loop.'
        }
      ]
    },
    {
      id: 'lesson-06-03',
      title: 'The do-while Loop',
      content: `## The \`do-while\` Loop

The \`do-while\` loop is similar to the \`while\` loop, but with one critical difference: the condition is checked **after** the code block executes.

### Syntax
\`\`\`c
do {
    // code to execute
} while (condition);
\`\`\`
*Note the required semicolon at the end!*

### The Key Difference
Because the condition is evaluated at the end, the code block inside a \`do-while\` loop is **guaranteed to execute at least once**, even if the condition is false from the very beginning.

### Common Use Cases
1. **Interactive Menus / User Input:** You always want to prompt the user for input at least once before checking if their input was valid.
2. **Hardware Initialization Retries:** You attempt to initialize a sensor, and if it fails, you keep trying.

### Example in Embedded C
Attempting to communicate with an I2C device that might take a moment to wake up:
\`\`\`c
uint8_t status;
int retries = 0;
do {
    status = I2C_Read_Device_ID();
    retries++;
} while (status != DEVICE_READY && retries < MAX_RETRIES);

if (status != DEVICE_READY) {
    // Handle hardware failure
}
\`\`\`
`,
      codeExamples: [
        {
          title: 'Input validation simulation',
          code: `#include <stdio.h>

int main() {
    int input = 5; // Simulating user input that changes
    
    do {
        printf("Trying to connect...\\n");
        // In reality we would read input here
        // Let's pretend the connection succeeds when input reaches 3
        input--; 
    } while (input > 3);
    
    printf("Connected successfully!\\n");
    return 0;
}`,
          output: "Trying to connect...\nTrying to connect...\nConnected successfully!"
        }
      ],
      keyPoints: [
        'A do-while loop always executes its body at least once.',
        'The condition is evaluated at the bottom of the loop.',
        'You must include a semicolon after the while(condition) statement.'
      ],
      commonMistakes: [
        'Forgetting the semicolon at the end: `} while(condition)` instead of `} while(condition);`',
        'Using a do-while loop when a standard while loop is safer (e.g., processing data that might be empty from the start).'
      ],
      interviewQuestions: [
        {
          question: 'What is the main functional difference between while and do-while?',
          answer: 'A while loop evaluates its condition before executing the block, meaning it can execute 0 times. A do-while loop evaluates its condition after executing the block, guaranteeing it will execute at least 1 time.'
        }
      ]
    },
    {
      id: 'lesson-06-04',
      title: 'Break and Continue',
      content: `## Altering Loop Flow: \`break\` and \`continue\`

Sometimes, you need to alter the normal flow of a loop from within its body based on a specific condition. C provides two keywords for this: \`break\` and \`continue\`.

### The \`break\` Statement
When a \`break\` statement is encountered inside a loop, the loop is **immediately terminated**, and execution resumes at the next statement following the loop.

We previously saw \`break\` used in \`switch\` statements. In loops, it acts as an emergency exit.

\`\`\`c
while (1) {
    uint8_t data = read_uart();
    if (data == END_OF_FILE_MARKER) {
        break; // Exit the infinite loop!
    }
    process_data(data);
}
// Execution resumes here after break
\`\`\`

### The \`continue\` Statement
When a \`continue\` statement is encountered, the **current iteration** of the loop is immediately halted, and the loop skips straight to the next iteration (jumping to the update step in a \`for\` loop, or the condition check in a \`while\` loop).

\`\`\`c
for (int i = 0; i < 10; i++) {
    if (i % 2 != 0) {
        continue; // Skip odd numbers
    }
    printf("%d is even\\n", i);
}
\`\`\`

### Using break and continue safely
While powerful, overusing \`break\` and \`continue\` can make code hard to read (often referred to as "spaghetti code"). In safety-critical embedded systems (like automotive software governed by MISRA C standards), multiple \`break\` statements or any use of \`continue\` is sometimes discouraged or strictly regulated in favor of well-structured boolean conditions.
`,
      codeExamples: [
        {
          title: 'Using break to find a target',
          code: `#include <stdio.h>

int main() {
    int target = 42;
    
    for (int i = 0; i < 100; i++) {
        if (i == target) {
            printf("Found target %d at index %d!\\n", target, i);
            break; // Stop searching once found
        }
    }
    
    printf("Search complete.\\n");
    return 0;
}`,
          output: "Found target 42 at index 42!\nSearch complete."
        },
        {
          title: 'Using continue to filter data',
          code: `#include <stdio.h>

int main() {
    printf("Processing sensor stream (skipping error code -1):\\n");
    
    int sensor_data[] = {25, 26, -1, 27, -1, 28};
    
    for (int i = 0; i < 6; i++) {
        if (sensor_data[i] == -1) {
            printf("  -> Error code detected, skipping.\\n");
            continue;
        }
        printf("Valid reading: %d\\n", sensor_data[i]);
    }
    return 0;
}`,
          output: "Processing sensor stream (skipping error code -1):\nValid reading: 25\nValid reading: 26\n  -> Error code detected, skipping.\nValid reading: 27\n  -> Error code detected, skipping.\nValid reading: 28"
        }
      ],
      keyPoints: [
        'break immediately exits the innermost enclosing loop or switch.',
        'continue immediately skips the rest of the current iteration and begins the next iteration.',
        'In a nested loop structure, break only exits the loop it is physically inside.'
      ],
      commonMistakes: [
        'Using continue inside a while loop without updating the loop variable before the continue statement, causing an infinite loop.',
        'Expecting break to exit multiple nested loops. (It only exits one level).'
      ],
      interviewQuestions: [
        {
          question: 'If you have two nested for loops and you execute a break in the inner loop, what happens?',
          answer: 'The break statement will only terminate the inner loop. The outer loop will continue executing normally and will restart the inner loop on its next iteration.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-06-01',
        type: 'mcq',
        question: 'Which loop is guaranteed to execute its code block at least once?',
        options: [
          'for loop',
          'while loop',
          'do-while loop',
          'infinite loop'
        ],
        correct: 2,
        explanation: 'Because a do-while loop evaluates its condition at the end of the block, the code inside the block executes before the first check happens.',
        difficulty: 'beginner'
      },
      {
        id: 'q-06-02',
        type: 'mcq',
        question: 'In C, what does a for loop with no condition (e.g., for(;;)) evaluate to?',
        options: [
          'A syntax error',
          'An infinite loop',
          'A loop that never executes',
          'It executes exactly once'
        ],
        correct: 1,
        explanation: 'In C, if the condition expression is omitted in a for loop, it is assumed to be true, creating an infinite loop.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-06-03',
        type: 'mcq',
        question: 'What happens when a continue statement is executed inside a for loop?',
        options: [
          'The loop terminates entirely.',
          'The program exits.',
          'The rest of the loop body is skipped, and the condition is checked immediately.',
          'The rest of the loop body is skipped, the update statement executes, and then the condition is checked.'
        ],
        correct: 3,
        explanation: 'In a for loop, continue jumps to the update statement (e.g., i++), executes it, and then evaluates the condition for the next iteration.',
        difficulty: 'intermediate'
      }
    ]
  }
};
