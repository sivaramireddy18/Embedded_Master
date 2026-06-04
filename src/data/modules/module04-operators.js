export const module = {
  id: 'module-04',
  title: 'Operators in C',
  description:
    'Master all C operators from arithmetic to bitwise. Special emphasis on bitwise operations for embedded register manipulation — the most critical skill for hardware-level programming.',
  icon: '⚙️',
  track: 'c-programming',
  estimatedHours: 6,
  prerequisites: ['module-03'],
  lessons: [
    {
      id: 'lesson-04-01',
      title: 'Arithmetic and Assignment Operators',
      content: `## Arithmetic Operators

Arithmetic operators perform mathematical computations on numeric operands.

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| \`+\` | Addition | \`5 + 3\` | \`8\` |
| \`-\` | Subtraction | \`5 - 3\` | \`2\` |
| \`*\` | Multiplication | \`5 * 3\` | \`15\` |
| \`/\` | Division | \`7 / 2\` | \`3\` (integer truncation) |
| \`%\` | Modulus (remainder) | \`7 % 2\` | \`1\` |
| \`++\` | Increment | \`x++\` or \`++x\` | Increase by 1 |
| \`--\` | Decrement | \`x--\` or \`--x\` | Decrease by 1 |

### Integer Division vs Float Division
\`\`\`c
7 / 2    = 3       // Both operands int → integer result (truncated)
7.0 / 2  = 3.5     // One operand is double → double result
(float)7 / 2 = 3.5 // Cast makes it floating-point division
7 % 2    = 1       // Remainder — only works with integers
\`\`\`

### Pre-increment vs Post-increment
\`\`\`c
int x = 5;
int a = ++x;  // Pre-increment:  x becomes 6 FIRST, then a = 6
int b = x++;  // Post-increment: b = 6 (current value), then x becomes 7
\`\`\`

## Assignment Operators

| Operator | Equivalent | Example |
|----------|-----------|---------|
| \`=\` | Assign | \`x = 5\` |
| \`+=\` | Add and assign | \`x += 3\` → \`x = x + 3\` |
| \`-=\` | Subtract and assign | \`x -= 2\` → \`x = x - 2\` |
| \`*=\` | Multiply and assign | \`x *= 4\` → \`x = x * 4\` |
| \`/=\` | Divide and assign | \`x /= 2\` → \`x = x / 2\` |
| \`%=\` | Modulus and assign | \`x %= 3\` → \`x = x % 3\` |
| \`&=\` | Bitwise AND assign | \`x &= 0xFF\` |
| \`\\|=\` | Bitwise OR assign | \`x \\|= 0x01\` |
| \`^=\` | Bitwise XOR assign | \`x ^= 0x01\` |
| \`<<=\` | Left shift assign | \`x <<= 2\` |
| \`>>=\` | Right shift assign | \`x >>= 1\` |`,
      codeExamples: [
        {
          title: 'Arithmetic operations and integer division',
          code: `#include <stdio.h>

int main() {
    int a = 17, b = 5;

    printf("a = %d, b = %d\\n\\n", a, b);
    printf("a + b  = %d\\n", a + b);
    printf("a - b  = %d\\n", a - b);
    printf("a * b  = %d\\n", a * b);
    printf("a / b  = %d  (integer division — truncated!)\\n", a / b);
    printf("a %% b = %d  (remainder)\\n", a % b);

    // Verify: quotient * divisor + remainder = dividend
    printf("\\nVerify: %d * %d + %d = %d ✓\\n", a/b, b, a%b, (a/b)*b + a%b);

    // Pre vs Post increment
    printf("\\n--- Pre vs Post Increment ---\\n");
    int x = 10;
    printf("x = %d\\n", x);
    printf("++x = %d  (x is now %d)\\n", ++x, x);  // x=11, returns 11
    printf("x++ = %d  (x is now %d)\\n", x++, x);  // returns 11, then x=12

    // Compound assignment in embedded context
    printf("\\n--- Compound Assignment ---\\n");
    int sensor = 100;
    sensor += 5;    // Apply offset
    printf("After += 5: %d\\n", sensor);
    sensor *= 2;    // Scale
    printf("After *= 2: %d\\n", sensor);
    sensor >>= 1;   // Divide by 2 using shift
    printf("After >>= 1: %d\\n", sensor);

    return 0;
}`,
          output:
            'a = 17, b = 5\n\na + b  = 22\na - b  = 12\na * b  = 85\na / b  = 3  (integer division — truncated!)\na % b = 2  (remainder)\n\nVerify: 3 * 5 + 2 = 17 ✓\n\n--- Pre vs Post Increment ---\nx = 10\n++x = 11  (x is now 11)\nx++ = 11  (x is now 12)\n\n--- Compound Assignment ---\nAfter += 5: 105\nAfter *= 2: 210\nAfter >>= 1: 105'
        }
      ],
      keyPoints: [
        'Integer division truncates — 7/2 = 3, not 3.5',
        'Modulus (%) gives the remainder — only works with integers',
        'Pre-increment (++x) increments before use; post-increment (x++) increments after use',
        'Compound operators (+=, -=, |=, &=) are concise and commonly used in embedded C',
        'Division by zero causes undefined behavior — always check the divisor'
      ],
      commonMistakes: [
        'Dividing two integers and expecting a float result — cast one operand: (float)a / b',
        'Using ++ or -- on the same variable multiple times in one expression — undefined behavior (e.g., x = x++ + ++x)',
        'Forgetting that % has the same precedence as * and /'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between ++x and x++?',
          answer:
            '++x (pre-increment) increments x first, then returns the new value. x++ (post-increment) returns the current value of x, then increments it. In isolation (as a statement), both have the same effect. The difference matters in expressions: int a = ++x; gives a the incremented value, while int a = x++; gives a the old value. In embedded tight loops, ++x was historically preferred for performance, but modern compilers optimize both equally.'
        },
        {
          question: 'Why do embedded developers use x >>= 1 instead of x /= 2?',
          answer:
            'Right shift by 1 (x >>= 1) is equivalent to dividing by 2 for unsigned integers and is often faster on processors without hardware division (many 8-bit and some 16-bit MCUs lack a DIV instruction). Similarly, x <<= 1 multiplies by 2. However, modern 32-bit ARM compilers optimize x /= 2 to a shift automatically, so the performance benefit is mainly for older architectures. For signed integers, the behavior of right shift is implementation-defined.'
        }
      ]
    },
    {
      id: 'lesson-04-02',
      title: 'Relational and Logical Operators',
      content: `## Relational Operators

Relational operators compare two values and return **1 (true)** or **0 (false)**.

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`==\` | Equal to | \`5 == 5\` | \`1\` (true) |
| \`!=\` | Not equal to | \`5 != 3\` | \`1\` (true) |
| \`>\` | Greater than | \`5 > 3\` | \`1\` (true) |
| \`<\` | Less than | \`3 < 5\` | \`1\` (true) |
| \`>=\` | Greater than or equal | \`5 >= 5\` | \`1\` (true) |
| \`<=\` | Less than or equal | \`3 <= 5\` | \`1\` (true) |

## Logical Operators

Logical operators combine boolean expressions.

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`&&\` | Logical AND | \`(1 && 0)\` | \`0\` (false) |
| \`\\|\\|\` | Logical OR | \`(1 \\|\\| 0)\` | \`1\` (true) |
| \`!\` | Logical NOT | \`!0\` | \`1\` (true) |

### Truth Table
\`\`\`
A    B    A && B    A || B    !A
0    0      0         0       1
0    1      0         1       1
1    0      0         1       0
1    1      1         1       0
\`\`\`

### Short-Circuit Evaluation
- **&&**: If the left operand is false (0), the right operand is NOT evaluated
- **||**: If the left operand is true (non-zero), the right operand is NOT evaluated

This is important for safety:
\`\`\`c
// Safe: ptr is checked before dereferencing
if (ptr != NULL && ptr->value > 10) { ... }

// If ptr is NULL, ptr->value is never evaluated (no crash!)
\`\`\`

### C's Boolean Rules
- In C, **0** is false; any **non-zero value** is true
- There is no native \`bool\` type in C89 — use \`<stdbool.h>\` (C99) or define your own
- Relational and logical operators always return 0 or 1`,
      codeExamples: [
        {
          title: 'Relational and logical operators in practice',
          code: `#include <stdio.h>
#include <stdbool.h>

int main() {
    int temperature = 75;
    int humidity = 80;
    bool sensor_active = true;

    printf("Temperature: %d°C\\n", temperature);
    printf("Humidity: %d%%\\n", humidity);
    printf("Sensor active: %s\\n\\n", sensor_active ? "YES" : "NO");

    // Relational operators
    printf("=== Relational ===\\n");
    printf("temp > 50:  %d\\n", temperature > 50);
    printf("temp == 75: %d\\n", temperature == 75);
    printf("temp != 80: %d\\n", temperature != 80);

    // Logical operators
    printf("\\n=== Logical ===\\n");
    printf("temp > 50 AND humidity > 70:  %d\\n",
           temperature > 50 && humidity > 70);
    printf("temp > 90 OR humidity > 70:   %d\\n",
           temperature > 90 || humidity > 70);
    printf("NOT sensor_active:            %d\\n",
           !sensor_active);

    // Combined condition — alarm logic
    bool alarm = sensor_active && (temperature > 85 || humidity > 90);
    printf("\\nAlarm triggered: %s\\n", alarm ? "YES" : "NO");

    // Short-circuit demonstration
    printf("\\n=== Short-Circuit ===\\n");
    int *ptr = NULL;
    // This is SAFE due to short-circuit evaluation:
    if (ptr != NULL && *ptr > 10) {
        printf("Value is greater than 10\\n");
    } else {
        printf("Pointer is NULL — second condition was NOT evaluated\\n");
    }

    return 0;
}`,
          output:
            'Temperature: 75°C\nHumidity: 80%\nSensor active: YES\n\n=== Relational ===\ntemp > 50:  1\ntemp == 75: 1\ntemp != 80: 1\n\n=== Logical ===\ntemp > 50 AND humidity > 70:  1\ntemp > 90 OR humidity > 70:   1\nNOT sensor_active:            0\n\nAlarm triggered: NO\n\n=== Short-Circuit ===\nPointer is NULL — second condition was NOT evaluated'
        }
      ],
      keyPoints: [
        'Relational operators return 0 (false) or 1 (true)',
        'In C, any non-zero value is considered true; only 0 is false',
        '&& (AND) and || (OR) use short-circuit evaluation — the right operand may not be evaluated',
        'Short-circuit evaluation is used for safe pointer dereferencing: if (ptr && ptr->value)',
        'Common bug: using = (assignment) instead of == (comparison) in conditions'
      ],
      commonMistakes: [
        'Writing if (x = 5) instead of if (x == 5) — the first is an assignment that always evaluates to true (non-zero)',
        'Comparing floating-point numbers with == — use tolerance: fabs(a - b) < EPSILON',
        'Not understanding short-circuit: in (f() && g()), if f() returns 0, g() is never called'
      ],
      interviewQuestions: [
        {
          question: 'What is short-circuit evaluation? Give a practical example.',
          answer:
            'Short-circuit evaluation means the second operand of && or || is not evaluated if the result is already determined by the first operand. For && (AND): if the first operand is false, the result is false regardless, so the second operand is skipped. For || (OR): if the first operand is true, the result is true. Practical use: if (index < size && array[index] > 0) — if index is out of bounds, the array access is skipped, preventing a buffer overflow.'
        }
      ]
    },
    {
      id: 'lesson-04-03',
      title: 'Bitwise Operators — The Heart of Embedded C',
      content: `## Why Bitwise Operators Matter in Embedded Systems

In embedded programming, you constantly need to:
- Set, clear, or toggle individual bits in hardware registers
- Extract specific fields from sensor data
- Create bitmasks for configuration
- Implement communication protocols that pack data at the bit level

Bitwise operators work on **individual bits** of integer values.

## The Bitwise Operators

| Operator | Name | Description | Example |
|----------|------|-------------|---------|
| \`&\` | AND | Both bits must be 1 | \`0b1010 & 0b1100 = 0b1000\` |
| \`\\|\` | OR | Either bit can be 1 | \`0b1010 \\| 0b1100 = 0b1110\` |
| \`^\` | XOR | Bits must differ | \`0b1010 ^ 0b1100 = 0b0110\` |
| \`~\` | NOT | Invert all bits | \`~0b1010 = 0b0101\` (for 4-bit) |
| \`<<\` | Left shift | Shift bits left | \`0b0001 << 3 = 0b1000\` |
| \`>>\` | Right shift | Shift bits right | \`0b1000 >> 2 = 0b0010\` |

## Truth Tables
\`\`\`
 A  B  │ A & B │ A | B │ A ^ B │ ~A
 0  0  │   0   │   0   │   0   │  1
 0  1  │   0   │   1   │   1   │  1
 1  0  │   0   │   1   │   1   │  0
 1  1  │   1   │   1   │   0   │  0
\`\`\`

## Essential Bit Manipulation Patterns

### 1. SET a bit (turn ON)
\`\`\`c
register |= (1 << bit_position);
// Example: Set bit 5
// PORTB |= (1 << 5);   // 0010 0000
\`\`\`

### 2. CLEAR a bit (turn OFF)
\`\`\`c
register &= ~(1 << bit_position);
// Example: Clear bit 3
// PORTB &= ~(1 << 3);  // AND with 1111 0111
\`\`\`

### 3. TOGGLE a bit (flip)
\`\`\`c
register ^= (1 << bit_position);
// Example: Toggle bit 5
// PORTB ^= (1 << 5);   // XOR with 0010 0000
\`\`\`

### 4. CHECK a bit (read)
\`\`\`c
if (register & (1 << bit_position)) {
    // Bit is SET (1)
}
// Example: Check if bit 2 is set
// if (PINB & (1 << 2)) { ... }
\`\`\`

### 5. SET multiple bits
\`\`\`c
register |= (1 << 5) | (1 << 3) | (1 << 1);
// Sets bits 5, 3, and 1 simultaneously
\`\`\`

### 6. CLEAR multiple bits
\`\`\`c
register &= ~((1 << 5) | (1 << 3));
// Clears bits 5 and 3
\`\`\`

### 7. EXTRACT a bit field
\`\`\`c
// Extract bits [7:4] from a byte
uint8_t upper_nibble = (byte >> 4) & 0x0F;
\`\`\`

### 8. INSERT a value into a bit field
\`\`\`c
// Insert value into bits [7:4], keep bits [3:0] unchanged
register = (register & 0x0F) | (value << 4);
\`\`\``,
      codeExamples: [
        {
          title: 'All bitwise operations demonstrated',
          code: `#include <stdio.h>
#include <stdint.h>

void print_binary(uint8_t byte) {
    for (int i = 7; i >= 0; i--) {
        printf("%d", (byte >> i) & 1);
        if (i == 4) printf("_");
    }
}

int main() {
    uint8_t a = 0b10101010;  // 0xAA = 170
    uint8_t b = 0b11001100;  // 0xCC = 204

    printf("a     = "); print_binary(a); printf(" (0x%02X)\\n", a);
    printf("b     = "); print_binary(b); printf(" (0x%02X)\\n", b);

    printf("\\n--- Bitwise Operations ---\\n");
    printf("a & b = "); print_binary(a & b); printf(" (AND)\\n");
    printf("a | b = "); print_binary(a | b); printf(" (OR)\\n");
    printf("a ^ b = "); print_binary(a ^ b); printf(" (XOR)\\n");
    printf("~a    = "); print_binary(~a);    printf(" (NOT)\\n");

    printf("\\n--- Shift Operations ---\\n");
    uint8_t val = 0b00000001;
    printf("1 << 0 = "); print_binary(val << 0); printf("\\n");
    printf("1 << 1 = "); print_binary(val << 1); printf("\\n");
    printf("1 << 4 = "); print_binary(val << 4); printf("\\n");
    printf("1 << 7 = "); print_binary(val << 7); printf("\\n");

    uint8_t big = 0b10000000;
    printf("\\n0x80 >> 1 = "); print_binary(big >> 1); printf("\\n");
    printf("0x80 >> 4 = "); print_binary(big >> 4); printf("\\n");

    return 0;
}`,
          output:
            'a     = 1010_1010 (0xAA)\nb     = 1100_1100 (0xCC)\n\n--- Bitwise Operations ---\na & b = 1000_1000 (AND)\na | b = 1110_1110 (OR)\na ^ b = 0110_0110 (XOR)\n~a    = 0101_0101 (NOT)\n\n--- Shift Operations ---\n1 << 0 = 0000_0001\n1 << 1 = 0000_0010\n1 << 4 = 0001_0000\n1 << 7 = 1000_0000\n\n0x80 >> 1 = 0100_0000\n0x80 >> 4 = 0000_1000'
        },
        {
          title: 'Embedded register manipulation',
          code: `#include <stdio.h>
#include <stdint.h>

// Simulating a GPIO register
uint8_t GPIO_PORT = 0x00;  // All pins OFF initially

void print_port(uint8_t port) {
    printf("GPIO_PORT: ");
    for (int i = 7; i >= 0; i--) {
        printf("P%d=%d ", i, (port >> i) & 1);
    }
    printf(" [0x%02X]\\n", port);
}

int main() {
    printf("--- GPIO Register Manipulation ---\\n\\n");

    // 1. SET bit 5 (turn on LED on pin 5)
    GPIO_PORT |= (1 << 5);
    printf("SET pin 5 (LED ON):\\n");
    print_port(GPIO_PORT);

    // 2. SET bits 0 and 3
    GPIO_PORT |= (1 << 0) | (1 << 3);
    printf("\\nSET pins 0 and 3:\\n");
    print_port(GPIO_PORT);

    // 3. CLEAR bit 0
    GPIO_PORT &= ~(1 << 0);
    printf("\\nCLEAR pin 0:\\n");
    print_port(GPIO_PORT);

    // 4. TOGGLE bit 5 (toggle LED)
    GPIO_PORT ^= (1 << 5);
    printf("\\nTOGGLE pin 5 (LED OFF):\\n");
    print_port(GPIO_PORT);

    // 5. CHECK if bit 3 is set
    if (GPIO_PORT & (1 << 3)) {
        printf("\\nPin 3 is HIGH (button pressed)\\n");
    }

    // 6. Extract lower nibble (bits 3:0)
    uint8_t lower = GPIO_PORT & 0x0F;
    printf("\\nLower nibble: 0x%01X\\n", lower);

    return 0;
}`,
          output:
            '--- GPIO Register Manipulation ---\n\nSET pin 5 (LED ON):\nGPIO_PORT: P7=0 P6=0 P5=1 P4=0 P3=0 P2=0 P1=0 P0=0  [0x20]\n\nSET pins 0 and 3:\nGPIO_PORT: P7=0 P6=0 P5=1 P4=0 P3=1 P2=0 P1=0 P0=1  [0x29]\n\nCLEAR pin 0:\nGPIO_PORT: P7=0 P6=0 P5=1 P4=0 P3=1 P2=0 P1=0 P0=0  [0x28]\n\nTOGGLE pin 5 (LED OFF):\nGPIO_PORT: P7=0 P6=0 P5=0 P4=0 P3=1 P2=0 P1=0 P0=0  [0x08]\n\nPin 3 is HIGH (button pressed)\n\nLower nibble: 0x8'
        }
      ],
      keyPoints: [
        'SET a bit: reg |= (1 << n)',
        'CLEAR a bit: reg &= ~(1 << n)',
        'TOGGLE a bit: reg ^= (1 << n)',
        'CHECK a bit: if (reg & (1 << n))',
        'Left shift (<<) multiplies by 2^n; right shift (>>) divides by 2^n',
        'Bitwise operators work on individual bits; logical operators (&&, ||) work on truth values'
      ],
      commonMistakes: [
        'Confusing & (bitwise AND) with && (logical AND) — completely different operations',
        'Confusing | (bitwise OR) with || (logical OR)',
        'Using signed integers with bitwise shifts — right shift of negative numbers is implementation-defined',
        'Shifting by more than the bit width — undefined behavior (e.g., 1 << 32 for 32-bit int)'
      ],
      interviewQuestions: [
        {
          question: 'How do you set, clear, and toggle a specific bit in a register?',
          answer:
            'SET bit n: register |= (1 << n) — OR with a mask that has only bit n set. CLEAR bit n: register &= ~(1 << n) — AND with a mask that has only bit n cleared. TOGGLE bit n: register ^= (1 << n) — XOR with a mask that has only bit n set. These are the most fundamental operations in embedded register manipulation.'
        },
        {
          question: 'What is the difference between & and &&?',
          answer:
            '& is the bitwise AND operator — it compares corresponding bits of two integers (e.g., 0b1010 & 0b1100 = 0b1000). && is the logical AND operator — it evaluates two conditions and returns true (1) or false (0), with short-circuit behavior. Using & when you mean && is a common bug: (a & b) may not behave like (a && b) when a and b are not 0 or 1.'
        }
      ]
    },
    {
      id: 'lesson-04-04',
      title: 'Advanced Bitwise: Bitmasks, Bit Fields, and Real-World Patterns',
      content: `## Advanced Bitwise Techniques for Embedded Systems

### Bitmask Macros
Professional embedded code uses macros for readable register manipulation:

\`\`\`c
// Define bit positions
#define BIT(n)           (1U << (n))
#define SET_BIT(reg, n)  ((reg) |= BIT(n))
#define CLR_BIT(reg, n)  ((reg) &= ~BIT(n))
#define TGL_BIT(reg, n)  ((reg) ^= BIT(n))
#define GET_BIT(reg, n)  (((reg) >> (n)) & 1U)
\`\`\`

### Multi-Bit Field Operations
Many hardware registers pack multiple fields into a single register:

\`\`\`
Example: UART Configuration Register (8 bits)
┌─────┬───────┬──────┬──────┐
│ Bit7│ Bit6:5│ Bit4 │Bit3:0│
│ EN  │ PARITY│ STOP │ BAUD │
│     │ 00=N  │ 0=1  │ rate │
│     │ 01=E  │ 1=2  │ div. │
│     │ 10=O  │      │      │
└─────┴───────┴──────┴──────┘
\`\`\`

### Common Bit Tricks

1. **Check if a number is a power of 2**:
\`\`\`c
bool is_power_of_2 = (n > 0) && ((n & (n - 1)) == 0);
\`\`\`

2. **Count set bits (population count)**:
\`\`\`c
int count = 0;
while (n) { count++; n &= (n - 1); }  // Brian Kernighan's algorithm
\`\`\`

3. **Swap two variables without temp**:
\`\`\`c
a ^= b;  b ^= a;  a ^= b;
\`\`\`

4. **Check if number is even or odd**:
\`\`\`c
if (n & 1)  // Odd
else        // Even
\`\`\`

5. **Align to boundary** (e.g., align to 4 bytes):
\`\`\`c
aligned = (addr + 3) & ~3;  // Round up to next 4-byte boundary
\`\`\`

6. **Create a mask for N bits**:
\`\`\`c
uint32_t mask = (1U << n) - 1;  // Mask of n ones: (1<<4)-1 = 0b1111
\`\`\`

### Bit Fields in Structs (Use with Caution)
C supports bit-level struct members, but they are **not portable** between compilers and architectures:

\`\`\`c
struct UartConfig {
    uint8_t baud_rate : 4;  // 4 bits
    uint8_t stop_bits : 1;  // 1 bit
    uint8_t parity    : 2;  // 2 bits
    uint8_t enable    : 1;  // 1 bit
};
\`\`\`

**Warning**: Bit field layout (order, packing) is implementation-defined. For portable embedded code, use manual bitmask operations instead of struct bit fields.`,
      codeExamples: [
        {
          title: 'Real-world UART register configuration',
          code: `#include <stdio.h>
#include <stdint.h>

// UART config register bit definitions
#define UART_BAUD_MASK  0x0F    // Bits [3:0]
#define UART_STOP_BIT   4       // Bit 4
#define UART_PARITY_POS 5       // Bits [6:5]
#define UART_PARITY_MASK (0x03 << UART_PARITY_POS)
#define UART_ENABLE_BIT 7       // Bit 7

// Parity values
#define PARITY_NONE   0
#define PARITY_EVEN   1
#define PARITY_ODD    2

// Baud rate divisor values
#define BAUD_9600     0x0D
#define BAUD_115200   0x01

void print_config(uint8_t reg) {
    printf("  Raw: 0x%02X (", reg);
    for (int i = 7; i >= 0; i--) printf("%d", (reg >> i) & 1);
    printf(")\\n");
    printf("  Enable: %s\\n", (reg >> UART_ENABLE_BIT) & 1 ? "YES" : "NO");
    printf("  Parity: %d\\n", (reg >> UART_PARITY_POS) & 0x03);
    printf("  Stop bits: %d\\n", ((reg >> UART_STOP_BIT) & 1) + 1);
    printf("  Baud div: %d\\n", reg & UART_BAUD_MASK);
}

int main() {
    uint8_t uart_config = 0x00;
    printf("=== UART Register Configuration ===\\n\\n");

    // Step 1: Set baud rate divisor to 9600
    uart_config = (uart_config & ~UART_BAUD_MASK) | (BAUD_9600 & UART_BAUD_MASK);
    printf("After setting baud rate:\\n");
    print_config(uart_config);

    // Step 2: Set parity to EVEN (01 in bits [6:5])
    uart_config = (uart_config & ~UART_PARITY_MASK) | (PARITY_EVEN << UART_PARITY_POS);
    printf("\\nAfter setting even parity:\\n");
    print_config(uart_config);

    // Step 3: Set 2 stop bits
    uart_config |= (1 << UART_STOP_BIT);
    printf("\\nAfter setting 2 stop bits:\\n");
    print_config(uart_config);

    // Step 4: Enable UART
    uart_config |= (1 << UART_ENABLE_BIT);
    printf("\\nAfter enabling UART:\\n");
    print_config(uart_config);

    return 0;
}`,
          output:
            '=== UART Register Configuration ===\n\nAfter setting baud rate:\n  Raw: 0x0D (00001101)\n  Enable: NO\n  Parity: 0\n  Stop bits: 1\n  Baud div: 13\n\nAfter setting even parity:\n  Raw: 0x2D (00101101)\n  Enable: NO\n  Parity: 1\n  Stop bits: 1\n  Baud div: 13\n\nAfter setting 2 stop bits:\n  Raw: 0x3D (00111101)\n  Enable: NO\n  Parity: 1\n  Stop bits: 2\n  Baud div: 13\n\nAfter enabling UART:\n  Raw: 0xBD (10111101)\n  Enable: YES\n  Parity: 1\n  Stop bits: 2\n  Baud div: 13'
        },
        {
          title: 'Bit tricks and algorithms',
          code: `#include <stdio.h>
#include <stdint.h>

// Check if power of 2
int is_power_of_2(unsigned int n) {
    return (n > 0) && ((n & (n - 1)) == 0);
}

// Count set bits (Kernighan's algorithm)
int count_set_bits(unsigned int n) {
    int count = 0;
    while (n) {
        n &= (n - 1);  // Clear lowest set bit
        count++;
    }
    return count;
}

// Swap without temporary variable
void swap_xor(int *a, int *b) {
    if (a != b) {  // Important: fails if a and b point to same location
        *a ^= *b;
        *b ^= *a;
        *a ^= *b;
    }
}

int main() {
    printf("=== Power of 2 Check ===\\n");
    int values[] = {0, 1, 2, 3, 4, 16, 255, 256};
    for (int i = 0; i < 8; i++) {
        printf("  %3d: %s\\n", values[i],
               is_power_of_2(values[i]) ? "YES" : "NO");
    }

    printf("\\n=== Count Set Bits ===\\n");
    uint8_t test_vals[] = {0, 1, 7, 0xFF, 0xAA};
    for (int i = 0; i < 5; i++) {
        printf("  0x%02X: %d bits set\\n", test_vals[i],
               count_set_bits(test_vals[i]));
    }

    printf("\\n=== XOR Swap ===\\n");
    int a = 42, b = 99;
    printf("  Before: a=%d, b=%d\\n", a, b);
    swap_xor(&a, &b);
    printf("  After:  a=%d, b=%d\\n", a, b);

    printf("\\n=== Even/Odd Check ===\\n");
    for (int i = 0; i < 6; i++) {
        printf("  %d is %s\\n", i, (i & 1) ? "ODD" : "EVEN");
    }

    return 0;
}`,
          output:
            '=== Power of 2 Check ===\n    0: NO\n    1: YES\n    2: YES\n    3: NO\n    4: YES\n   16: YES\n  255: NO\n  256: YES\n\n=== Count Set Bits ===\n  0x00: 0 bits set\n  0x01: 1 bits set\n  0x07: 3 bits set\n  0xFF: 8 bits set\n  0xAA: 4 bits set\n\n=== XOR Swap ===\n  Before: a=42, b=99\n  After:  a=99, b=42\n\n=== Even/Odd Check ===\n  0 is EVEN\n  1 is ODD\n  2 is EVEN\n  3 is ODD\n  4 is EVEN\n  5 is ODD'
        }
      ],
      keyPoints: [
        'Use macros like BIT(n), SET_BIT, CLR_BIT for readable register code',
        'Multi-bit fields: clear with mask AND, then set with OR',
        'n & (n-1) clears the lowest set bit — used for power-of-2 check and bit counting',
        'XOR swap works but avoid it when both pointers are the same address',
        'Struct bit fields are not portable — prefer manual bitmask operations for hardware registers'
      ],
      commonMistakes: [
        'Using signed int with bitmask operations — always use unsigned (uint8_t, uint32_t)',
        'Forgetting to clear a field before setting it — old bits remain, causing wrong values',
        'Relying on struct bit field layout — the order is implementation-defined and varies between compilers'
      ],
      interviewQuestions: [
        {
          question: 'How do you check if a number is a power of 2 using bitwise operators?',
          answer:
            'Use: (n > 0) && ((n & (n - 1)) == 0). Explanation: A power of 2 has exactly one bit set (e.g., 8 = 0b1000). (n - 1) flips that bit and sets all lower bits (7 = 0b0111). ANDing them gives 0. For non-powers of 2, the AND result is non-zero. The n > 0 check excludes zero, which is not a power of 2.'
        },
        {
          question: 'Write code to extract bits [7:4] from an 8-bit register.',
          answer:
            'uint8_t upper_nibble = (register >> 4) & 0x0F; First, right-shift by 4 to move bits [7:4] into positions [3:0]. Then AND with 0x0F (0000 1111) to mask out any bits above position 3. This gives you the value of the upper nibble. Example: If register = 0xAB, (0xAB >> 4) & 0x0F = 0x0A = 10.'
        }
      ]
    },
    {
      id: 'lesson-04-05',
      title: 'Conditional (Ternary) Operator and Operator Precedence',
      content: `## Conditional (Ternary) Operator

The ternary operator is a shorthand for simple if-else:

\`\`\`c
result = (condition) ? value_if_true : value_if_false;
\`\`\`

It is the only C operator that takes **three operands**.

### When to Use
- Simple value selection: \`int max = (a > b) ? a : b;\`
- Inline output: \`printf("Status: %s", ok ? "PASS" : "FAIL");\`
- Macro definitions: \`#define ABS(x) ((x) >= 0 ? (x) : -(x))\`

### When NOT to Use
- Complex logic with multiple statements — use if-else for readability
- Nested ternary — becomes unreadable quickly

## Operator Precedence (Priority)

When an expression has multiple operators, precedence determines the order of evaluation.

| Priority | Operators | Associativity |
|----------|-----------|---------------|
| 1 (highest) | \`()\` \`[]\` \`.\` \`->\` | Left to right |
| 2 | \`!\` \`~\` \`++\` \`--\` \`+\` \`-\` (unary) \`*\` \`&\` (unary) \`sizeof\` \`(type)\` | Right to left |
| 3 | \`*\` \`/\` \`%\` | Left to right |
| 4 | \`+\` \`-\` | Left to right |
| 5 | \`<<\` \`>>\` | Left to right |
| 6 | \`<\` \`<=\` \`>\` \`>=\` | Left to right |
| 7 | \`==\` \`!=\` | Left to right |
| 8 | \`&\` (bitwise AND) | Left to right |
| 9 | \`^\` (bitwise XOR) | Left to right |
| 10 | \`\\|\` (bitwise OR) | Left to right |
| 11 | \`&&\` (logical AND) | Left to right |
| 12 | \`\\|\\|\` (logical OR) | Left to right |
| 13 | \`? :\` (ternary) | Right to left |
| 14 | \`=\` \`+=\` \`-=\` etc. | Right to left |
| 15 (lowest) | \`,\` (comma) | Left to right |

### Critical Precedence Trap
\`\`\`c
// WRONG: & has lower precedence than ==
if (reg & 0x04 == 0x04) { ... }
// Parsed as: if (reg & (0x04 == 0x04)) → if (reg & 1)  ← WRONG!

// CORRECT: Use parentheses
if ((reg & 0x04) == 0x04) { ... }
\`\`\`

**Rule of thumb: When in doubt, use parentheses!** Explicit parentheses improve readability and prevent precedence bugs.`,
      codeExamples: [
        {
          title: 'Ternary operator and precedence examples',
          code: `#include <stdio.h>
#include <stdint.h>

// Using ternary in macros
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define ABS(x)    ((x) >= 0 ? (x) : -(x))
#define CLAMP(val, lo, hi) (MAX(lo, MIN(val, hi)))

int main() {
    // Ternary operator
    int temperature = 85;
    const char *status = (temperature > 80) ? "CRITICAL" : "NORMAL";
    printf("Temp: %d°C → %s\\n\\n", temperature, status);

    // Ternary in loop
    printf("Numbers 1-10 (even/odd):\\n");
    for (int i = 1; i <= 10; i++) {
        printf("  %2d is %s\\n", i, (i & 1) ? "odd " : "even");
    }

    // Macro functions
    printf("\\nMAX(15, 22) = %d\\n", MAX(15, 22));
    printf("MIN(15, 22) = %d\\n", MIN(15, 22));
    printf("ABS(-42) = %d\\n", ABS(-42));
    printf("CLAMP(150, 0, 100) = %d\\n", CLAMP(150, 0, 100));

    // === Precedence Traps ===
    printf("\\n=== Precedence Traps ===\\n");
    uint8_t reg = 0x07;  // 0000 0111

    // WRONG: == has higher precedence than &
    // if (reg & 0x04 == 0x04)  → if (reg & 1) → TRUE for wrong reason
    printf("WRONG:   reg & 0x04 == 0x04 → %d\\n", reg & 0x04 == 0x04);
    printf("CORRECT: (reg & 0x04) == 0x04 → %d\\n", (reg & 0x04) == 0x04);

    // Shift and addition
    int x = 2 + 3 << 1;       // (2 + 3) << 1 = 10? NO! 2 + (3 << 1) = 8? 
    int y = (2 + 3) << 1;     // Explicit: 5 << 1 = 10
    printf("\\n2 + 3 << 1   = %d (+ before <<)\\n", x);
    printf("(2 + 3) << 1 = %d (explicit)\\n", y);

    return 0;
}`,
          output:
            'Temp: 85°C → CRITICAL\n\nNumbers 1-10 (even/odd):\n   1 is odd\n   2 is even\n   3 is odd\n   4 is even\n   5 is odd\n   6 is even\n   7 is odd\n   8 is even\n   9 is odd\n  10 is even\n\nMAX(15, 22) = 22\nMIN(15, 22) = 15\nABS(-42) = 42\nCLAMP(150, 0, 100) = 100\n\n=== Precedence Traps ===\nWRONG:   reg & 0x04 == 0x04 → 1\nCORRECT: (reg & 0x04) == 0x04 → 1\n\n2 + 3 << 1   = 10 (+ before <<)\n(2 + 3) << 1 = 10 (explicit)'
        }
      ],
      keyPoints: [
        'Ternary operator: result = condition ? true_val : false_val',
        'Use ternary for simple value selections; use if-else for complex logic',
        'Bitwise & has LOWER precedence than == — always use parentheses: (reg & mask) == value',
        'Arithmetic (+,-) has HIGHER precedence than shift (<<,>>)',
        'When in doubt, add parentheses — readability and correctness over cleverness'
      ],
      commonMistakes: [
        'Writing if (reg & FLAG == FLAG) instead of if ((reg & FLAG) == FLAG) — precedence trap',
        'Nesting ternary operators: a ? b ? c : d : e — extremely unreadable, use if-else instead',
        'Assuming left-to-right evaluation of function arguments — evaluation order is unspecified in C'
      ],
      interviewQuestions: [
        {
          question: 'What is the output of: printf("%d", 2 + 3 << 1); and why?',
          answer:
            'The output is 10. Despite << looking like it should bind tighter, + has higher precedence than <<. So it is parsed as (2 + 3) << 1 = 5 << 1 = 10. This is a common interview trick. In practice, always use explicit parentheses to avoid ambiguity: (2 + 3) << 1 makes the intent clear.'
        },
        {
          question: 'Why is the expression (reg & 0x04 == 0x04) a bug?',
          answer:
            'Because == has higher precedence than &. The expression is parsed as reg & (0x04 == 0x04), which becomes reg & 1 — this checks bit 0, not bit 2! The correct expression is (reg & 0x04) == 0x04, which first masks bit 2 and then compares. This is one of the most common embedded C bugs and is caught by the -Wparentheses GCC warning.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-04-01',
        type: 'mcq',
        question: 'What is the result of 0b1010 & 0b1100?',
        options: ['0b1110', '0b1000', '0b0110', '0b0010'],
        correct: 1,
        explanation:
          'Bitwise AND: each bit is 1 only if both corresponding bits are 1. 1&1=1, 0&1=0, 1&0=0, 0&0=0. So 1010 & 1100 = 1000.',
        difficulty: 'beginner'
      },
      {
        id: 'q-04-02',
        type: 'mcq',
        question: 'How do you set bit 3 of a register without affecting other bits?',
        options: [
          'reg = (1 << 3)',
          'reg &= (1 << 3)',
          'reg |= (1 << 3)',
          'reg ^= (1 << 3)'
        ],
        correct: 2,
        explanation:
          'To SET a bit: use OR with a mask. reg |= (1 << 3) sets bit 3 to 1 while preserving all other bits. reg = (1 << 3) would overwrite the entire register. reg &= clears other bits. reg ^= toggles.',
        difficulty: 'beginner'
      },
      {
        id: 'q-04-03',
        type: 'mcq',
        question: 'How do you clear bit 5 of a register?',
        options: [
          'reg |= (1 << 5)',
          'reg &= (1 << 5)',
          'reg &= ~(1 << 5)',
          'reg ^= (1 << 5)'
        ],
        correct: 2,
        explanation:
          'To CLEAR a bit: AND with the complement of the mask. ~(1 << 5) creates 1101 1111, which when ANDed with the register clears bit 5 while preserving all others.',
        difficulty: 'beginner'
      },
      {
        id: 'q-04-04',
        type: 'mcq',
        question: 'What is the value of 1 << 4?',
        options: ['4', '8', '16', '32'],
        correct: 2,
        explanation:
          '1 << 4 shifts the binary 1 left by 4 positions: 0000 0001 → 0001 0000 = 16. In general, 1 << n = 2^n. So 1 << 4 = 2^4 = 16.',
        difficulty: 'beginner'
      },
      {
        id: 'q-04-05',
        type: 'mcq',
        question: 'What does the expression (n & (n - 1)) == 0 check (for n > 0)?',
        options: [
          'Whether n is even',
          'Whether n is odd',
          'Whether n is a power of 2',
          'Whether n is negative'
        ],
        correct: 2,
        explanation:
          'A power of 2 has exactly one bit set (e.g., 8 = 1000). (n-1) flips that bit and sets all lower bits (7 = 0111). ANDing gives 0. For non-powers of 2, the result is non-zero. Example: n=6 (110), n-1=5 (101), 110 & 101 = 100 ≠ 0.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-04-06',
        type: 'mcq',
        question:
          'What is the result of: int x = 7; printf("%d", x % 3);',
        options: ['2', '1', '3', '0'],
        correct: 1,
        explanation:
          '7 % 3 = 1. The modulus operator gives the remainder of integer division. 7 / 3 = 2 with remainder 1. Verify: 2 × 3 + 1 = 7. ✓',
        difficulty: 'beginner'
      },
      {
        id: 'q-04-07',
        type: 'mcq',
        question:
          'What is the output of: int x = 5; printf("%d %d", x++, ++x);',
        options: ['5 7', '6 7', 'Undefined behavior', '5 6'],
        correct: 2,
        explanation:
          'The order of evaluation of function arguments is unspecified in C. Using ++ on the same variable in a single expression with multiple uses is undefined behavior. Different compilers may give different results. Never write code like this.',
        difficulty: 'advanced'
      },
      {
        id: 'q-04-08',
        type: 'mcq',
        question:
          'Which operator has higher precedence: & (bitwise AND) or == (equality)?',
        options: [
          '& has higher precedence',
          '== has higher precedence',
          'They have equal precedence',
          'Depends on the compiler'
        ],
        correct: 1,
        explanation:
          '== has higher precedence than &. This means reg & 0x04 == 0x04 is parsed as reg & (0x04 == 0x04) = reg & 1, which is a bug. Always use parentheses: (reg & 0x04) == 0x04.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-04-09',
        type: 'mcq',
        question:
          'What is the result of ~0x0F for an 8-bit unsigned value?',
        options: ['0x0F', '0xF0', '0x00', '0xFF'],
        correct: 1,
        explanation:
          '~(NOT) inverts all bits. 0x0F = 0000 1111. ~0x0F = 1111 0000 = 0xF0. For an 8-bit value, the result is 0xF0 (240). Note: in C, the result is computed as int first, so you may need to cast to uint8_t.',
        difficulty: 'beginner'
      },
      {
        id: 'q-04-10',
        type: 'mcq',
        question:
          'To extract bits [7:4] from an 8-bit value, you use:',
        options: [
          'value & 0xF0',
          '(value >> 4) & 0x0F',
          'value << 4',
          'value | 0x0F'
        ],
        correct: 1,
        explanation:
          'To extract bits [7:4]: first right-shift by 4 to move them into positions [3:0], then AND with 0x0F to mask out any upper bits. Example: 0xAB >> 4 = 0x0A, then & 0x0F = 0x0A. Option A (value & 0xF0) keeps the bits in positions [7:4] without shifting them down.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-04-11',
        type: 'mcq',
        question:
          'What does the XOR operator (^) do when applied to the same value? a ^ a = ?',
        options: ['a', '0', '~a', '2a'],
        correct: 1,
        explanation:
          'XOR of any value with itself is always 0. This is because XOR returns 1 only when bits differ. When comparing identical bits, every pair is the same, so all result bits are 0. This property is used in the XOR swap algorithm and to zero out a register efficiently.',
        difficulty: 'beginner'
      },
      {
        id: 'q-04-12',
        type: 'mcq',
        question:
          'In embedded C, why should you use unsigned types for bitmask operations?',
        options: [
          'Unsigned types are faster',
          'Signed right shift behavior is implementation-defined, and sign bit can cause issues',
          'Unsigned types use less memory',
          'It makes no difference'
        ],
        correct: 1,
        explanation:
          'For signed integers, right shift behavior is implementation-defined — it may perform arithmetic shift (preserving sign bit) or logical shift (filling with zeros). The ~ operator on a signed value can produce unexpected results due to sign extension. Using unsigned types (uint8_t, uint32_t) ensures predictable bit manipulation behavior.',
        difficulty: 'intermediate'
      }
    ]
  }
};
