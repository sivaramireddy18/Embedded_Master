export const module = {
  id: 'module-07',
  title: 'Functions & Scope',
  description: 'Break your code into modular, reusable pieces. Understand how arguments are passed, local vs global scope, and how the Call Stack works under the hood.',
  icon: '📦',
  track: 'c-programming',
  estimatedHours: 5,
  prerequisites: ['module-06'],
  lessons: [
    {
      id: 'lesson-07-01',
      title: 'Introduction to Functions',
      content: `## What is a Function?

A function is a self-contained block of code that performs a specific task. You have already been using functions: \`main()\` is a function, and \`printf()\` is a function!

Functions allow you to:
1. **Reuse code** instead of writing the same logic multiple times.
2. **Organize code** into logical, readable blocks.
3. **Abstract complexity** so the caller doesn't need to know *how* it works, only *what* it does.

### Function Anatomy
A function in C has four main parts:
1. **Return Type**: The type of data the function sends back (e.g., \`int\`, \`float\`, or \`void\` if nothing is returned).
2. **Function Name**: The identifier used to call the function.
3. **Parameters**: Variables that accept data passed into the function (in parentheses).
4. **Body**: The block of code \`{}\` that executes when called.

\`\`\`c
// ReturnType Name(Parameters)
int add_numbers(int a, int b) {
    int sum = a + b; // Body
    return sum;      // Return statement
}
\`\`\`

### Calling a Function
To use a function, you "call" or "invoke" it by writing its name followed by arguments in parentheses.

\`\`\`c
int result = add_numbers(5, 7); // result becomes 12
\`\`\`

### The \`void\` Keyword
If a function doesn't return anything, its return type is \`void\`. If it takes no arguments, you can put \`void\` in the parentheses.
\`\`\`c
void turn_on_led(void) {
    // Hardware specific code to turn on LED
}
\`\`\`
`,
      codeExamples: [
        {
          title: 'Defining and calling a function',
          code: `#include <stdio.h>

// Function definition
int multiply(int x, int y) {
    return x * y;
}

// Function with no return and no arguments
void print_greeting(void) {
    printf("Welcome to Embedded Systems!\\n");
}

int main() {
    print_greeting(); // Call the void function
    
    int a = 6;
    int b = 7;
    int product = multiply(a, b); // Call the int function
    
    printf("%d * %d = %d\\n", a, b, product);
    return 0;
}`,
          output: "Welcome to Embedded Systems!\n6 * 7 = 42"
        }
      ],
      keyPoints: [
        'Functions help modularize and reuse code.',
        'A function must have a return type, name, parameter list, and body.',
        'Use the void keyword when a function does not return a value or takes no parameters.'
      ],
      commonMistakes: [
        'Forgetting the return statement in a function that declares a non-void return type.',
        'Trying to return a value from a function declared as void.'
      ],
      interviewQuestions: [
        {
          question: 'What happens if a function declared to return an int does not have a return statement?',
          answer: 'In C, this results in undefined behavior. The compiler will usually issue a warning, but if the code executes, the caller will receive whatever garbage value happens to be in the CPU return register (like EAX in x86 or R0 in ARM) at the time the function exits.'
        }
      ]
    },
    {
      id: 'lesson-07-02',
      title: 'Declaration vs Definition',
      content: `## Declaration vs Definition

In C, the compiler reads code from top to bottom. If you try to call a function before the compiler has seen it, it will throw an error (or a warning, assuming an implicit declaration which is bad practice).

To solve this, C separates a function into two concepts: **Declaration (Prototype)** and **Definition**.

### 1. Function Declaration (Prototype)
A prototype tells the compiler: "This function exists, it takes these arguments, and returns this type. I'll give you the actual code later."

\`\`\`c
// This is a declaration. Note the semicolon!
int multiply(int a, int b); 
\`\`\`

Prototypes are usually placed at the top of a \`.c\` file or inside a Header file (\`.h\`).

### 2. Function Definition
The definition provides the actual body of the function.

\`\`\`c
// This is the definition.
int multiply(int a, int b) {
    return a * b;
}
\`\`\`

### Why use Prototypes?
1. **Organization**: You can put \`main()\` at the top of your file (which is easier to read) and all your helper functions at the bottom.
2. **Header Files**: When you \`#include <stdio.h>\`, you are actually including the prototypes for functions like \`printf\`. The actual definitions are pre-compiled in the C standard library.
`,
      codeExamples: [
        {
          title: 'Using Prototypes correctly',
          code: `#include <stdio.h>

// Function Prototypes
float calculate_area(float radius);
void print_result(float area);

int main() {
    float r = 5.0;
    float area = calculate_area(r); // Compiler knows about this because of the prototype
    
    print_result(area);
    return 0;
}

// Function Definitions (can be placed after main)
float calculate_area(float radius) {
    return 3.14159 * radius * radius;
}

void print_result(float area) {
    printf("The area is %.2f\\n", area);
}`,
          output: "The area is 78.54"
        }
      ],
      keyPoints: [
        'A declaration (prototype) tells the compiler the function signature (name, return type, parameters).',
        'A definition contains the actual code block.',
        'Prototypes allow you to call functions before they are defined in the file.',
        'Header files (.h) primarily contain function prototypes and macros, not definitions.'
      ],
      commonMistakes: [
        'Forgetting the semicolon at the end of a function prototype.',
        'Having mismatched types between the prototype and the actual definition.'
      ],
      interviewQuestions: [
        {
          question: 'Why shouldn\'t you put function definitions in a header file?',
          answer: 'If you put a function definition in a header file, and that header file is included by multiple .c files, the compiler will create multiple definitions of the same function. During the linking stage, the linker will throw a "multiple definition" error. Header files should only contain declarations; definitions belong in .c files.'
        }
      ]
    },
    {
      id: 'lesson-07-03',
      title: 'Variable Scope & Lifetime',
      content: `## Scope and Lifetime

Not all variables are accessible from everywhere. A variable's **scope** determines where it can be seen, and its **lifetime** determines how long it exists in memory.

### 1. Local Variables (Block Scope)
Variables declared inside a function (or any \`{}\` block) are local.
- **Scope**: Only accessible within that block.
- **Lifetime**: Created when the block starts, destroyed when the block ends.
- **Memory**: Stored on the **Stack**.

\`\`\`c
void do_something() {
    int x = 10; // Local to do_something
}
// x does not exist here
\`\`\`

### 2. Global Variables (File Scope)
Variables declared outside of any function are global.
- **Scope**: Accessible from anywhere in the file (and potentially other files).
- **Lifetime**: Created when the program starts, destroyed when it ends.
- **Memory**: Stored in the **Data** or **BSS** segment (RAM).

\`\`\`c
int global_counter = 0; // Global variable

void increment() {
    global_counter++; // Accesses the global variable
}
\`\`\`
*Warning: Overusing global variables is bad practice! It makes code hard to test and debug because any function can change the variable unexpectedly.*

### 3. Static Local Variables
Using the \`static\` keyword on a local variable changes its lifetime.
- **Scope**: Still local to the function!
- **Lifetime**: Persists across function calls (created once at startup).
- **Memory**: Stored in the Data/BSS segment, not the stack.

\`\`\`c
void count_calls() {
    static int calls = 0; // Initialized ONLY ONCE
    calls++;
    printf("Called %d times\\n", calls);
}
\`\`\`
`,
      codeExamples: [
        {
          title: 'Demonstrating Local, Global, and Static variables',
          code: `#include <stdio.h>

int global_var = 100; // Global

void demo_function() {
    int local_var = 0;        // Created fresh every time
    static int static_var = 0; // Remembers its value
    
    local_var++;
    static_var++;
    global_var++;
    
    printf("Local: %d, Static: %d, Global: %d\\n", 
           local_var, static_var, global_var);
}

int main() {
    demo_function();
    demo_function();
    demo_function();
    return 0;
}`,
          output: "Local: 1, Static: 1, Global: 101\nLocal: 1, Static: 2, Global: 102\nLocal: 1, Static: 3, Global: 103"
        }
      ],
      keyPoints: [
        'Local variables are stored on the stack and destroyed when the function exits.',
        'Global variables are stored in RAM permanently and accessible everywhere.',
        'Static local variables retain their value between function calls but remain locally scoped.',
        'Avoid global variables when possible to prevent unintended side-effects.'
      ],
      commonMistakes: [
        'Assuming an uninitialized local variable defaults to 0. (It contains garbage data!).',
        'Name shadowing: naming a local variable the same as a global variable, which hides the global variable within that function.'
      ],
      interviewQuestions: [
        {
          question: 'What are the two different meanings of the "static" keyword in C?',
          answer: '1. Inside a function: It changes a local variable\'s lifetime so it persists across calls (stored in Data/BSS instead of Stack). 2. Outside a function (global): It changes a global variable or function\'s linkage to "internal", meaning it can only be accessed from within that specific .c file, hiding it from the linker and other files.'
        }
      ]
    },
    {
      id: 'lesson-07-04',
      title: 'Pass by Value & The Call Stack',
      content: `## Pass by Value

In C, when you pass variables to a function, you are passing them by **value**. 
This means the function receives a **copy** of the data, not the original variable.

\`\`\`c
void try_to_change(int x) {
    x = 99; // Changes the COPY
}

int main() {
    int my_val = 5;
    try_to_change(my_val);
    // my_val is STILL 5!
}
\`\`\`
Because \`x\` is a completely separate variable in memory, changing it does not affect \`my_val\`. (To change the original, you must pass by *reference* using Pointers, which we will learn later).

---

## The Call Stack

How does the computer keep track of all these local variables and function copies? It uses a memory structure called **The Stack**.

The stack is a Last-In, First-Out (LIFO) data structure. When a function is called, a block of memory called a **Stack Frame** is pushed onto the stack.

### What is in a Stack Frame?
1. The function's local variables (like \`x\`).
2. The arguments passed to it.
3. The **Return Address**: Where the CPU should jump back to when the function finishes.

### The Stack in Action
Imagine \`main()\` calls \`funcA()\`, which calls \`funcB()\`.

1. Program starts: \`main()\` frame is pushed.
2. \`main()\` calls \`funcA()\`: \`funcA()\` frame is pushed on top.
3. \`funcA()\` calls \`funcB()\`: \`funcB()\` frame is pushed on top.
4. \`funcB()\` finishes: Its frame is popped (destroyed). CPU jumps back to \`funcA()\`.
5. \`funcA()\` finishes: Its frame is popped. CPU jumps back to \`main()\`.

### Stack Overflow
The stack has a fixed, limited size (in embedded systems, often just a few kilobytes!). If you call too many functions deeply (like infinite recursion) or declare massive local variables (like \`int huge_array[10000]\`), the stack will exceed its bounds and crash into other memory. This is a **Stack Overflow**.
`,
      codeExamples: [
        {
          title: 'Pass by value demonstration',
          code: `#include <stdio.h>

void calculate_discount(int price) {
    price = price - 10; // Only modifies the local copy!
    printf("Price inside function: $%d\\n", price);
}

int main() {
    int original_price = 50;
    
    printf("Price before function: $%d\\n", original_price);
    calculate_discount(original_price);
    printf("Price after function:  $%d\\n", original_price);
    
    return 0;
}`,
          output: "Price before function: $50\nPrice inside function: $40\nPrice after function:  $50"
        }
      ],
      keyPoints: [
        'C passes arguments by value (copying the data).',
        'Functions cannot permanently modify the variables passed to them directly without using pointers.',
        'Every function call pushes a new Stack Frame containing local variables and return addresses.',
        'When a function exits, its Stack Frame is popped and the local variables are destroyed.',
        'Stack Overflows happen when you run out of stack memory.'
      ],
      commonMistakes: [
        'Writing recursive functions (functions that call themselves) without a base case, causing an immediate Stack Overflow.',
        'Allocating large arrays as local variables inside functions.'
      ],
      interviewQuestions: [
        {
          question: 'What causes a Stack Overflow in embedded systems?',
          answer: 'A stack overflow occurs when the stack pointer exceeds the memory allocated for the stack. This is usually caused by: 1) Infinite or excessively deep recursion, 2) Very deep function call chains, 3) Allocating large data structures (like massive arrays or structs) as local variables on the stack. In embedded systems where RAM is heavily constrained (e.g., 8KB total), this is a common and fatal error.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-07-01',
        type: 'mcq',
        question: 'If you want a local variable in a function to retain its value between multiple calls to that function, which keyword should you use?',
        options: ['global', 'static', 'const', 'volatile'],
        correct: 1,
        explanation: 'The static keyword, when used on a local variable inside a function, changes its lifetime to persist for the entire run of the program, storing it in the data segment rather than the stack.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-07-02',
        type: 'mcq',
        question: 'What is a function prototype?',
        options: [
          'The actual body and logic of the function.',
          'A declaration that tells the compiler the function name, return type, and parameters.',
          'A special function that runs before main().',
          'A function that does not return anything.'
        ],
        correct: 1,
        explanation: 'A prototype is a declaration (e.g., int add(int a, int b);) that informs the compiler about the function\'s signature so it can validate calls to it before seeing the actual definition.',
        difficulty: 'beginner'
      },
      {
        id: 'q-07-03',
        type: 'mcq',
        question: 'Because C uses "pass by value", what happens when you pass an integer variable to a function and modify it inside the function?',
        options: [
          'The original variable is modified.',
          'The program throws an error.',
          'A local copy is modified, and the original variable remains unchanged.',
          'The function automatically returns the modified value.'
        ],
        correct: 2,
        explanation: 'Pass by value means the function receives a copy of the data. Modifying the parameter variable inside the function only changes the local copy on the stack, not the original variable in the caller.',
        difficulty: 'beginner'
      }
    ]
  }
};
