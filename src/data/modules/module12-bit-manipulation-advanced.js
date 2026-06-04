export const module12 = {
  id: 'module-12',
  title: 'Advanced Bit Manipulation',
  description: 'Master bitwise operations, bitfields, masking, and macros to control hardware at the bit level and pack data efficiently.',
  icon: '🎛️',
  track: 'advanced-c',
  estimatedHours: 5,
  prerequisites: ['module-04'],
  lessons: [
    {
      id: 'lesson-12-1',
      title: 'Bitwise Masking and Shifting Review',
      content: 'In embedded systems, you rarely work with whole bytes when interacting with hardware; you work with individual bits. Masking involves using bitwise AND (`&`), OR (`|`), XOR (`^`), and NOT (`~`) alongside bit shifts (`<<`, `>>`) to read, set, clear, or toggle specific bits within a register without affecting the others.',
      codeExamples: [
        {
          title: 'Basic Bit Manipulation Macros',
          code: `#include <stdio.h>\n#include <stdint.h>\n\n#define SET_BIT(REG, BIT)     ((REG) |= (1U << (BIT)))\n#define CLEAR_BIT(REG, BIT)   ((REG) &= ~(1U << (BIT)))\n#define TOGGLE_BIT(REG, BIT)  ((REG) ^= (1U << (BIT)))\n#define READ_BIT(REG, BIT)    (((REG) >> (BIT)) & 1U)\n\nint main() {\n    uint8_t status = 0b00000000;\n    SET_BIT(status, 3);\n    printf("After Set: 0x%02X\\n", status);\n    TOGGLE_BIT(status, 3);\n    printf("After Toggle: 0x%02X\\n", status);\n    return 0;\n}`,
          output: `After Set: 0x08\nAfter Toggle: 0x00`
        }
      ],
      keyPoints: [
        'Masking protects bits you don\'t want to change.',
        'Always use unsigned integers (like `uint32_t`) for bitwise operations to avoid sign-extension bugs.',
        'Macros for SET, CLEAR, TOGGLE, and READ are standard practice in C embedded code.'
      ],
      commonMistakes: [
        'Using logical operators (`&&`, `||`) instead of bitwise operators (`&`, `|`).',
        'Forgetting the `~` when clearing a bit, e.g., using `REG &= (1 << BIT)` which clears *all* bits except the target bit.'
      ],
      interviewQuestions: [
        {
          question: 'How do you check if a specific bit (e.g., bit 5) is set in a variable?',
          answer: 'You shift the variable right by 5 and bitwise AND with 1: `if ((var >> 5) & 1)` OR bitwise AND the variable with 1 shifted left by 5: `if (var & (1 << 5))`.'
        }
      ]
    },
    {
      id: 'lesson-12-2',
      title: 'Modifying Multiple Bits (Bit Masking)',
      content: 'Often, you need to modify a multi-bit field within a register (e.g., setting a 3-bit prescaler value). To do this safely, you must first CLEAR the entire field, and then OR the new value into it. Doing this in one step prevents accidentally combining the old value with the new value.',
      codeExamples: [
        {
          title: 'Setting a Multi-Bit Field',
          code: `#include <stdio.h>\n#include <stdint.h>\n\n// Target: Set bits [4:6] to value 5 (101b)\nint main() {\n    uint32_t reg = 0xFFFFFFFF; // All bits set\n    uint32_t value = 5;\n    uint32_t mask = 0x7; // 3 bits wide (111b)\n    uint32_t shift = 4;  // Starting at bit 4\n\n    // 1. Clear the field: ~(mask << shift)\n    reg &= ~(mask << shift);\n    \n    // 2. Set the new value: (value << shift)\n    reg |= (value << shift);\n\n    printf("Result: 0x%08X\\n", reg);\n    return 0;\n}`,
          output: `Result: 0xFFFFFF5F`
        }
      ],
      keyPoints: [
        'Always clear a multi-bit field before setting it.',
        'Create masks representing the width of the field (e.g., `0x7` for 3 bits, `0xF` for 4 bits).',
        'Combine the clear and set into a single macro or inline function for safety and readability.'
      ],
      commonMistakes: [
        'OR-ing a new value into a field without clearing it first. If the field was `0b011` and you try to write `0b100`, the result without clearing will be `0b111`.'
      ],
      interviewQuestions: [
        {
          question: 'Write a C macro to update a specific bit-field in a register.',
          answer: '`#define UPDATE_FIELD(REG, MASK, SHIFT, VAL)  ((REG) = ((REG) & ~((MASK) << (SHIFT))) | (((VAL) & (MASK)) << (SHIFT)))`'
        }
      ]
    },
    {
      id: 'lesson-12-3',
      title: 'Bitfields in Structures',
      content: 'C allows you to specify the exact number of bits a structure member should occupy using bitfields. This looks incredibly useful for mapping hardware registers or packing data. However, in practice, bitfields are highly implementation-defined. The C standard does not guarantee how they are packed or aligned.',
      codeExamples: [
        {
          title: 'Defining a Bitfield',
          code: `#include <stdio.h>\n#include <stdint.h>\n\ntypedef struct {\n    uint8_t flag1 : 1;\n    uint8_t flag2 : 1;\n    uint8_t mode  : 3;\n    uint8_t       : 3; // Unnamed padding\n} StatusReg_t;\n\nint main() {\n    StatusReg_t reg = {0};\n    reg.mode = 5;\n    printf("Size: %zu bytes\\n", sizeof(StatusReg_t));\n    return 0;\n}`,
          output: `Size: 1 bytes`
        }
      ],
      keyPoints: [
        'Bitfields specify width in bits using `: n`.',
        'They can save memory by packing data tightly.',
        'Bit ordering (LSB first vs MSB first) within a bitfield is compiler-dependent.'
      ],
      commonMistakes: [
        'Relying on bitfields to map hardware registers across different compilers. Code working on GCC might fail on Keil or IAR due to different bit-packing rules.'
      ],
      interviewQuestions: [
        {
          question: 'Why do many embedded coding standards (like MISRA) restrict or discourage the use of bitfields?',
          answer: 'Because the layout of bitfields in memory is implementation-defined by the compiler. The order of bits and how they cross byte boundaries is not guaranteed, making them non-portable for hardware register access or network protocols.'
        }
      ]
    },
    {
      id: 'lesson-12-4',
      title: 'Packing Data for I2C/SPI Protocols',
      content: 'When transmitting data over serial protocols like SPI or I2C, you often need to combine variables of various sizes into an array of 8-bit bytes. Conversely, you must reconstruct the variables from the received byte array. This requires careful shifting and masking, always keeping Endianness in mind.',
      codeExamples: [
        {
          title: 'Serializing a 16-bit value',
          code: `#include <stdio.h>\n#include <stdint.h>\n\nint main() {\n    uint16_t sensor_val = 0x1234;\n    uint8_t tx_buffer[2];\n\n    // Serialize (Big-Endian format: MSB first)\n    tx_buffer[0] = (sensor_val >> 8) & 0xFF; // MSB\n    tx_buffer[1] = sensor_val & 0xFF;        // LSB\n\n    printf("TX: [0x%02X, 0x%02X]\\n", tx_buffer[0], tx_buffer[1]);\n\n    // Deserialize\n    uint16_t received = (tx_buffer[0] << 8) | tx_buffer[1];\n    printf("Received: 0x%04X\\n", received);\n\n    return 0;\n}`,
          output: `TX: [0x12, 0x34]\nReceived: 0x1234`
        }
      ],
      keyPoints: [
        'Never cast a struct pointer to a `uint8_t*` buffer to send it over a network or bus due to padding and endianness issues.',
        'Manually serialize data byte-by-byte using shifts and masks for maximum portability.',
        'Determine if the protocol expects Big-Endian (MSB first) or Little-Endian (LSB first).'
      ],
      commonMistakes: [
        'Transmitting a 32-bit float by simple pointer casting between devices with different architectures.',
        'Forgetting the `& 0xFF` when extracting the lower bytes (though technically optional if casting to uint8_t, it is good practice for clarity).'
      ],
      interviewQuestions: [
        {
          question: 'How do you swap the byte order (endianness) of a 32-bit integer?',
          answer: '`uint32_t swapped = ((val >> 24) & 0xff) | ((val << 8) & 0xff0000) | ((val >> 8) & 0xff00) | ((val << 24) & 0xff000000);`'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-12-1',
        type: 'mcq',
        question: 'Which operation clears bit 3 in a register variable `reg`?',
        options: ['reg &= (1 << 3)', 'reg &= ~(1 << 3)', 'reg |= ~(1 << 3)', 'reg ^= (1 << 3)'],
        correct: 1,
        explanation: '`(1 << 3)` creates a mask with bit 3 set. `~` inverts it (all 1s, bit 3 is 0). `&` clears bit 3 and leaves others unchanged.',
        difficulty: 'beginner'
      },
      {
        id: 'q-12-2',
        type: 'mcq',
        question: 'What is the purpose of the bitwise XOR (`^`) operator in hardware control?',
        options: ['To clear bits', 'To set bits', 'To toggle bits', 'To read bits'],
        correct: 2,
        explanation: 'XORing a bit with 1 flips (toggles) it. XORing with 0 leaves it unchanged.',
        difficulty: 'beginner'
      },
      {
        id: 'q-12-3',
        type: 'mcq',
        question: 'If you want to set bits 4, 5, and 6 of a register to 101 binary (5 decimal), what is the correct sequence?',
        options: ['Just OR it: reg |= (5 << 4)', 'Clear first, then OR: reg &= ~(7 << 4); reg |= (5 << 4)', 'Add it: reg += (5 << 4)', 'AND it: reg &= (5 << 4)'],
        correct: 1,
        explanation: 'You must first clear the 3-bit field (using mask 7, which is 111 binary) at the correct shift position, then OR the new value.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-12-4',
        type: 'mcq',
        question: 'Why are C bitfields often avoided in MISRA-C compliant firmware?',
        options: ['They are too slow', 'Memory layout is implementation-defined', 'They consume more RAM', 'They cannot be used with structs'],
        correct: 1,
        explanation: 'The standard does not mandate whether bits are packed LSB-to-MSB or MSB-to-LSB, making cross-compiler code unreliable.',
        difficulty: 'advanced'
      },
      {
        id: 'q-12-5',
        type: 'mcq',
        question: 'What does `val = (val >> 8) | (val << 8)` do for a 16-bit unsigned integer?',
        options: ['Clears the variable', 'Multiplies it by 256', 'Swaps the high and low bytes (Endian swap)', 'Creates an infinite loop'],
        correct: 2,
        explanation: 'It moves the upper 8 bits to the lower half, and the lower 8 bits to the upper half, effectively swapping endianness of a 16-bit value.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-12-6',
        type: 'mcq',
        question: 'When defining bit manipulation macros, why do we use `1U` instead of just `1`?',
        options: ['It saves memory', 'It indicates Unsigned to prevent sign-extension issues when shifting into the MSB', 'It stands for Unit', 'It is required by the C standard'],
        correct: 1,
        explanation: 'Shifting a signed integer `1` into the 31st bit can invoke undefined behavior or sign-extension. `1U` guarantees an unsigned operation.',
        difficulty: 'advanced'
      },
      {
        id: 'q-12-7',
        type: 'mcq',
        question: 'How do you extract the lower 4 bits (nibble) of a byte?',
        options: ['byte & 0x0F', 'byte >> 4', 'byte | 0x0F', 'byte & 0xF0'],
        correct: 0,
        explanation: 'ANDing with 0x0F (00001111) masks out the top 4 bits and keeps the bottom 4 bits.',
        difficulty: 'beginner'
      },
      {
        id: 'q-12-8',
        type: 'mcq',
        question: 'What is the value of `(1U << 5) | (1U << 1)`?',
        options: ['0x11', '0x22', '34 decimal (0x22)', '0x21'],
        correct: 2,
        explanation: '1<<5 is 32. 1<<1 is 2. 32 + 2 = 34. In Hex, 0x20 | 0x02 = 0x22.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-12-9',
        type: 'mcq',
        question: 'Which operator is used to perform 1\'s complement (invert all bits)?',
        options: ['!', '-', '~', '^'],
        correct: 2,
        explanation: 'The tilde `~` is the bitwise NOT operator, flipping all 0s to 1s and 1s to 0s.',
        difficulty: 'beginner'
      },
      {
        id: 'q-12-10',
        type: 'mcq',
        question: 'If `reg = 0b10101010`, what is the result of `reg ^ 0xFF`?',
        options: ['0b10101010', '0b00000000', '0b11111111', '0b01010101'],
        correct: 3,
        explanation: 'XORing with all 1s (0xFF) effectively inverts every bit in the variable.',
        difficulty: 'intermediate'
      }
    ]
  }
};

export default module12;
