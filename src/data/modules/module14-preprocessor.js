export const module14 = {
  id: 'module-14',
  title: 'The C Preprocessor',
  description: 'Deep dive into macros, conditional compilation, and header guards. Learn how the preprocessor adapts code for different microcontrollers.',
  icon: '⚙️',
  track: 'advanced-c',
  estimatedHours: 4,
  prerequisites: ['module-01'],
  lessons: [
    {
      id: 'lesson-14-1',
      title: 'How the Preprocessor Works',
      content: 'The C preprocessor is a text substitution tool that runs *before* the actual compiler. It scans the source code for preprocessor directives (lines starting with `#`) and modifies the text file. The compiler only sees the output of the preprocessor.\n\nCommands like `#include`, `#define`, and `#ifdef` don\'t produce machine code; they manipulate the C text.',
      codeExamples: [
        {
          title: 'Macro Expansion',
          code: `// Source Code:\n#define PI 3.14159\n#define CIRCLE_AREA(r) (PI * (r) * (r))\n\nint main() {\n    float area = CIRCLE_AREA(5.0);\n    return 0;\n}\n\n/* \nAfter Preprocessing (What the compiler sees):\nint main() {\n    float area = (3.14159 * (5.0) * (5.0));\n    return 0;\n}\n*/`,
          output: `Conceptual Example`
        }
      ],
      keyPoints: [
        'The preprocessor performs pure text find-and-replace.',
        'It has no knowledge of C syntax or types.',
        'You can view the preprocessor output using GCC with the `-E` flag.'
      ],
      commonMistakes: [
        'Placing a semicolon at the end of a `#define` macro (e.g., `#define MAX 100;`). This will inject the semicolon everywhere the macro is used, breaking the code.'
      ],
      interviewQuestions: [
        {
          question: 'What is the first phase of compiling a C program?',
          answer: 'Preprocessing. It handles includes, macro expansion, and conditional compilation before passing the expanded text to the compiler.'
        }
      ]
    },
    {
      id: 'lesson-14-2',
      title: 'Function-like Macros vs Inline Functions',
      content: 'Macros can take arguments, acting like fast, inline functions. However, because they are just text replacement, they suffer from side-effect bugs and lack type checking. In modern C (C99 and later), `inline` functions are generally preferred over complex macros.',
      codeExamples: [
        {
          title: 'The Danger of Macro Side-Effects',
          code: `#include <stdio.h>\n\n#define MAX(a, b) ((a) > (b) ? (a) : (b))\n\nint main() {\n    int x = 5, y = 10;\n    // Looks fine:\n    int z = MAX(x, y); \n    \n    // DANGEROUS SIDE EFFECT:\n    // Expands to: ((x++) > (y++) ? (x++) : (y++))\n    // y gets incremented TWICE!\n    int w = MAX(x++, y++); \n    \n    printf("y is now: %d\\n", y); // Prints 12, not 11\n    return 0;\n}`,
          output: `y is now: 12`
        }
      ],
      keyPoints: [
        'Always wrap macro parameters in parentheses to ensure correct order of operations.',
        'Macros evaluate their arguments multiple times, causing severe bugs if passed arguments with side-effects like `i++`.',
        'Inline functions provide the speed of macros with the safety and type-checking of normal functions.'
      ],
      commonMistakes: [
        'Forgetting parentheses in macros: `#define SQUARE(x) x * x`. `SQUARE(2+3)` expands to `2+3*2+3` which is 11, not 25!'
      ],
      interviewQuestions: [
        {
          question: 'Why are inline functions preferred over macros?',
          answer: 'Inline functions are parsed by the compiler, meaning they get strict type checking, scope rules, and they evaluate their arguments exactly once (avoiding side-effect bugs).'
        }
      ]
    },
    {
      id: 'lesson-14-3',
      title: 'Conditional Compilation',
      content: 'Conditional compilation uses `#if`, `#ifdef`, `#ifndef`, `#else`, and `#endif` to include or exclude blocks of code based on conditions evaluated at compile time. This is the cornerstone of writing portable embedded code that targets multiple different microcontrollers or board revisions.',
      codeExamples: [
        {
          title: 'Hardware Abstraction Layer (HAL)',
          code: `#include <stdio.h>\n\n#define BOARD_REVISION 2\n\nvoid init_hardware() {\n#if BOARD_REVISION == 1\n    printf("Initializing Rev 1 Hardware\\n");\n    // Setup pins for Rev 1\n#elif BOARD_REVISION == 2\n    printf("Initializing Rev 2 Hardware\\n");\n    // Setup pins for Rev 2\n#else\n    #error "Unknown Board Revision!"\n#endif\n}\n\nint main() {\n    init_hardware();\n    return 0;\n}`,
          output: `Initializing Rev 2 Hardware`
        }
      ],
      keyPoints: [
        'Excluded code is completely removed before the compiler sees it, saving memory.',
        '`#error` is useful for stopping the build if invalid configurations are selected.',
        'Macros used for conditional compilation are often passed via compiler flags (e.g., `gcc -DSTM32F4`).'
      ],
      commonMistakes: [
        'Leaving `#if` blocks unterminated (forgetting the `#endif`), resulting in compiler errors at the very end of the file.'
      ],
      interviewQuestions: [
        {
          question: 'How do you prevent a header file from being included multiple times in the same source file?',
          answer: 'By using Include Guards (`#ifndef HEADER_H`, `#define HEADER_H`, ... `#endif`) or the compiler-specific `#pragma once`.'
        }
      ]
    },
    {
      id: 'lesson-14-4',
      title: 'Advanced Macros (Stringification and Token Pasting)',
      content: 'The preprocessor has two special operators: Stringification (`#`) and Token Pasting (`##`). Stringification turns a macro argument into a string literal. Token pasting concatenates two tokens together to form a new variable or function name.',
      codeExamples: [
        {
          title: 'Stringification and Pasting',
          code: `#include <stdio.h>\n\n// Stringification operator: #\n#define PRINT_VAR_NAME(var) printf(#var " is %d\\n", var)\n\n// Token Pasting operator: ##\n#define DECLARE_PIN(port, pin) int PORT_##port##_PIN_##pin = 1\n\nint main() {\n    int sensor_val = 42;\n    PRINT_VAR_NAME(sensor_val);\n\n    // Expands to: int PORT_A_PIN_5 = 1;\n    DECLARE_PIN(A, 5);\n    \n    printf("Pin state: %d\\n", PORT_A_PIN_5);\n    return 0;\n}`,
          output: `sensor_val is 42\nPin state: 1`
        }
      ],
      keyPoints: [
        '`#` converts a token to a string (useful for debugging/logging macros).',
        '`##` pastes tokens together to dynamically generate code (useful for generating boilerplate hardware definitions).'
      ],
      commonMistakes: [
        'Trying to use `#` or `##` outside of a macro definition (they are preprocessor operators only).'
      ],
      interviewQuestions: [
        {
          question: 'What does the `##` operator do in a C macro?',
          answer: 'It is the token-pasting operator. It concatenates two tokens together at preprocessing time to form a single new token, often used to dynamically generate variable or function names.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-14-1',
        type: 'mcq',
        question: 'When is the C preprocessor executed?',
        options: ['During program execution (runtime)', 'After compilation, during linking', 'Before the actual compiler parses the C code', 'During the assembly stage'],
        correct: 2,
        explanation: 'Preprocessing is the very first step in the build process, modifying the source text before handing it to the compiler.',
        difficulty: 'beginner'
      },
      {
        id: 'q-14-2',
        type: 'mcq',
        question: 'What is the problem with `#define MULTIPLY(a, b) a * b` ?',
        options: ['It uses too much memory', 'It doesn\'t have parentheses around arguments, causing operator precedence bugs', 'Macros cannot take arguments', 'It will cause a syntax error'],
        correct: 1,
        explanation: 'If called with `MULTIPLY(2+3, 4)`, it expands to `2+3 * 4` = 14, not 20. It should be `#define MULTIPLY(a, b) ((a) * (b))`',
        difficulty: 'intermediate'
      },
      {
        id: 'q-14-3',
        type: 'mcq',
        question: 'Which directive is used to cause a compilation failure with a custom message?',
        options: ['#fail', '#stop', '#error', '#warning'],
        correct: 2,
        explanation: '`#error "Message"` will stop the preprocessor and output the message, useful for catching bad configuration settings.',
        difficulty: 'beginner'
      },
      {
        id: 'q-14-4',
        type: 'mcq',
        question: 'What is a header guard?',
        options: ['A password for include files', '#ifndef/#define/#endif blocks preventing double inclusion', 'A macro that encrypts strings', 'A compiler flag'],
        correct: 1,
        explanation: 'Header guards ensure that if a header is included multiple times (e.g., transitively), its contents are only processed once, preventing "redefinition" errors.',
        difficulty: 'beginner'
      },
      {
        id: 'q-14-5',
        type: 'mcq',
        question: 'In C99 and newer, what is the recommended alternative to complex, multi-line macros?',
        options: ['Global variables', 'Inline functions', 'Function pointers', 'Goto statements'],
        correct: 1,
        explanation: 'Inline functions provide the performance benefit of macros (no function call overhead) while maintaining type safety and preventing side-effect bugs.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-14-6',
        type: 'mcq',
        question: 'What does the `#` operator do in a `#define` macro?',
        options: ['Adds a comment', 'Performs token pasting', 'Converts the argument into a string literal', 'Returns the size of the argument'],
        correct: 2,
        explanation: 'The stringification operator `#` wraps the passed macro argument in double quotes.',
        difficulty: 'advanced'
      },
      {
        id: 'q-14-7',
        type: 'mcq',
        question: 'How do you define a macro from the GCC command line without modifying the C file?',
        options: ['gcc -M MACRO_NAME', 'gcc -D MACRO_NAME=VALUE', 'gcc --define MACRO_NAME', 'gcc -def MACRO_NAME'],
        correct: 1,
        explanation: 'The `-D` flag (e.g., `-DDEBUG=1`) defines a macro for the preprocessor, equivalent to putting `#define DEBUG 1` at the top of every file.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-14-8',
        type: 'mcq',
        question: 'What is the preprocessed output of code wrapped in an `#if 0` ... `#endif` block?',
        options: ['The code is surrounded by comments', 'The code is completely removed from the preprocessed output', 'The code is compiled but not executed', 'It throws an error'],
        correct: 1,
        explanation: 'The preprocessor evaluates `#if 0` as false and deletes the entire block from the text stream sent to the compiler. This is the safest way to "comment out" large blocks of code.',
        difficulty: 'beginner'
      },
      {
        id: 'q-14-9',
        type: 'mcq',
        question: 'If you have `#define SQ(x) (x*x)` and call `SQ(i++)`, how many times is `i` incremented?',
        options: ['Zero times', 'One time', 'Two times', 'Three times'],
        correct: 2,
        explanation: 'It expands to `(i++*i++)`. The variable is evaluated and incremented twice, leading to undefined behavior and logic bugs.',
        difficulty: 'advanced'
      },
      {
        id: 'q-14-10',
        type: 'mcq',
        question: 'What does `#pragma once` do?',
        options: ['Forces loop unrolling', 'Acts as a modern, non-standard alternative to header guards', 'Sets the compiler warning level', 'Executes the program once'],
        correct: 1,
        explanation: `#pragma once tells the compiler to only include the file once. It is cleaner than #ifndef guards, but technically compiler-specific (though supported by nearly all modern compilers).`,
        difficulty: 'intermediate'
      }
    ]
  }
};

export default module14;
