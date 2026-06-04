export const module = {
  id: 'module-09',
  title: 'Strings & Character Arrays',
  description: 'Understand how C handles text. Unlike modern languages, C has no built-in String type. Master the null-terminator and safe string manipulation functions.',
  icon: '🔤',
  track: 'c-programming',
  estimatedHours: 3,
  prerequisites: ['module-08'],
  lessons: [
    {
      id: 'lesson-09-01',
      title: 'The Null-Terminated String',
      content: `## What is a String in C?

In languages like Python or Java, a string is a distinct, built-in object. **In C, there is no \`string\` type!** 

A string in C is simply an **array of \`char\`s** that ends with a special marker called the **Null Terminator**.

### The Null Terminator (\`\\0\`)
The null terminator is a character with the ASCII value of exactly \`0\`. It is represented in code as \`\\0\`. 
Because an array doesn't inherently know its own length, functions like \`printf()\` read the array character by character until they hit the \`\\0\`.

### Declaring and Initializing Strings
\`\`\`c
// Method 1: The tedious way (explicit array initialization)
char name1[5] = {'J', 'o', 'h', 'n', '\\0'};

// Method 2: The standard way (string literal)
char name2[5] = "John"; // The compiler adds '\\0' for you

// Method 3: Auto-sizing
char greeting[] = "Hello"; // Compiler makes it size 6!
\`\`\`

### Size vs Length
- **Size**: The physical memory allocated for the array (including the null terminator).
- **Length**: The number of visible characters (excluding the null terminator).

For \`char greeting[] = "Hello";\`:
- Length is 5.
- Size in memory is 6 bytes (\`'H', 'e', 'l', 'l', 'o', '\\0'\`).

**CRITICAL RULE:** When declaring a string buffer, ALWAYS make it at least one byte larger than the maximum text you plan to store to leave room for the null terminator.
`,
      codeExamples: [
        {
          title: 'Missing the null terminator',
          code: `#include <stdio.h>

int main() {
    // We intentionally make the array too small for the null terminator
    char bad_string[4] = {'J', 'o', 'h', 'n'}; 
    
    // printf will print John, and then keep printing whatever garbage 
    // happens to be in memory until it accidentally finds a 0 byte!
    printf("Bad string: %s\\n", bad_string);
    
    // Correct way:
    char good_string[5] = "John";
    printf("Good string: %s\\n", good_string);
    
    return 0;
}`,
          output: "Bad string: John\u0001\u001f\nGood string: John"
        }
      ],
      keyPoints: [
        'C has no native string type; it uses arrays of chars.',
        'All strings in C MUST end with a null terminator (`\\0`).',
        'String functions rely entirely on finding the `\\0` to know when to stop.',
        'Always allocate size = text_length + 1 for strings.'
      ],
      commonMistakes: [
        'Forgetting to leave room for the null terminator in array declarations (e.g., `char name[4] = "John";` is invalid because it needs 5 bytes).',
        'Overwriting the null terminator during array manipulation, turning a string into an endless sea of garbage characters.'
      ],
      interviewQuestions: [
        {
          question: 'What happens if a string is missing its null terminator and you pass it to printf("%s")?',
          answer: 'printf will print the characters in the array, and then continue reading consecutive memory addresses past the end of the array, printing whatever garbage values it finds, until it eventually encounters a byte with value 0. This is a buffer over-read and can crash the program or leak sensitive data.'
        }
      ]
    },
    {
      id: 'lesson-09-02',
      title: 'String Manipulation (<string.h>)',
      content: `## Working with Strings

Because strings are just arrays, you cannot use normal operators on them.

\`\`\`c
char str1[] = "Hello";
char str2[] = "World";

str1 = str2;       // ILLEGAL: Cannot assign arrays
if (str1 == str2)  // ILLEGAL: Compares memory addresses, not the text
str1 = str1 + str2; // ILLEGAL: Cannot concatenate arrays like this
\`\`\`

To manipulate strings, you must include the \`<string.h>\` library, which provides utility functions.

### 1. \`strlen(str)\` — String Length
Returns the number of characters before the null terminator.
\`\`\`c
int len = strlen("Hello"); // Returns 5
\`\`\`

### 2. \`strcpy(dest, src)\` — String Copy
Copies the string from \`src\` to \`dest\`, including the \`\\0\`.
\`\`\`c
char buffer[20];
strcpy(buffer, "Embedded"); // buffer now contains "Embedded"
\`\`\`
*Warning: If src is larger than dest, strcpy will cause a buffer overflow! Use \`strncpy()\` for safety.*

### 3. \`strcmp(str1, str2)\` — String Compare
Compares two strings.
- Returns **0** if they are exactly identical.
- Returns non-zero if they are different.
\`\`\`c
if (strcmp(password, "secret123") == 0) {
    // Access granted
}
\`\`\`

### 4. \`strcat(dest, src)\` — String Concatenate
Appends \`src\` to the end of \`dest\`. 
\`\`\`c
char msg[30] = "Hello ";
strcat(msg, "World"); // msg is now "Hello World"
\`\`\`
`,
      codeExamples: [
        {
          title: 'Safe vs Unsafe String Operations',
          code: `#include <stdio.h>
#include <string.h>

int main() {
    char username[10]; // Can hold 9 chars max
    
    // UNSAFE: What if the string is > 9 chars? Buffer overflow!
    // strcpy(username, "Christopher"); 
    
    // SAFE: strncpy copies at most n characters
    strncpy(username, "Christopher", sizeof(username) - 1);
    
    // strncpy does NOT automatically add \\0 if it hits the limit!
    // You must add it manually to guarantee safety.
    username[sizeof(username) - 1] = '\\0';
    
    printf("Username is: %s\\n", username);
    printf("Length is: %lu\\n", strlen(username));
    
    return 0;
}`,
          output: "Username is: Christoph\nLength is: 9"
        }
      ],
      keyPoints: [
        'You must use <string.h> functions to copy, compare, and concatenate strings.',
        'Never use == to compare string contents.',
        'strlen() counts characters up to (but not including) the null terminator.',
        'Always prefer the "n" versions of functions (strncpy, strncmp) to prevent buffer overflows.'
      ],
      commonMistakes: [
        'Using `sizeof(str)` instead of `strlen(str)` to get the length of the text. `sizeof` gives the array capacity, `strlen` gives the current text length.',
        'Assuming `strncpy` always null-terminates. If the source string is longer than the limit, `strncpy` truncates and does NOT append `\\0`.'
      ],
      interviewQuestions: [
        {
          question: 'Why is strcpy considered dangerous in C?',
          answer: 'strcpy() copies characters from the source to the destination until it encounters a null terminator in the source. If the source string is larger than the destination buffer, strcpy() will write past the bounds of the destination buffer, causing a buffer overflow. strncpy() should be used instead to limit the maximum number of bytes copied.'
        }
      ]
    },
    {
      id: 'lesson-09-03',
      title: 'Parsing Strings (sprintf & sscanf)',
      content: `## String Formatting

In embedded systems, you often need to convert numbers to strings (e.g., to send over UART to a display) or convert incoming strings to numbers (e.g., parsing a GPS coordinate).

### 1. \`sprintf()\` — String Print Formatting
Works exactly like \`printf()\`, but instead of printing to the console, it "prints" into a string buffer.

\`\`\`c
char tx_buffer[50];
int temp = 24;
float humidity = 60.5;

// Construct a message to send over serial
sprintf(tx_buffer, "TEMP:%d,HUM:%.1f\\n", temp, humidity);

// tx_buffer now contains: "TEMP:24,HUM:60.5\\n"
uart_send_string(tx_buffer);
\`\`\`

*Safety note: Use \`snprintf()\` to limit the output size and prevent overflows.*
\`\`\`c
snprintf(tx_buffer, sizeof(tx_buffer), "TEMP:%d", temp);
\`\`\`

### 2. \`sscanf()\` — String Scan Formatting
The reverse of \`sprintf\`. It parses data out of a string based on a format template.

\`\`\`c
char rx_buffer[] = "SET_TEMP=25";
int target_temp;

// Parses the integer after the '=' and stores it in target_temp
if (sscanf(rx_buffer, "SET_TEMP=%d", &target_temp) == 1) {
    // Successfully parsed 1 variable
    printf("Setting heater to %d degrees.\\n", target_temp);
}
\`\`\`
`,
      codeExamples: [
        {
          title: 'Parsing a simulated GPS string',
          code: `#include <stdio.h>

int main() {
    // NMEA sentence format (simplified)
    char nmea[] = "$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M";
    
    float lat, lon, alt;
    char lat_dir, lon_dir;
    
    // We want to extract specific fields
    int parsed = sscanf(nmea, "$GPGGA,%*d,%f,%c,%f,%c,%*d,%*d,%*f,%f,M",
                        &lat, &lat_dir, &lon, &lon_dir, &alt);
                        
    // Note: %*d means "read an integer but discard it"
    
    if (parsed == 5) {
        printf("GPS Parsed Successfully:\\n");
        printf("Latitude:  %f %c\\n", lat, lat_dir);
        printf("Longitude: %f %c\\n", lon, lon_dir);
        printf("Altitude:  %f Meters\\n", alt);
    } else {
        printf("Failed to parse NMEA sentence.\\n");
    }
    
    return 0;
}`,
          output: "GPS Parsed Successfully:\nLatitude:  4807.038086 N\nLongitude: 1131.000000 E\nAltitude:  545.400024 Meters"
        }
      ],
      keyPoints: [
        'sprintf() formats variables into a string buffer.',
        'snprintf() is the safer version of sprintf() that prevents buffer overflows.',
        'sscanf() extracts variables from a string based on a format.',
        'sscanf() requires the address (&) of the variables it is writing to.'
      ],
      commonMistakes: [
        'Using sprintf() with a buffer that is too small for the resulting string, causing an overflow.',
        'Forgetting the ampersand (&) in sscanf() arguments, which causes the function to try writing to a random memory address (Segfault).'
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between sprintf and snprintf?',
          answer: 'sprintf writes formatted output to a string buffer but does not check if the buffer is large enough, making it vulnerable to buffer overflows. snprintf takes an additional argument (the maximum size) and guarantees it will not write past that limit (and ensures null-termination within that limit).'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-09-01',
        type: 'mcq',
        question: 'What is the physical size in bytes of the following array: `char str[] = "Cat";` ?',
        options: ['3', '4', '8', 'Unknown'],
        correct: 1,
        explanation: 'The word "Cat" has 3 characters, plus 1 byte for the hidden null terminator (\\0), making the array size 4 bytes in memory.',
        difficulty: 'beginner'
      },
      {
        id: 'q-09-02',
        type: 'mcq',
        question: 'Which function should you use to securely copy a string into a limited-size buffer?',
        options: ['strcpy()', 'strcat()', 'strncpy()', 'strcopy()'],
        correct: 2,
        explanation: 'strncpy() takes a third parameter specifying the maximum number of characters to copy, preventing it from overflowing the destination buffer.',
        difficulty: 'beginner'
      },
      {
        id: 'q-09-03',
        type: 'mcq',
        question: 'If you use == to compare two strings like this: `if(str1 == str2)`, what happens?',
        options: [
          'It correctly checks if the text matches.',
          'It causes a compilation error.',
          'It compares the memory addresses of the two arrays, not their contents.',
          'It compares only the first character of each string.'
        ],
        correct: 2,
        explanation: 'In C, an array name decays to a pointer to its first element. Therefore, str1 == str2 compares the memory addresses. To compare the actual text, you must use strcmp(str1, str2) == 0.',
        difficulty: 'intermediate'
      }
    ]
  }
};
