export const module = {
  id: 'module-03',
  title: 'Variables and Data Types',
  description:
    'Master C data types, variable declarations, memory allocation, and type conversion. Understand how data is stored at the byte level — essential knowledge for embedded programming where every byte counts.',
  icon: '🔢',
  track: 'c-programming',
  estimatedHours: 5,
  prerequisites: ['module-01', 'module-02'],
  lessons: [
    {
      id: 'lesson-03-01',
      title: 'Variables: Declaration, Initialization, and Scope',
      content: `## What is a Variable?

A variable is a **named memory location** that stores a value which can change during program execution. When you declare a variable in C, the compiler reserves a specific number of bytes in memory based on the data type.

### Declaration vs Initialization
\`\`\`c
int count;         // Declaration — memory allocated, value is UNDEFINED (garbage)
int count = 0;     // Declaration + Initialization — memory allocated, value is 0
count = 5;         // Assignment — changes the value stored at that location
\`\`\`

### Variable Naming Rules
1. Can contain letters (a-z, A-Z), digits (0-9), and underscore (_)
2. Must start with a letter or underscore (not a digit)
3. Case-sensitive: \`count\`, \`Count\`, and \`COUNT\` are different variables
4. Cannot use C keywords (int, return, if, while, etc.)
5. No spaces or special characters allowed

### Naming Conventions in Embedded C
| Convention | Example | Used For |
|------------|---------|----------|
| snake_case | \`sensor_value\` | Variables and functions (most common in C) |
| UPPER_SNAKE | \`MAX_BUFFER_SIZE\` | Macros and constants |
| camelCase | \`sensorValue\` | Some embedded codebases |
| Hungarian | \`u8SensorValue\` | Type-prefixed (used in some automotive code) |

### Variable Scope
\`\`\`
┌─── Global Scope ──────────────────────────┐
│  int global_var = 10;  // Accessible everywhere │
│                                              │
│  ┌─── Function Scope (main) ─────────────┐  │
│  │  int local_var = 20; // Only in main   │  │
│  │                                        │  │
│  │  ┌─── Block Scope (if) ────────────┐   │  │
│  │  │  int block_var = 30; // Only here│   │  │
│  │  └─────────────────────────────────┘   │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
\`\`\`

### Storage Classes
| Keyword | Lifetime | Scope | Default Value | Notes |
|---------|----------|-------|---------------|-------|
| \`auto\` | Function call | Local | Garbage | Default for local variables |
| \`static\` | Program lifetime | Local | 0 | Retains value between function calls |
| \`extern\` | Program lifetime | Global | 0 | Declared in one file, used in others |
| \`register\` | Function call | Local | Garbage | Hint to store in CPU register (rarely used today) |`,
      codeExamples: [
        {
          title: 'Variable scope and storage classes',
          code: `#include <stdio.h>

int global_count = 0;  // Global — accessible from any function

void increment_counter(void) {
    static int call_count = 0;  // Static — initialized once, retains value
    call_count++;
    global_count++;
    printf("  Function called %d times, global = %d\\n", call_count, global_count);
}

int main() {
    int local_var = 100;  // Local to main (auto storage class)

    printf("Local variable: %d\\n", local_var);
    printf("Global variable: %d\\n\\n", global_count);

    for (int i = 0; i < 3; i++) {   // 'i' has block scope (C99)
        increment_counter();
    }
    // printf("%d", i);  // ERROR: 'i' is not accessible here

    printf("\\nFinal global count: %d\\n", global_count);
    return 0;
}`,
          output:
            'Local variable: 100\nGlobal variable: 0\n\n  Function called 1 times, global = 1\n  Function called 2 times, global = 2\n  Function called 3 times, global = 3\n\nFinal global count: 3'
        },
        {
          title: 'Uninitialized vs initialized variables',
          code: `#include <stdio.h>

int global_uninitialized;   // .bss section — automatically zeroed
int global_initialized = 42; // .data section — value from Flash

int main() {
    int local_uninitialized;  // Stack — contains GARBAGE value!

    printf("Global uninitialized: %d (always 0)\\n", global_uninitialized);
    printf("Global initialized:   %d\\n", global_initialized);

    // WARNING: local_uninitialized contains garbage!
    // Using it without initialization is UNDEFINED BEHAVIOR.
    // Some compilers may warn: "variable used uninitialized"

    int local_initialized = 99;
    printf("Local initialized:    %d\\n", local_initialized);

    return 0;
}`,
          output:
            'Global uninitialized: 0 (always 0)\nGlobal initialized:   42\nLocal initialized:    99'
        }
      ],
      keyPoints: [
        'A variable is a named memory location with a type, value, and scope',
        'Always initialize local variables — uninitialized locals contain garbage',
        'Global and static variables are automatically initialized to 0',
        'static local variables retain their value between function calls',
        'Use meaningful names: sensor_reading is better than sr or x'
      ],
      commonMistakes: [
        'Using an uninitialized local variable — it contains whatever was on the stack (garbage), leading to unpredictable behavior',
        'Declaring too many global variables — use local variables and pass parameters instead for cleaner, more testable code',
        'Shadowing: declaring a local variable with the same name as a global — the local hides the global within that scope'
      ],
      interviewQuestions: [
        {
          question:
            'What is the difference between a local static variable and a global variable?',
          answer:
            'Both have program lifetime (they exist for the entire duration of the program). The key difference is scope: a global variable is accessible from any function in the file (or other files if not declared static), while a local static variable is only accessible within the function where it is declared. Local static is preferred when you need persistent state without polluting the global namespace.'
        },
        {
          question: 'What is undefined behavior in C? Give an example.',
          answer:
            'Undefined behavior (UB) means the C standard does not define what should happen — the compiler is free to do anything: crash, produce wrong results, or appear to work correctly. Example: reading an uninitialized local variable, dereferencing a NULL pointer, signed integer overflow, accessing an array out of bounds. UB is particularly dangerous because it may work during testing but fail in production.'
        }
      ]
    },
    {
      id: 'lesson-03-02',
      title: 'Constants, Keywords, and Enumerations',
      content: `## Constants

Constants are values that **cannot be changed** after initialization. C provides several ways to define constants:

### 1. #define Macro Constants (Preprocessor)
\`\`\`c
#define PI           3.14159
#define MAX_SENSORS  8
#define LED_PIN      5
\`\`\`
- No memory allocated — text replacement before compilation
- No type checking — can cause subtle bugs
- Convention: UPPER_SNAKE_CASE

### 2. const Qualifier
\`\`\`c
const int MAX_RETRY = 3;
const float VOLTAGE_REF = 3.3f;
\`\`\`
- Memory is allocated (may be in Flash for embedded)
- Type-checked by the compiler
- Preferred in modern C for type safety

### 3. enum (Enumeration)
\`\`\`c
typedef enum {
    STATE_IDLE,      // 0
    STATE_RUNNING,   // 1
    STATE_ERROR,     // 2
    STATE_COMPLETE   // 3
} SystemState;
\`\`\`
- Creates named integer constants starting from 0 by default
- Self-documenting and type-safe
- Widely used in embedded state machines

### C Keywords (Reserved Words)
C has **32 keywords** (C89) that cannot be used as variable names:

\`\`\`
auto      break     case      char
const     continue  default   do
double    else      enum      extern
float     for       goto      if
int       long      register  return
short     signed    sizeof    static
struct    switch    typedef   union
unsigned  void      volatile  while
\`\`\`

C99 added: \`inline\`, \`restrict\`, \`_Bool\`, \`_Complex\`, \`_Imaginary\`
C11 added: \`_Alignas\`, \`_Alignof\`, \`_Atomic\`, \`_Generic\`, \`_Noreturn\`, \`_Static_assert\`, \`_Thread_local\`

### Embedded-Relevant Keywords
- **volatile**: Variable can change unexpectedly (hardware registers, ISR variables)
- **const**: Value cannot be modified (helps compiler optimize, stores in Flash)
- **static**: Limits scope or extends lifetime
- **extern**: Variable is defined in another file
- **register**: Hint to keep variable in CPU register (compiler usually ignores this)`,
      codeExamples: [
        {
          title: 'Constants and enumerations in embedded context',
          code: `#include <stdio.h>
#include <stdint.h>

// Macro constants — no type safety
#define ADC_RESOLUTION  1024
#define VREF            3.3f

// const — type-safe constants
const uint8_t NUM_CHANNELS = 4;

// Enumeration — named states for state machine
typedef enum {
    MOTOR_STOPPED = 0,
    MOTOR_CW      = 1,    // Clockwise
    MOTOR_CCW     = 2,    // Counter-clockwise
    MOTOR_BRAKE   = 3
} MotorState;

// Enumeration with explicit values (bit flags)
typedef enum {
    FLAG_NONE     = 0x00,
    FLAG_READY    = 0x01,  // Bit 0
    FLAG_ERROR    = 0x02,  // Bit 1
    FLAG_BUSY     = 0x04,  // Bit 2
    FLAG_COMPLETE = 0x08   // Bit 3
} StatusFlags;

const char* motor_state_name(MotorState state) {
    switch (state) {
        case MOTOR_STOPPED: return "STOPPED";
        case MOTOR_CW:      return "CLOCKWISE";
        case MOTOR_CCW:     return "COUNTER-CW";
        case MOTOR_BRAKE:   return "BRAKING";
        default:            return "UNKNOWN";
    }
}

int main() {
    MotorState motor = MOTOR_STOPPED;
    printf("Motor state: %s\\n", motor_state_name(motor));

    motor = MOTOR_CW;
    printf("Motor state: %s\\n", motor_state_name(motor));

    // ADC voltage conversion
    uint16_t adc_raw = 512;
    float voltage = (adc_raw * VREF) / ADC_RESOLUTION;
    printf("\\nADC raw: %u → Voltage: %.2f V\\n", adc_raw, voltage);

    // Using bit-flag enums
    uint8_t status = FLAG_READY | FLAG_BUSY;
    printf("\\nStatus flags: 0x%02X\\n", status);
    printf("  Ready?    %s\\n", (status & FLAG_READY) ? "YES" : "NO");
    printf("  Error?    %s\\n", (status & FLAG_ERROR) ? "YES" : "NO");
    printf("  Busy?     %s\\n", (status & FLAG_BUSY)  ? "YES" : "NO");

    return 0;
}`,
          output:
            'Motor state: STOPPED\nMotor state: CLOCKWISE\n\nADC raw: 512 → Voltage: 1.65 V\n\nStatus flags: 0x05\n  Ready?    YES\n  Error?    NO\n  Busy?     YES'
        }
      ],
      keyPoints: [
        '#define creates text-replacement macros with no type checking',
        'const variables are type-checked and may be stored in Flash (ROM)',
        'enum creates named integer constants — ideal for state machines',
        'C89 has 32 keywords; C99/C11 added more',
        'volatile, const, static, and extern are the most important keywords for embedded C'
      ],
      commonMistakes: [
        'Trying to modify a const variable — compilation error',
        'Using magic numbers instead of named constants — makes code unreadable. Use #define or enum.',
        'Forgetting that enum values start at 0 by default and increment by 1'
      ],
      interviewQuestions: [
        {
          question: 'Can a variable be both const and volatile in C? When would you use this?',
          answer:
            'Yes! const volatile is valid and common in embedded systems. It means: the program cannot modify the variable (const), but it can change by external means (volatile). Use case: a read-only hardware status register. The program should never write to it (const), but the hardware updates it (volatile). Example: const volatile uint32_t *status_reg = (const volatile uint32_t *)0x40010000;'
        },
        {
          question: 'What is the difference between #define MAX 100 and const int MAX = 100?',
          answer:
            '#define is a preprocessor text substitution — no type checking, no memory allocated, and it is visible after the #define line until end-of-file or #undef. const int allocates memory, is type-checked, respects scope rules, and can be inspected in a debugger. Prefer const for type safety. #define is still used for conditional compilation (#ifdef) and macro functions.'
        }
      ]
    },
    {
      id: 'lesson-03-03',
      title: 'Data Types: int, char, float, double, void',
      content: `## Fundamental Data Types in C

C provides several built-in data types. The exact sizes depend on the platform, but \`<stdint.h>\` provides guaranteed-width types.

### Integer Types
| Type | Typical Size | Range | Use Case |
|------|-------------|-------|----------|
| \`char\` | 1 byte | -128 to 127 (signed) or 0 to 255 (unsigned) | Characters, small numbers |
| \`short\` | 2 bytes | -32,768 to 32,767 | Smaller integers |
| \`int\` | 4 bytes (PC) / 2 bytes (some MCUs) | -2,147,483,648 to 2,147,483,647 (4 bytes) | Default integer type |
| \`long\` | 4 bytes (32-bit) / 8 bytes (64-bit) | Platform dependent | Larger integers |
| \`long long\` | 8 bytes | -9.2×10^18 to 9.2×10^18 | Very large integers (C99) |

### Signed vs Unsigned
| Modifier | Effect | Example |
|----------|--------|---------|
| \`signed\` | Can be negative (default) | \`signed int x;\` same as \`int x;\` |
| \`unsigned\` | Only non-negative | \`unsigned int x;\` range: 0 to 4,294,967,295 |

### Floating-Point Types
| Type | Size | Precision | Range |
|------|------|-----------|-------|
| \`float\` | 4 bytes | ~7 decimal digits | ±3.4 × 10^38 |
| \`double\` | 8 bytes | ~15 decimal digits | ±1.7 × 10^308 |
| \`long double\` | 8-16 bytes | ≥15 decimal digits | Platform dependent |

### The void Type
- \`void\` means "no type" or "no value"
- \`void function()\` — function returns nothing
- \`void *ptr\` — generic pointer (can point to any type)
- Cannot declare a variable of type void

### Memory Layout Diagrams

**int (4 bytes) storing value 305419896 (0x12345678)**
\`\`\`
Address:  0x1000   0x1001   0x1002   0x1003
         ┌────────┬────────┬────────┬────────┐
Little-E │  0x78  │  0x56  │  0x34  │  0x12  │  ← Most PCs, ARM
         └────────┴────────┴────────┴────────┘
         ┌────────┬────────┬────────┬────────┐
Big-E    │  0x12  │  0x34  │  0x56  │  0x78  │  ← Some network protocols
         └────────┴────────┴────────┴────────┘
\`\`\`

**float (4 bytes) storing 3.14 — IEEE 754**
\`\`\`
Bit layout: [S][EEEEEEEE][MMMMMMMMMMMMMMMMMMMMMMM]
             1     8               23             = 32 bits
S = Sign (0=positive, 1=negative)
E = Exponent (biased by 127)
M = Mantissa (fractional part)
\`\`\``,
      codeExamples: [
        {
          title: 'Exploring data type sizes and ranges',
          code: `#include <stdio.h>
#include <limits.h>    // INT_MAX, CHAR_MAX, etc.
#include <float.h>     // FLT_MAX, DBL_MAX, etc.
#include <stdint.h>

int main() {
    printf("=== Integer Types ===\\n");
    printf("char:       %zu byte,  range: %d to %d\\n",
           sizeof(char), CHAR_MIN, CHAR_MAX);
    printf("short:      %zu bytes, range: %d to %d\\n",
           sizeof(short), SHRT_MIN, SHRT_MAX);
    printf("int:        %zu bytes, range: %d to %d\\n",
           sizeof(int), INT_MIN, INT_MAX);
    printf("long:       %zu bytes\\n", sizeof(long));
    printf("long long:  %zu bytes\\n", sizeof(long long));

    printf("\\n=== Unsigned Types ===\\n");
    printf("unsigned char:  0 to %u\\n", (unsigned char)UCHAR_MAX);
    printf("unsigned short: 0 to %u\\n", (unsigned short)USHRT_MAX);
    printf("unsigned int:   0 to %u\\n", UINT_MAX);

    printf("\\n=== Floating-Point Types ===\\n");
    printf("float:       %zu bytes, precision: %d digits\\n",
           sizeof(float), FLT_DIG);
    printf("double:      %zu bytes, precision: %d digits\\n",
           sizeof(double), DBL_DIG);

    printf("\\n=== Fixed-Width Types (stdint.h) ===\\n");
    printf("uint8_t:  %zu byte\\n",  sizeof(uint8_t));
    printf("uint16_t: %zu bytes\\n", sizeof(uint16_t));
    printf("uint32_t: %zu bytes\\n", sizeof(uint32_t));
    printf("uint64_t: %zu bytes\\n", sizeof(uint64_t));

    return 0;
}`,
          output:
            '=== Integer Types ===\nchar:       1 byte,  range: -128 to 127\nshort:      2 bytes, range: -32768 to 32767\nint:        4 bytes, range: -2147483648 to 2147483647\nlong:       8 bytes\nlong long:  8 bytes\n\n=== Unsigned Types ===\nunsigned char:  0 to 255\nunsigned short: 0 to 65535\nunsigned int:   0 to 4294967295\n\n=== Floating-Point Types ===\nfloat:       4 bytes, precision: 6 digits\ndouble:      8 bytes, precision: 15 digits\n\n=== Fixed-Width Types (stdint.h) ===\nuint8_t:  1 byte\nuint16_t: 2 bytes\nuint32_t: 4 bytes\nuint64_t: 8 bytes'
        },
        {
          title: 'Endianness — how bytes are ordered in memory',
          code: `#include <stdio.h>
#include <stdint.h>

int main() {
    uint32_t value = 0x12345678;
    uint8_t *bytes = (uint8_t *)&value;

    printf("Value: 0x%08X\\n", value);
    printf("Memory layout (byte by byte):\\n");
    for (int i = 0; i < 4; i++) {
        printf("  Address+%d: 0x%02X\\n", i, bytes[i]);
    }

    // Detect endianness
    if (bytes[0] == 0x78) {
        printf("\\nThis system is LITTLE-ENDIAN\\n");
        printf("(Least significant byte at lowest address)\\n");
    } else {
        printf("\\nThis system is BIG-ENDIAN\\n");
        printf("(Most significant byte at lowest address)\\n");
    }

    return 0;
}`,
          output:
            'Value: 0x12345678\nMemory layout (byte by byte):\n  Address+0: 0x78\n  Address+1: 0x56\n  Address+2: 0x34\n  Address+3: 0x12\n\nThis system is LITTLE-ENDIAN\n(Least significant byte at lowest address)'
        }
      ],
      keyPoints: [
        'int size varies by platform — use stdint.h types (uint8_t, int32_t) in embedded code',
        'char is 1 byte; it can be signed or unsigned depending on the platform',
        'float has ~7 digits of precision; double has ~15 digits',
        'void means no value — used for functions that return nothing and generic pointers',
        'ARM and x86 are little-endian; network byte order is big-endian'
      ],
      commonMistakes: [
        'Assuming int is always 4 bytes — it is 2 bytes on some 16-bit embedded platforms',
        'Using float for exact comparisons (if (f == 0.1)) — floating-point has rounding errors. Use a tolerance: if (fabs(f - 0.1) < 0.0001)',
        'Mixing signed and unsigned types in comparisons — can produce unexpected results due to implicit conversion'
      ],
      interviewQuestions: [
        {
          question: 'What is endianness? Why does it matter in embedded systems?',
          answer:
            'Endianness is the byte order used to store multi-byte values. Little-endian stores the least significant byte at the lowest address (used by x86, ARM). Big-endian stores the most significant byte first (used by network protocols, some PowerPC). It matters in embedded systems when exchanging data between devices with different endianness — you must convert byte order (e.g., htonl/ntohl) when communicating over networks or parsing binary protocols.'
        },
        {
          question: 'Why should you avoid using float in embedded systems when possible?',
          answer:
            'Many embedded MCUs (8-bit, 16-bit, and some Cortex-M0) lack a hardware Floating-Point Unit (FPU). Float operations are emulated in software, making them 10-100x slower than integer operations and consuming much more code space. Instead, use fixed-point arithmetic (multiply by a scaling factor, e.g., 3.14 → 314 with a scale of 100) or integer math when possible. Cortex-M4F and M7 have hardware FPU, making float acceptable.'
        }
      ]
    },
    {
      id: 'lesson-03-04',
      title: 'The sizeof Operator and Memory Allocation',
      content: `## sizeof Operator

\`sizeof\` is a **compile-time** operator that returns the size (in bytes) of a data type or variable. It is essential for portable code and memory management.

### Usage
\`\`\`c
sizeof(int)       // Size of the int type (4 on most platforms)
sizeof(variable)  // Size of the variable
sizeof(array)     // Total size of the array in bytes
\`\`\`

### Important: sizeof returns \`size_t\`
\`size_t\` is an unsigned integer type defined in \`<stddef.h>\`. Use \`%zu\` format specifier to print it.

### Calculating Array Length
\`\`\`c
int arr[] = {10, 20, 30, 40, 50};
int length = sizeof(arr) / sizeof(arr[0]);  // 20 / 4 = 5 elements
\`\`\`

### Memory Layout of a Program
\`\`\`
High Address
┌─────────────────────┐
│       Stack         │ ← Local variables, function call frames
│         ↓           │    Grows downward
│                     │
│         ↑           │
│       Heap          │ ← malloc/free (dynamic allocation)
│                     │    Grows upward
├─────────────────────┤
│   .bss (Uninit.)    │ ← Uninitialized globals (zeroed)
├─────────────────────┤
│   .data (Init.)     │ ← Initialized globals
├─────────────────────┤
│   .rodata           │ ← String literals, const data
├─────────────────────┤
│   .text (Code)      │ ← Machine instructions
└─────────────────────┘
Low Address
\`\`\`

### Struct Padding and Alignment
Compilers insert **padding bytes** in structs to align members to their natural boundaries (e.g., int aligned to 4-byte boundary). This affects sizeof.

\`\`\`
struct Example {
    char  a;    // 1 byte
    // 3 bytes padding
    int   b;    // 4 bytes
    char  c;    // 1 byte
    // 3 bytes padding
};
// sizeof = 12 (not 6!)
\`\`\`

Use \`__attribute__((packed))\` (GCC) to remove padding — but be careful about unaligned access on some architectures.`,
      codeExamples: [
        {
          title: 'sizeof with different types and struct padding',
          code: `#include <stdio.h>
#include <stdint.h>

// Normal struct (with padding)
struct Padded {
    char  a;    // 1 byte + 3 padding
    int   b;    // 4 bytes
    char  c;    // 1 byte + 3 padding
};

// Reordered struct (minimal padding)
struct Optimized {
    int   b;    // 4 bytes
    char  a;    // 1 byte
    char  c;    // 1 byte + 2 padding
};

// Packed struct (no padding — use with caution)
struct __attribute__((packed)) Packed {
    char  a;    // 1 byte
    int   b;    // 4 bytes
    char  c;    // 1 byte
};

int main() {
    printf("=== Primitive Types ===\\n");
    printf("sizeof(char):      %zu\\n", sizeof(char));
    printf("sizeof(short):     %zu\\n", sizeof(short));
    printf("sizeof(int):       %zu\\n", sizeof(int));
    printf("sizeof(long):      %zu\\n", sizeof(long));
    printf("sizeof(float):     %zu\\n", sizeof(float));
    printf("sizeof(double):    %zu\\n", sizeof(double));
    printf("sizeof(void *):    %zu\\n", sizeof(void *));

    printf("\\n=== Array ===\\n");
    int arr[] = {10, 20, 30, 40, 50};
    printf("sizeof(arr):       %zu bytes\\n", sizeof(arr));
    printf("sizeof(arr[0]):    %zu bytes\\n", sizeof(arr[0]));
    printf("Array length:      %zu elements\\n", sizeof(arr) / sizeof(arr[0]));

    printf("\\n=== Struct Padding ===\\n");
    printf("sizeof(Padded):    %zu (with padding)\\n", sizeof(struct Padded));
    printf("sizeof(Optimized): %zu (reordered)\\n", sizeof(struct Optimized));
    printf("sizeof(Packed):    %zu (packed)\\n", sizeof(struct Packed));

    return 0;
}`,
          output:
            '=== Primitive Types ===\nsizeof(char):      1\nsizeof(short):     2\nsizeof(int):       4\nsizeof(long):      8\nsizeof(float):     4\nsizeof(double):    8\nsizeof(void *):    8\n\n=== Array ===\nsizeof(arr):       20 bytes\nsizeof(arr[0]):    4 bytes\nArray length:      5 elements\n\n=== Struct Padding ===\nsizeof(Padded):    12 (with padding)\nsizeof(Optimized): 8 (reordered)\nsizeof(Packed):    6 (packed)'
        },
        {
          title: 'Examining memory sections with nm (conceptual)',
          code: `#include <stdio.h>
#include <stdlib.h>

// .rodata section (read-only data in Flash)
const char VERSION[] = "v1.0";

// .data section (initialized, copied to RAM)
int config_value = 42;

// .bss section (uninitialized, zeroed in RAM)
static int error_count;

int main() {
    // Stack (local variable)
    int local_temp = 100;

    // Show addresses to see memory layout
    printf("Code  (.text):    %p\\n", (void *)main);
    printf("Const (.rodata):  %p\\n", (void *)VERSION);
    printf("Init  (.data):    %p\\n", (void *)&config_value);
    printf("Uninit(.bss):     %p\\n", (void *)&error_count);
    printf("Local (stack):    %p\\n", (void *)&local_temp);

    // Use arm-none-eabi-nm firmware.elf to see all symbols
    // Use arm-none-eabi-size firmware.elf to see section sizes

    return 0;
}`,
          output:
            'Code  (.text):    0x5600abcd1000\nConst (.rodata):  0x5600abcd2000\nInit  (.data):    0x5600abcd4010\nUninit(.bss):     0x5600abcd4020\nLocal (stack):    0x7ffd1234abcc'
        }
      ],
      keyPoints: [
        'sizeof returns the size in bytes — use %zu to print size_t',
        'Array length = sizeof(array) / sizeof(array[0])',
        'Structs may have padding for alignment — reorder members to minimize waste',
        'Program memory has sections: .text (code), .data (init globals), .bss (uninit globals), stack, heap',
        'In embedded systems, use arm-none-eabi-size to check if your code fits in Flash/RAM'
      ],
      commonMistakes: [
        'Using sizeof on a pointer and expecting the array size — sizeof(ptr) gives the pointer size (4 or 8), not the array size',
        'Assuming struct size equals the sum of member sizes — padding can increase it significantly',
        'Forgetting that sizeof is evaluated at compile time (except for VLAs in C99)'
      ],
      interviewQuestions: [
        {
          question: 'What is structure padding in C? How can you avoid it?',
          answer:
            'Structure padding is extra bytes inserted by the compiler to align struct members to their natural boundaries (e.g., int to 4-byte boundary). This wastes memory but improves access speed. To minimize padding: (1) Reorder members from largest to smallest, (2) Use __attribute__((packed)) to remove padding (GCC), (3) Use #pragma pack(1). Packed structs save memory but may cause unaligned access penalties or faults on some architectures (e.g., older ARM).'
        },
        {
          question: 'What is the difference between the stack and the heap?',
          answer:
            'Stack: automatically managed, stores local variables and function call frames, grows/shrinks with function calls, very fast (just move stack pointer), limited size (typically 1-8 KB in embedded). Heap: manually managed via malloc/free, used for dynamic memory allocation, can fragment over time, larger but slower. In embedded systems, heap usage is often avoided due to fragmentation risks and non-deterministic allocation time.'
        }
      ]
    },
    {
      id: 'lesson-03-05',
      title: 'Type Conversion: Implicit and Explicit',
      content: `## Type Conversion (Type Casting)

Type conversion changes a value from one data type to another. C supports two kinds:

### 1. Implicit Conversion (Automatic / Coercion)
The compiler automatically converts types when mixing them in expressions. The general rule is **smaller types are promoted to larger types**:

\`\`\`
char → short → int → long → long long → float → double → long double
\`\`\`

This is called **integer promotion** and **usual arithmetic conversion**.

#### Integer Promotion Rules
- \`char\` and \`short\` are promoted to \`int\` in expressions
- If one operand is \`unsigned int\` and the other is \`int\`, the \`int\` is converted to \`unsigned int\`
- If one operand is \`double\` and the other is \`int\`, the \`int\` is converted to \`double\`

### 2. Explicit Conversion (Type Casting)
You manually force a conversion using the cast operator:

\`\`\`c
float result = (float)7 / 2;   // 3.5 instead of 3
uint8_t byte = (uint8_t)large_int;  // Truncate to 8 bits
\`\`\`

### Dangerous Conversions (Data Loss)
\`\`\`
┌─── SAFE (widening) ───────────────────────────┐
│  int → long    (no data loss)                  │
│  int → double  (may lose some precision)       │
│  char → int    (always safe)                   │
└────────────────────────────────────────────────┘

┌─── DANGEROUS (narrowing) ─────────────────────┐
│  int → char    (truncates to 8 bits!)          │
│  double → int  (truncates decimal part!)       │
│  int → short   (truncates to 16 bits!)         │
│  signed → unsigned (negative becomes large +)  │
└────────────────────────────────────────────────┘
\`\`\`

### Signed-Unsigned Trap
This is one of the most common bugs in embedded C:
\`\`\`c
int a = -1;
unsigned int b = 1;
if (a < b) {
    printf("Expected: -1 < 1\\n");
} else {
    printf("SURPRISE: -1 is NOT < 1!\\n");
    // -1 is converted to unsigned (4294967295), which is > 1
}
\`\`\``,
      codeExamples: [
        {
          title: 'Implicit and explicit type conversions',
          code: `#include <stdio.h>
#include <stdint.h>

int main() {
    // === Implicit Conversion ===
    printf("=== Implicit Conversions ===\\n");

    int i = 7;
    float f = i;    // int → float (implicit)
    printf("int %d → float %f\\n", i, f);

    double d = 3.14;
    int truncated = d;  // double → int (truncates!)
    printf("double %f → int %d (truncated!)\\n", d, truncated);

    char c = 'A';    // 'A' = 65
    int promoted = c + 1;  // char promoted to int
    printf("char '%c' (%d) + 1 = %d ('%c')\\n", c, c, promoted, promoted);

    // === Explicit Conversion (Casting) ===
    printf("\\n=== Explicit Conversions ===\\n");

    int a = 7, b = 2;
    printf("Integer division:  7/2 = %d\\n", a / b);
    printf("Float cast:        7/2 = %.1f\\n", (float)a / b);

    // Narrowing conversion
    int large = 300;
    uint8_t byte = (uint8_t)large;   // 300 % 256 = 44
    printf("int %d → uint8_t %u (overflow!)\\n", large, byte);

    // === The Signed-Unsigned Trap ===
    printf("\\n=== Signed-Unsigned Trap ===\\n");
    int x = -1;
    unsigned int y = 1;
    if (x < y) {
        printf("-1 < 1 (expected)\\n");
    } else {
        printf("-1 >= 1 (WRONG! -1 became %u as unsigned)\\n",
               (unsigned int)x);
    }

    return 0;
}`,
          output:
            '=== Implicit Conversions ===\nint 7 → float 7.000000\ndouble 3.140000 → int 3 (truncated!)\nchar \'A\' (65) + 1 = 66 (\'B\')\n\n=== Explicit Conversions ===\nInteger division:  7/2 = 3\nFloat cast:        7/2 = 3.5\nint 300 → uint8_t 44 (overflow!)\n\n=== Signed-Unsigned Trap ===\n-1 >= 1 (WRONG! -1 became 4294967295 as unsigned)'
        },
        {
          title: 'Fixed-point arithmetic (avoiding float in embedded)',
          code: `#include <stdio.h>
#include <stdint.h>

// Fixed-point: use integers with a scale factor
// Q8.8 format: 8 integer bits, 8 fractional bits
// Scale factor = 256 (2^8)

#define FIXED_SCALE   256
#define TO_FIXED(x)   ((int16_t)((x) * FIXED_SCALE))
#define TO_FLOAT(x)   ((float)(x) / FIXED_SCALE)
#define FIXED_MUL(a, b) ((int16_t)(((int32_t)(a) * (b)) / FIXED_SCALE))

int main() {
    // Represent 3.14 and 2.5 in fixed-point
    int16_t a = TO_FIXED(3.14);   // 3.14 * 256 = 803
    int16_t b = TO_FIXED(2.5);    // 2.5 * 256 = 640

    printf("Fixed-point representation:\\n");
    printf("  3.14 → %d (raw)\\n", a);
    printf("  2.50 → %d (raw)\\n", b);

    // Addition (works directly)
    int16_t sum = a + b;
    printf("\\n  3.14 + 2.50 = %.2f\\n", TO_FLOAT(sum));

    // Multiplication (need to divide by scale)
    int16_t product = FIXED_MUL(a, b);
    printf("  3.14 × 2.50 = %.2f\\n", TO_FLOAT(product));

    // Temperature conversion: F = C * 9/5 + 32
    int16_t temp_c = TO_FIXED(25.0);
    int16_t nine_fifths = TO_FIXED(1.8);  // 9/5
    int16_t thirty_two = TO_FIXED(32.0);
    int16_t temp_f = FIXED_MUL(temp_c, nine_fifths) + thirty_two;
    printf("\\n  25.0°C = %.1f°F\\n", TO_FLOAT(temp_f));

    return 0;
}`,
          output:
            'Fixed-point representation:\n  3.14 → 803 (raw)\n  2.50 → 640 (raw)\n\n  3.14 + 2.50 = 5.64\n  3.14 × 2.50 = 7.85\n\n  25.0°C = 77.0°F'
        }
      ],
      keyPoints: [
        'Implicit conversion: smaller types are automatically promoted to larger types',
        'Explicit conversion: use (type) cast operator for intentional conversions',
        'Narrowing conversions (int → char) can cause data loss — always cast explicitly',
        'The signed/unsigned comparison trap: -1 becomes a very large unsigned number',
        'In embedded, use fixed-point arithmetic instead of float when there is no FPU'
      ],
      commonMistakes: [
        'Comparing signed and unsigned integers without casting — leads to wrong comparisons',
        'Assuming integer division gives a float result — 7/2 is 3, not 3.5',
        'Casting a large integer to uint8_t without checking for overflow — 300 becomes 44',
        'Using float where int would suffice — wastes CPU cycles on FPU-less embedded processors'
      ],
      interviewQuestions: [
        {
          question:
            'What is integer promotion in C? Why does it matter?',
          answer:
            'Integer promotion is the implicit conversion of char and short to int in expressions. When you write char a = 10, b = 20; char c = a + b; — the values are promoted to int for the addition, then the result is truncated back to char. This matters because (1) the intermediate result may overflow the target type, and (2) it can affect the sign of the result if char is signed. It is also relevant when passing char/short to variadic functions like printf.'
        },
        {
          question: 'What is fixed-point arithmetic and when is it used?',
          answer:
            'Fixed-point arithmetic represents fractional numbers using integers with a fixed scaling factor (e.g., multiply by 256 for 8-bit fractional precision). It is used in embedded systems without a hardware FPU (like Cortex-M0) where float operations are software-emulated and very slow. Fixed-point is 10-100x faster than software float and uses less code space. Common formats include Q8.8 (16-bit with 8 fractional bits) and Q16.16 (32-bit with 16 fractional bits).'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-03-01',
        type: 'mcq',
        question: 'What is the size of a char in C?',
        options: ['Depends on the platform', '1 byte (always)', '2 bytes', '4 bytes'],
        correct: 1,
        explanation:
          'sizeof(char) is always 1 byte in C — this is guaranteed by the standard. However, a "byte" is at least 8 bits (CHAR_BIT >= 8), and on some DSPs, a byte can be 16 or 32 bits.',
        difficulty: 'beginner'
      },
      {
        id: 'q-03-02',
        type: 'mcq',
        question: 'What is stored in the .bss section of a C program?',
        options: [
          'Machine code instructions',
          'String literals and constants',
          'Uninitialized global and static variables',
          'Local variables'
        ],
        correct: 2,
        explanation:
          'The .bss section contains uninitialized global and static variables. They are automatically zeroed at program startup. The .bss section does not occupy space in the binary file — only in RAM at runtime. This saves Flash/ROM space.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-03-03',
        type: 'mcq',
        question:
          'What is the output of: printf("%d", (int)3.9); ?',
        options: ['3.9', '4', '3', '0'],
        correct: 2,
        explanation:
          'Casting a float/double to int truncates the fractional part (does not round). So (int)3.9 = 3, (int)3.1 = 3, (int)-2.7 = -2. To round, use the round() function from <math.h>.',
        difficulty: 'beginner'
      },
      {
        id: 'q-03-04',
        type: 'mcq',
        question:
          'What happens when you store the value 300 in a uint8_t variable?',
        options: [
          'Compilation error',
          'The value wraps around: 300 % 256 = 44',
          'The value is clamped to 255',
          'Runtime error'
        ],
        correct: 1,
        explanation:
          'uint8_t can hold values 0–255. Storing 300 causes an overflow — the value wraps around modulo 256. 300 - 256 = 44. This is well-defined for unsigned types in C. There is no runtime error; the data is silently truncated.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-03-05',
        type: 'mcq',
        question: 'What does the static keyword do for a local variable?',
        options: [
          'Makes it constant',
          'Stores it in Flash memory',
          'Makes it retain its value between function calls',
          'Makes it visible to other files'
        ],
        correct: 2,
        explanation:
          'A static local variable is initialized only once (at program start) and retains its value between function calls. Its scope remains local to the function, but its lifetime extends to the entire program. It is stored in the .data or .bss section (not on the stack).',
        difficulty: 'beginner'
      },
      {
        id: 'q-03-06',
        type: 'mcq',
        question:
          'What is the result of comparing -1 < 1u in C?',
        options: ['true (1)', 'false (0)', 'Compilation error', 'Undefined behavior'],
        correct: 1,
        explanation:
          'When comparing int (-1) with unsigned int (1u), the int is implicitly converted to unsigned int. -1 becomes 4294967295 (0xFFFFFFFF), which is greater than 1. So -1 < 1u evaluates to false (0). This is a classic signed/unsigned comparison trap.',
        difficulty: 'advanced'
      },
      {
        id: 'q-03-07',
        type: 'mcq',
        question:
          'Given: struct S { char a; int b; char c; }; — what is sizeof(struct S) on a 32-bit system?',
        options: ['6 bytes', '8 bytes', '10 bytes', '12 bytes'],
        correct: 3,
        explanation:
          'The compiler adds padding for alignment: char a (1 byte) + 3 bytes padding + int b (4 bytes) + char c (1 byte) + 3 bytes padding = 12 bytes. The struct must be a multiple of the largest member alignment (4 bytes for int).',
        difficulty: 'intermediate'
      },
      {
        id: 'q-03-08',
        type: 'mcq',
        question:
          'Which format specifier should you use to print a size_t value?',
        options: ['%d', '%u', '%zu', '%ld'],
        correct: 2,
        explanation:
          '%zu is the correct format specifier for size_t (introduced in C99). size_t is an unsigned integer type whose size matches the platform word size. Using %d or %u may work on some platforms but can cause warnings or incorrect output on 64-bit systems where size_t is 8 bytes.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-03-09',
        type: 'mcq',
        question: 'How do you calculate the number of elements in a statically declared array?',
        options: [
          'strlen(array)',
          'sizeof(array)',
          'sizeof(array) / sizeof(array[0])',
          'array.length'
        ],
        correct: 2,
        explanation:
          'sizeof(array) gives the total size in bytes. sizeof(array[0]) gives the size of one element. Dividing them gives the number of elements. This only works for arrays, not pointers. For example: int arr[5]; → sizeof(arr)/sizeof(arr[0]) = 20/4 = 5.',
        difficulty: 'beginner'
      },
      {
        id: 'q-03-10',
        type: 'mcq',
        question:
          'What is the default value of an uninitialized local int variable in C?',
        options: ['0', '-1', 'NULL', 'Undefined (garbage value)'],
        correct: 3,
        explanation:
          'Uninitialized local variables contain whatever was previously on the stack at that memory location — this is garbage data. Unlike global and static variables (which are zeroed), local variables must be explicitly initialized. Using an uninitialized variable is undefined behavior.',
        difficulty: 'beginner'
      },
      {
        id: 'q-03-11',
        type: 'mcq',
        question:
          'What is the range of a signed 8-bit integer (int8_t)?',
        options: ['0 to 255', '-127 to 127', '-128 to 127', '-128 to 128'],
        correct: 2,
        explanation:
          'An 8-bit signed integer using two\'s complement has a range of -128 to 127. The MSB is the sign bit. With 7 value bits: 2^7 = 128 values on each side, but zero takes one positive slot, giving -128 to +127.',
        difficulty: 'beginner'
      }
    ]
  }
};
