export const module = {
  id: 'module-05',
  title: 'Control Statements',
  description:
    'Master decision-making in C with if-else, switch-case, and nested conditions. Learn to control program flow with real embedded examples including state machines, menu systems, and error handling.',
  icon: '🔀',
  track: 'c-programming',
  estimatedHours: 5,
  prerequisites: ['module-04'],
  lessons: [
    {
      id: 'lesson-05-01',
      title: 'if, else, and else if — Decision Making',
      content: `## The if Statement

The \`if\` statement executes a block of code only when a condition is **true (non-zero)**.

### Syntax
\`\`\`c
if (condition) {
    // Executed when condition is true (non-zero)
}
\`\`\`

### if-else
\`\`\`c
if (condition) {
    // Executed when condition is true
} else {
    // Executed when condition is false
}
\`\`\`

### if - else if - else (Ladder)
\`\`\`c
if (condition1) {
    // First match
} else if (condition2) {
    // Second check
} else if (condition3) {
    // Third check
} else {
    // Default — none matched
}
\`\`\`

### Flowchart: if-else

\`\`\`
        ┌───────────┐
        │   START   │
        └─────┬─────┘
              ▼
       ┌──────────────┐
       │  condition?   │
       └──────┬───────┘
         YES  │   NO
         ┌────┴────┐
         ▼         ▼
    ┌─────────┐ ┌─────────┐
    │ if-body │ │else-body│
    └────┬────┘ └────┬────┘
         │           │
         └─────┬─────┘
               ▼
        ┌──────────┐
        │   END    │
        └──────────┘
\`\`\`

### Flowchart: if - else if - else

\`\`\`
        ┌───────────┐
        │   START   │
        └─────┬─────┘
              ▼
       ┌──────────────┐
  YES  │ condition1?  │  NO
  ┌────┤              ├────┐
  ▼    └──────────────┘    ▼
┌──────┐            ┌──────────────┐
│body1 │       YES  │ condition2?  │  NO
└──┬───┘       ┌────┤              ├────┐
   │           ▼    └──────────────┘    ▼
   │      ┌──────┐                ┌──────────┐
   │      │body2 │                │else-body │
   │      └──┬───┘                └────┬─────┘
   │         │                         │
   └─────────┴─────────────────────────┘
                       │
                       ▼
                ┌──────────┐
                │   END    │
                └──────────┘
\`\`\`

### Important Rules
1. In C, **any non-zero value is true**; **only 0 is false**
2. Always use **braces** \`{}\` even for single-line bodies — prevents bugs when adding code later
3. Conditions are evaluated **top to bottom** — the first true condition wins
4. The \`else\` clause is optional`,
      codeExamples: [
        {
          title: 'Temperature alarm system with if-else-if',
          code: `#include <stdio.h>
#include <stdint.h>

typedef enum {
    LEVEL_NORMAL,
    LEVEL_WARNING,
    LEVEL_CRITICAL,
    LEVEL_SHUTDOWN
} AlertLevel;

AlertLevel check_temperature(int temp_c) {
    if (temp_c >= 100) {
        return LEVEL_SHUTDOWN;
    } else if (temp_c >= 85) {
        return LEVEL_CRITICAL;
    } else if (temp_c >= 70) {
        return LEVEL_WARNING;
    } else {
        return LEVEL_NORMAL;
    }
}

const char* level_to_string(AlertLevel level) {
    if (level == LEVEL_SHUTDOWN)  return "🔴 SHUTDOWN";
    if (level == LEVEL_CRITICAL)  return "🟠 CRITICAL";
    if (level == LEVEL_WARNING)   return "🟡 WARNING";
    return "🟢 NORMAL";
}

int main() {
    int temperatures[] = {25, 55, 72, 88, 105};
    int count = sizeof(temperatures) / sizeof(temperatures[0]);

    printf("=== Temperature Monitoring System ===\\n\\n");
    printf(" Temp (°C)  │ Alert Level\\n");
    printf("────────────┼─────────────\\n");

    for (int i = 0; i < count; i++) {
        AlertLevel level = check_temperature(temperatures[i]);
        printf("   %3d      │ %s\\n", temperatures[i], level_to_string(level));
    }

    return 0;
}`,
          output:
            '=== Temperature Monitoring System ===\n\n Temp (°C)  │ Alert Level\n────────────┼─────────────\n    25      │ 🟢 NORMAL\n    55      │ 🟢 NORMAL\n    72      │ 🟡 WARNING\n    88      │ 🟠 CRITICAL\n   105      │ 🔴 SHUTDOWN'
        },
        {
          title: 'Embedded GPIO input handling',
          code: `#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

// Simulated GPIO input register
uint8_t GPIO_INPUT = 0b00000101;  // Buttons on pins 0 and 2 pressed

bool read_button(uint8_t pin) {
    return (GPIO_INPUT & (1 << pin)) != 0;
}

int main() {
    printf("=== Button Input Handler ===\\n\\n");

    // Check individual buttons
    if (read_button(0) && read_button(2)) {
        printf("Both Button 0 AND Button 2 pressed → RESET mode\\n");
    } else if (read_button(0)) {
        printf("Button 0 pressed → INCREMENT\\n");
    } else if (read_button(2)) {
        printf("Button 2 pressed → DECREMENT\\n");
    } else {
        printf("No buttons pressed → IDLE\\n");
    }

    // Check with debounce consideration
    static uint8_t prev_state = 0x00;
    uint8_t curr_state = GPIO_INPUT;
    uint8_t changed = curr_state ^ prev_state;

    printf("\\nChanged pins: 0x%02X\\n", changed);

    if (changed & (1 << 0)) {
        printf("Pin 0 changed: now %s\\n",
               (curr_state & (1 << 0)) ? "HIGH" : "LOW");
    }

    prev_state = curr_state;

    return 0;
}`,
          output:
            '=== Button Input Handler ===\n\nBoth Button 0 AND Button 2 pressed → RESET mode\n\nChanged pins: 0x05\nPin 0 changed: now HIGH'
        }
      ],
      keyPoints: [
        'if checks a condition — any non-zero value is true in C',
        'else if creates a chain of conditions — first true one wins',
        'Always use braces {} even for single-line if/else bodies',
        'Conditions are evaluated top-to-bottom; put the most common case first for efficiency',
        'Use named constants or enums instead of magic numbers in conditions'
      ],
      commonMistakes: [
        'Using = (assignment) instead of == (comparison): if (x = 5) is always true. Trick: write if (5 == x) — if you accidentally write =, the compiler will error.',
        'Dangling else: without braces, else binds to the nearest if, which may not be what you intended',
        'Placing a semicolon after if: if (x > 5); { ... } — the semicolon is an empty statement, so the block always executes'
      ],
      interviewQuestions: [
        {
          question: 'What is the "dangling else" problem in C?',
          answer:
            'The dangling else problem occurs when nested if-else statements are written without braces. In: if (a) if (b) x=1; else x=2; — the else binds to the nearest if (the inner one), not the outer one. This can cause logic bugs. The solution is to always use braces to make the structure explicit. Most coding standards (MISRA C) require braces for all if-else blocks.'
        },
        {
          question:
            'In embedded systems, why should the most frequent condition be checked first in an if-else-if chain?',
          answer:
            'In an if-else-if ladder, conditions are evaluated sequentially from top to bottom. If the most common condition is at the bottom, the CPU evaluates all preceding conditions first — wasting cycles. Putting the most frequent case first minimizes the average number of comparisons. In time-critical interrupt handlers, this optimization can be significant.'
        }
      ]
    },
    {
      id: 'lesson-05-02',
      title: 'Nested if and Complex Conditions',
      content: `## Nested if Statements

When you need to check multiple conditions in a hierarchical manner, you nest if statements inside each other.

### Syntax
\`\`\`c
if (outer_condition) {
    if (inner_condition) {
        // Both conditions are true
    } else {
        // Outer true, inner false
    }
} else {
    // Outer condition is false
}
\`\`\`

### Flowchart: Nested if

\`\`\`
         ┌────────────┐
         │   START    │
         └─────┬──────┘
               ▼
        ┌─────────────┐
   YES  │  outer_cond? │  NO
   ┌────┤              ├────┐
   ▼    └──────────────┘    ▼
┌──────────────┐      ┌──────────┐
│ inner_cond?  │      │ else     │
├──YES───┬─NO──┤      │ block    │
▼        ▼     │      └────┬─────┘
┌────┐ ┌────┐  │           │
│ A  │ │ B  │  │           │
└─┬──┘ └─┬──┘  │           │
  └──────┴─────┴───────────┘
              │
              ▼
         ┌────────┐
         │  END   │
         └────────┘
\`\`\`

### Best Practices for Complex Conditions

#### 1. Flatten when possible
Instead of deeply nested if statements, use compound conditions:
\`\`\`c
// Nested (harder to read)
if (sensor_ok) {
    if (temp > 50) {
        if (temp < 100) {
            activate_cooling();
        }
    }
}

// Flattened (cleaner)
if (sensor_ok && temp > 50 && temp < 100) {
    activate_cooling();
}
\`\`\`

#### 2. Use early returns (Guard Clauses)
\`\`\`c
// Nested (deep indentation)
void process_data(int *data, int len) {
    if (data != NULL) {
        if (len > 0) {
            if (len < MAX_LEN) {
                // actual processing
            }
        }
    }
}

// Guard clauses (flat and clean)
void process_data(int *data, int len) {
    if (data == NULL) return;
    if (len <= 0) return;
    if (len >= MAX_LEN) return;
    // actual processing — only reached if all checks pass
}
\`\`\`

#### 3. Extract complex conditions into functions
\`\`\`c
bool is_valid_reading(int temp, int humidity) {
    return (temp >= -40 && temp <= 125 &&
            humidity >= 0 && humidity <= 100);
}

if (is_valid_reading(temp, humidity)) { ... }
\`\`\``,
      codeExamples: [
        {
          title: 'Embedded sensor validation with nested conditions',
          code: `#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

#define TEMP_MIN    -40
#define TEMP_MAX    125
#define HUMID_MIN   0
#define HUMID_MAX   100
#define MAX_RETRIES 3

typedef enum {
    SENSOR_OK,
    SENSOR_DISCONNECTED,
    SENSOR_OUT_OF_RANGE,
    SENSOR_STALE_DATA
} SensorStatus;

typedef struct {
    int16_t temperature;
    uint8_t humidity;
    bool connected;
    uint8_t error_count;
    uint32_t last_update_ms;
} SensorData;

SensorStatus validate_sensor(const SensorData *s, uint32_t current_ms) {
    // Guard clause pattern — check failures first
    if (!s->connected) {
        return SENSOR_DISCONNECTED;
    }

    if ((current_ms - s->last_update_ms) > 5000) {
        return SENSOR_STALE_DATA;
    }

    if (s->temperature < TEMP_MIN || s->temperature > TEMP_MAX ||
        s->humidity < HUMID_MIN || s->humidity > HUMID_MAX) {
        return SENSOR_OUT_OF_RANGE;
    }

    return SENSOR_OK;
}

const char* status_name(SensorStatus s) {
    switch (s) {
        case SENSOR_OK:           return "✅ OK";
        case SENSOR_DISCONNECTED: return "❌ DISCONNECTED";
        case SENSOR_OUT_OF_RANGE: return "⚠️  OUT OF RANGE";
        case SENSOR_STALE_DATA:   return "🕐 STALE DATA";
        default:                  return "❓ UNKNOWN";
    }
}

int main() {
    uint32_t now = 10000;  // Current time in ms

    SensorData sensors[] = {
        { 25,  60, true,  0, 9500 },   // OK
        { 25,  60, false, 0, 9500 },   // Disconnected
        { 150, 60, true,  0, 9500 },   // Out of range
        { 25,  60, true,  0, 3000 },   // Stale (7 seconds old)
    };
    int n = sizeof(sensors) / sizeof(sensors[0]);

    printf("=== Sensor Validation Report ===\\n\\n");
    printf(" # │ Temp │ Humid │ Status\\n");
    printf("───┼──────┼───────┼────────────────\\n");

    for (int i = 0; i < n; i++) {
        SensorStatus status = validate_sensor(&sensors[i], now);
        printf(" %d │ %4d │  %3d  │ %s\\n",
               i, sensors[i].temperature, sensors[i].humidity,
               status_name(status));
    }

    return 0;
}`,
          output:
            '=== Sensor Validation Report ===\n\n # │ Temp │ Humid │ Status\n───┼──────┼───────┼────────────────\n 0 │   25 │   60  │ ✅ OK\n 1 │   25 │   60  │ ❌ DISCONNECTED\n 2 │  150 │   60  │ ⚠️  OUT OF RANGE\n 3 │   25 │   60  │ 🕐 STALE DATA'
        }
      ],
      keyPoints: [
        'Nested if adds conditions hierarchically — but deep nesting hurts readability',
        'Flatten nested conditions using && and || when logic is simple',
        'Use guard clauses (early returns) to handle error cases first',
        'Extract complex boolean expressions into named functions for clarity',
        'MISRA C limits nesting depth to avoid complexity-related bugs'
      ],
      commonMistakes: [
        'Nesting too deeply — more than 3 levels becomes hard to read and maintain',
        'Not using braces with nested if — leads to dangling else bugs',
        'Duplicating code in both if and else branches — extract the common code'
      ],
      interviewQuestions: [
        {
          question: 'What are guard clauses? Why are they preferred in embedded C?',
          answer:
            'Guard clauses are early-return checks at the beginning of a function that handle invalid inputs or error conditions. Instead of wrapping the entire function body in nested if statements, you check each failure case and return immediately. This keeps the "happy path" code at the top level with minimal indentation. In embedded C, guard clauses make interrupt handlers and time-critical functions easier to read, test, and verify.'
        },
        {
          question: 'How deep can if-else nesting go in MISRA C?',
          answer:
            'MISRA C:2012 Rule 18.4 recommends limiting nesting depth (some organizations set it to 4 or 5 levels). Deep nesting increases cyclomatic complexity, making code harder to test and more prone to bugs. If you find yourself nesting more than 3-4 levels, refactor using guard clauses, extract helper functions, or use a state machine pattern.'
        }
      ]
    },
    {
      id: 'lesson-05-03',
      title: 'switch-case: Multi-Way Branching',
      content: `## The switch Statement

The \`switch\` statement selects one of many code blocks to execute based on the value of an **integer expression**. It is cleaner than a long if-else-if chain when comparing a single variable against multiple values.

### Syntax
\`\`\`c
switch (expression) {
    case constant1:
        // Code for constant1
        break;
    case constant2:
        // Code for constant2
        break;
    case constant3:
    case constant4:
        // Code for constant3 OR constant4 (fall-through)
        break;
    default:
        // Code when no case matches
        break;
}
\`\`\`

### Flowchart: switch-case

\`\`\`
       ┌──────────┐
       │  START   │
       └────┬─────┘
            ▼
    ┌───────────────┐
    │  expression   │
    └───────┬───────┘
            │
    ┌───────┼───────┬───────┐
    ▼       ▼       ▼       ▼
┌──────┐┌──────┐┌──────┐┌─────────┐
│case 1││case 2││case 3││ default │
│      ││      ││      ││         │
│break ││break ││break ││ break   │
└──┬───┘└──┬───┘└──┬───┘└────┬────┘
   └───────┴───────┴─────────┘
                │
                ▼
         ┌──────────┐
         │   END    │
         └──────────┘
\`\`\`

### Key Rules
1. **expression** must evaluate to an integer type (int, char, enum — NOT float or string)
2. **case labels** must be **compile-time integer constants**
3. **break** exits the switch — without it, execution **falls through** to the next case
4. **default** handles all unmatched values — always include it
5. Case values must be unique within the same switch

### Fall-Through (Intentional)
Sometimes you want multiple cases to share the same code:
\`\`\`c
case 'a':
case 'A':
    // Handles both lowercase and uppercase
    break;
\`\`\`

### switch vs if-else-if
| Feature | switch | if-else-if |
|---------|--------|-----------|
| Condition type | Integer equality only | Any boolean expression |
| Range check | No (use if) | Yes: if (x > 10 && x < 20) |
| Readability | Better for many values | Better for ranges and complex conditions |
| Performance | May use jump table (O(1)) | Sequential checks (O(n)) |
| Float/string | Not supported | Supported |`,
      codeExamples: [
        {
          title: 'Embedded state machine using switch-case',
          code: `#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

typedef enum {
    STATE_IDLE,
    STATE_INIT,
    STATE_RUNNING,
    STATE_ERROR,
    STATE_SHUTDOWN
} SystemState;

typedef enum {
    EVENT_START,
    EVENT_INIT_DONE,
    EVENT_ERROR,
    EVENT_RESET,
    EVENT_STOP
} Event;

const char* state_name(SystemState s) {
    switch (s) {
        case STATE_IDLE:     return "IDLE";
        case STATE_INIT:     return "INITIALIZING";
        case STATE_RUNNING:  return "RUNNING";
        case STATE_ERROR:    return "ERROR";
        case STATE_SHUTDOWN: return "SHUTDOWN";
        default:             return "UNKNOWN";
    }
}

SystemState handle_event(SystemState current, Event event) {
    switch (current) {
        case STATE_IDLE:
            switch (event) {
                case EVENT_START: return STATE_INIT;
                default:          return STATE_IDLE;
            }

        case STATE_INIT:
            switch (event) {
                case EVENT_INIT_DONE: return STATE_RUNNING;
                case EVENT_ERROR:     return STATE_ERROR;
                default:              return STATE_INIT;
            }

        case STATE_RUNNING:
            switch (event) {
                case EVENT_ERROR: return STATE_ERROR;
                case EVENT_STOP:  return STATE_SHUTDOWN;
                default:          return STATE_RUNNING;
            }

        case STATE_ERROR:
            switch (event) {
                case EVENT_RESET: return STATE_IDLE;
                default:          return STATE_ERROR;
            }

        case STATE_SHUTDOWN:
            return STATE_SHUTDOWN;  // Terminal state

        default:
            return STATE_ERROR;
    }
}

int main() {
    SystemState state = STATE_IDLE;
    Event sequence[] = {
        EVENT_START, EVENT_INIT_DONE, EVENT_ERROR, EVENT_RESET, EVENT_START,
        EVENT_INIT_DONE, EVENT_STOP
    };
    const char *event_names[] = {
        "START", "INIT_DONE", "ERROR", "RESET", "START", "INIT_DONE", "STOP"
    };
    int n = sizeof(sequence) / sizeof(sequence[0]);

    printf("=== State Machine Trace ===\\n\\n");
    printf(" Event       │ %s → ", state_name(state));

    for (int i = 0; i < n; i++) {
        state = handle_event(state, sequence[i]);
        printf("%s\\n", state_name(state));
        if (i < n - 1) {
            printf(" %-11s │ %s → ", event_names[i + 1], state_name(state));
        }
    }

    return 0;
}`,
          output:
            '=== State Machine Trace ===\n\n Event       │ IDLE → INITIALIZING\n INIT_DONE   │ INITIALIZING → RUNNING\n ERROR       │ RUNNING → ERROR\n RESET       │ ERROR → IDLE\n START       │ IDLE → INITIALIZING\n INIT_DONE   │ INITIALIZING → RUNNING\n STOP        │ RUNNING → SHUTDOWN'
        },
        {
          title: 'Menu system with switch and fall-through',
          code: `#include <stdio.h>

void show_menu(void) {
    printf("\\n===== Embedded Debug Menu =====\\n");
    printf("  1. Read sensor values\\n");
    printf("  2. Toggle LED\\n");
    printf("  3. Show register dump\\n");
    printf("  4. Run self-test\\n");
    printf("  5. Reset device\\n");
    printf("  0. Exit\\n");
    printf("===============================\\n");
}

void handle_command(int cmd) {
    switch (cmd) {
        case 1:
            printf("[Sensor] Temp=25°C, Humidity=60%%\\n");
            break;

        case 2:
            printf("[LED] Toggled!\\n");
            break;

        case 3:
            printf("[Registers] R0=0x00 R1=0x42 SR=0xA5\\n");
            break;

        case 4:
            printf("[Self-Test] RAM... OK\\n");
            printf("[Self-Test] Flash... OK\\n");
            printf("[Self-Test] ADC... OK\\n");
            break;

        case 5:
            printf("[RESET] Are you sure? (simulated)\\n");
            // Fall-through intentional for demo
            /* falls through */

        case 0:
            printf("[EXIT] Goodbye!\\n");
            break;

        default:
            printf("[ERROR] Unknown command: %d\\n", cmd);
            break;
    }
}

int main() {
    show_menu();

    // Simulate command sequence
    int commands[] = {1, 3, 7, 2, 4, 0};
    int n = sizeof(commands) / sizeof(commands[0]);

    for (int i = 0; i < n; i++) {
        printf("\\n> Command: %d\\n", commands[i]);
        handle_command(commands[i]);
    }

    return 0;
}`,
          output:
            '\n===== Embedded Debug Menu =====\n  1. Read sensor values\n  2. Toggle LED\n  3. Show register dump\n  4. Run self-test\n  5. Reset device\n  0. Exit\n===============================\n\n> Command: 1\n[Sensor] Temp=25°C, Humidity=60%\n\n> Command: 3\n[Registers] R0=0x00 R1=0x42 SR=0xA5\n\n> Command: 7\n[ERROR] Unknown command: 7\n\n> Command: 2\n[LED] Toggled!\n\n> Command: 4\n[Self-Test] RAM... OK\n[Self-Test] Flash... OK\n[Self-Test] ADC... OK\n\n> Command: 0\n[EXIT] Goodbye!'
        }
      ],
      keyPoints: [
        'switch compares an integer expression against constant case labels',
        'break exits the switch — forgetting it causes fall-through',
        'Intentional fall-through should be documented with a comment /* falls through */',
        'default handles all unmatched values — always include it',
        'switch-case is ideal for state machines, command handlers, and menu systems',
        'The compiler may optimize switch into a jump table for O(1) dispatch'
      ],
      commonMistakes: [
        'Forgetting break — causes unintentional fall-through to the next case',
        'Using variables or expressions as case labels — only compile-time constants are allowed',
        'Omitting the default case — leaves unhandled values silently ignored',
        'Using switch with float or string — not supported in C. Use if-else-if instead'
      ],
      interviewQuestions: [
        {
          question: 'What happens if you forget the break statement in a switch-case?',
          answer:
            'Without break, execution "falls through" to the next case, executing its code as well (and continuing until a break or the end of the switch is reached). This is a frequent source of bugs. Some compilers offer -Wimplicit-fallthrough to warn about this. Intentional fall-through should be documented with a /* falls through */ comment. In MISRA C, every case must end with break.'
        },
        {
          question: 'Can you use a switch statement on a string in C?',
          answer:
            'No. The switch statement in C only works with integer types (int, char, enum, etc.). Strings are pointers, and you cannot compare pointers with case labels. For string matching in C, use if-else-if chains with strcmp(): if (strcmp(str, "hello") == 0) { ... } else if (strcmp(str, "world") == 0) { ... }. Alternatively, use a hash function to convert strings to integers and switch on the hash.'
        }
      ]
    },
    {
      id: 'lesson-05-04',
      title: 'goto Statement and Structured Programming',
      content: `## The goto Statement

\`goto\` provides an **unconditional jump** to a labeled statement within the same function. It is the most controversial control statement in C.

### Syntax
\`\`\`c
goto label_name;

// ... other code ...

label_name:
    // Code to execute after jump
\`\`\`

### Flowchart: goto

\`\`\`
    ┌──────────┐
    │  START   │
    └────┬─────┘
         ▼
    ┌──────────┐
    │  Code A  │
    └────┬─────┘
         ▼
    ┌──────────────┐
    │  condition?  │──NO──→ ...
    └──────┬───────┘
           │ YES
           ▼
     goto cleanup ──────────────────┐
                                    │
    ┌──────────┐                    │
    │  Code B  │  (skipped!)        │
    └────┬─────┘                    │
         ▼                          │
    cleanup: ◀──────────────────────┘
    ┌──────────────┐
    │ Cleanup code │
    └──────────────┘
\`\`\`

### When goto is Acceptable

#### 1. Error Handling / Cleanup (The ONE Good Use)
In C (which lacks try-catch), goto is commonly used for centralized cleanup when a function acquires multiple resources:

\`\`\`c
int init_system(void) {
    if (init_uart() != 0)   goto fail_uart;
    if (init_spi() != 0)    goto fail_spi;
    if (init_sensor() != 0) goto fail_sensor;
    return 0;  // Success

fail_sensor:
    deinit_spi();
fail_spi:
    deinit_uart();
fail_uart:
    return -1;  // Error
}
\`\`\`

This pattern is **extensively used in the Linux kernel** (which is written in C).

### When goto is BAD

- **Jumping forward/backward randomly** — creates spaghetti code
- **Replacing loops** — use for/while/do-while instead
- **Jumping into or out of a loop or switch** — undefined or confusing behavior
- **Jumping into another scope** — can skip variable initialization

### MISRA C and goto
MISRA C:2012 **Rule 15.1** states: "The goto statement should not be used." However, many embedded teams make exceptions for the cleanup pattern shown above, as it produces cleaner code than deeply nested if-else.

### Alternatives to goto
1. **Early returns** — guard clause pattern
2. **Flag variables** — set a flag and check it
3. **Helper functions** — break cleanup into a function
4. **do { ... } while(0) with break** — a common C idiom:

\`\`\`c
do {
    if (step1() != 0) break;
    if (step2() != 0) break;
    if (step3() != 0) break;
    success = true;
} while (0);
cleanup();
\`\`\``,
      codeExamples: [
        {
          title: 'Proper use of goto for resource cleanup',
          code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// Simulated resource allocation functions
bool init_gpio(void)  { printf("  [1] GPIO init... OK\\n"); return true; }
bool init_uart(void)  { printf("  [2] UART init... OK\\n"); return true; }
bool init_spi(void)   { printf("  [3] SPI init... FAILED!\\n"); return false; }
bool init_i2c(void)   { printf("  [4] I2C init... OK\\n"); return true; }

void deinit_uart(void) { printf("  [-] UART deinit\\n"); }
void deinit_gpio(void) { printf("  [-] GPIO deinit\\n"); }

int system_init(void) {
    printf("=== System Initialization ===\\n");

    if (!init_gpio())
        goto fail_gpio;

    if (!init_uart())
        goto fail_uart;

    if (!init_spi())
        goto fail_spi;

    if (!init_i2c())
        goto fail_i2c;

    printf("  [✓] All peripherals initialized!\\n");
    return 0;  // SUCCESS

// Cleanup labels — each one undoes previous successful inits
fail_i2c:
    // deinit_spi() would go here if SPI needed cleanup
fail_spi:
    deinit_uart();
fail_uart:
    deinit_gpio();
fail_gpio:
    printf("  [✗] Initialization FAILED!\\n");
    return -1;
}

int main() {
    int result = system_init();
    printf("\\nResult: %s (code: %d)\\n",
           result == 0 ? "SUCCESS" : "FAILURE", result);
    return result;
}`,
          output:
            '=== System Initialization ===\n  [1] GPIO init... OK\n  [2] UART init... OK\n  [3] SPI init... FAILED!\n  [-] UART deinit\n  [-] GPIO deinit\n  [✗] Initialization FAILED!\n\nResult: FAILURE (code: -1)'
        },
        {
          title: 'Alternative: do-while(0) pattern instead of goto',
          code: `#include <stdio.h>
#include <stdbool.h>

typedef enum { OK = 0, ERR_STEP1, ERR_STEP2, ERR_STEP3 } ErrorCode;

ErrorCode process_data(int *data, int len) {
    ErrorCode err = OK;
    int *buffer = NULL;

    do {
        // Step 1: Validate input
        if (data == NULL || len <= 0) {
            printf("  Step 1: Input validation FAILED\\n");
            err = ERR_STEP1;
            break;
        }
        printf("  Step 1: Input validated\\n");

        // Step 2: Process
        if (data[0] < 0) {
            printf("  Step 2: Invalid data value FAILED\\n");
            err = ERR_STEP2;
            break;
        }
        printf("  Step 2: Data processed\\n");

        // Step 3: Store result
        printf("  Step 3: Result stored\\n");

    } while (0);  // This block runs exactly once

    // Cleanup always runs
    if (buffer != NULL) {
        // free(buffer);  // Would free allocated resources
    }

    return err;
}

int main() {
    printf("=== Test 1: Valid data ===\\n");
    int data1[] = {10, 20, 30};
    ErrorCode r1 = process_data(data1, 3);
    printf("Result: %d\\n\\n", r1);

    printf("=== Test 2: NULL pointer ===\\n");
    ErrorCode r2 = process_data(NULL, 0);
    printf("Result: %d\\n\\n", r2);

    printf("=== Test 3: Negative value ===\\n");
    int data3[] = {-5, 20, 30};
    ErrorCode r3 = process_data(data3, 3);
    printf("Result: %d\\n", r3);

    return 0;
}`,
          output:
            '=== Test 1: Valid data ===\n  Step 1: Input validated\n  Step 2: Data processed\n  Step 3: Result stored\nResult: 0\n\n=== Test 2: NULL pointer ===\n  Step 1: Input validation FAILED\nResult: 1\n\n=== Test 3: Negative value ===\n  Step 1: Input validated\n  Step 2: Invalid data value FAILED\nResult: 2'
        }
      ],
      keyPoints: [
        'goto performs an unconditional jump to a label within the same function',
        'The ONLY widely accepted use of goto in C is for centralized error handling and resource cleanup',
        'The Linux kernel uses goto extensively for cleanup — it is a well-established C pattern',
        'MISRA C discourages goto but many teams allow the cleanup pattern',
        'Alternatives: early returns, do-while(0) with break, flag variables',
        'Never use goto to jump into loops, switch cases, or across variable declarations'
      ],
      commonMistakes: [
        'Using goto for general control flow — creates unmaintainable spaghetti code',
        'Jumping over variable initialization — skipping int x = 5; and then using x is undefined behavior in C99',
        'Using goto to jump between functions — not allowed in C (goto is function-local only)',
        'Replacing proper loops with goto — always use for/while/do-while for iteration'
      ],
      interviewQuestions: [
        {
          question: 'Is goto always bad? When is it acceptable to use?',
          answer:
            'goto is not inherently bad — it is a tool that can be misused. The single widely accepted use case is centralized error handling and resource cleanup in C functions, where a function acquires multiple resources and needs to clean them up in reverse order if any step fails. This pattern is used extensively in the Linux kernel (written in C by Linus Torvalds). Without goto, the alternative is deeply nested if-else or duplicated cleanup code, both of which are worse.'
        },
        {
          question: 'Why does the Linux kernel use goto when MISRA C forbids it?',
          answer:
            'The Linux kernel prioritizes code readability and maintainability in its error-handling paths. The goto-cleanup pattern produces flat, linear code where each resource allocation is followed by a check, and failure jumps to a cleanup section. The alternative — nested if-else — creates deeply indented "arrow code" that is harder to read, review, and modify. MISRA C targets safety-critical embedded systems where all control flow must be provably correct, which is a different context than a general-purpose OS kernel.'
        }
      ]
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q-05-01',
        type: 'mcq',
        question: 'What is the output of: if (0) printf("A"); else printf("B");',
        options: ['A', 'B', 'AB', 'Nothing'],
        correct: 1,
        explanation:
          'In C, 0 is false and any non-zero value is true. Since the condition is 0 (false), the else branch executes, printing "B".',
        difficulty: 'beginner'
      },
      {
        id: 'q-05-02',
        type: 'mcq',
        question:
          'What happens if you forget the break in a switch case?',
        options: [
          'Compilation error',
          'Only that case executes',
          'Execution falls through to the next case',
          'The program crashes'
        ],
        correct: 2,
        explanation:
          'Without break, execution continues into the next case (fall-through). This is a feature of C but often a bug when unintentional. The compiler can warn about this with -Wimplicit-fallthrough.',
        difficulty: 'beginner'
      },
      {
        id: 'q-05-03',
        type: 'mcq',
        question: 'Which data types can be used in a switch expression in C?',
        options: [
          'int, char, enum (integer types)',
          'float, double',
          'char arrays (strings)',
          'All of the above'
        ],
        correct: 0,
        explanation:
          'The switch expression must evaluate to an integer type: int, char, short, long, or enum. Float, double, and strings cannot be used. For string matching, use if-else-if with strcmp().',
        difficulty: 'beginner'
      },
      {
        id: 'q-05-04',
        type: 'mcq',
        question:
          'What is the "dangling else" problem?',
        options: [
          'An else without a matching if causes a syntax error',
          'Without braces, else binds to the nearest if, not the intended one',
          'Using else after a switch statement',
          'Having too many else if clauses'
        ],
        correct: 1,
        explanation:
          'The dangling else problem occurs when nested if-else statements lack braces. The else binds to the closest preceding if, which may not be what the programmer intended. Solution: always use braces {} for if-else bodies.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-05-05',
        type: 'mcq',
        question:
          'What is the accepted use case for goto in C?',
        options: [
          'Replacing for loops',
          'Jumping between functions',
          'Centralized error handling and resource cleanup',
          'goto should never be used'
        ],
        correct: 2,
        explanation:
          'The goto-cleanup pattern is the one widely accepted use. When a function acquires multiple resources and any step can fail, goto provides a clean way to jump to a cleanup section that releases resources in reverse order. This is used extensively in the Linux kernel.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-05-06',
        type: 'mcq',
        question:
          'What is the output of:\nint x = 5;\nif (x > 3)\n    if (x > 10)\n        printf("A");\nelse\n    printf("B");',
        options: ['A', 'B', 'Nothing', 'AB'],
        correct: 1,
        explanation:
          'This is the dangling else problem. Without braces, the else binds to the nearest if (x > 10), not if (x > 3). Since x = 5: x > 3 is true, x > 10 is false, so the else branch of the inner if executes, printing "B". The indentation is misleading — always use braces.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-05-07',
        type: 'mcq',
        question:
          'What is wrong with: if (x > 5); { printf("hello"); }',
        options: [
          'Nothing — it works correctly',
          'The semicolon after if creates an empty body, so printf always executes',
          'Missing parentheses around the condition',
          'printf should use puts'
        ],
        correct: 1,
        explanation:
          'The semicolon after if(x > 5); is treated as the empty if-body. The block { printf("hello"); } is not part of the if — it is an independent block that always executes. This is a subtle and common bug.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-05-08',
        type: 'mcq',
        question:
          'In a switch statement, what is the purpose of the default case?',
        options: [
          'It must be the first case in the switch',
          'It handles all values not matched by any case label',
          'It is required by the C standard',
          'It optimizes the switch for speed'
        ],
        correct: 1,
        explanation:
          'The default case catches all values not explicitly matched by a case label. While not syntactically required by the C standard, it is strongly recommended (and required by MISRA C) to handle unexpected values and prevent silent failures. It is typically placed last.',
        difficulty: 'beginner'
      },
      {
        id: 'q-05-09',
        type: 'mcq',
        question:
          'What is a guard clause?',
        options: [
          'A switch case that protects against invalid input',
          'An early return at the start of a function to handle error conditions',
          'A loop that runs exactly once',
          'A const variable that guards a critical section'
        ],
        correct: 1,
        explanation:
          'A guard clause is an early return (or continue/break) at the beginning of a function that handles invalid inputs or error conditions. It replaces deeply nested if-else structures by checking and returning on failures first, keeping the main logic at a shallow nesting depth.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-05-10',
        type: 'mcq',
        question:
          'In the do { ... } while(0) pattern, how many times does the loop body execute?',
        options: ['0 times', 'Exactly 1 time', 'At least 2 times', 'Infinite times'],
        correct: 1,
        explanation:
          'do-while(0) executes the body exactly once. The while(0) condition is immediately false, so it does not repeat. This pattern is used as a goto alternative: you can use break to exit early to the code after the loop, where cleanup is performed.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-05-11',
        type: 'mcq',
        question:
          'Which of the following is a valid case label in a switch statement?',
        options: [
          'case x:  (where x is a variable)',
          'case 1+2:  (constant expression)',
          'case "hello":  (string literal)',
          'case 3.14:  (float)'
        ],
        correct: 1,
        explanation:
          'Case labels must be compile-time integer constant expressions. 1+2 = 3 is a valid constant expression. Variables (case x:), strings ("hello"), and floats (3.14) are not valid case labels. Enum values are also valid since they are integer constants.',
        difficulty: 'intermediate'
      },
      {
        id: 'q-05-12',
        type: 'mcq',
        question:
          'Why is the state machine pattern implemented with switch-case in embedded C?',
        options: [
          'Because it uses less memory than if-else',
          'Because each state maps to a case label, making transitions clear and the compiler can optimize with a jump table',
          'Because switch-case supports string comparisons',
          'Because MISRA C requires switch for state machines'
        ],
        correct: 1,
        explanation:
          'In a state machine, the current state is an enum or integer, and each state maps naturally to a case label. The compiler can optimize this into a jump table for O(1) state dispatch instead of sequential comparisons. The structure also makes state transitions explicit and easy to trace, which is critical for verifying embedded system behavior.'
        ,
        difficulty: 'advanced'
      }
    ]
  }
};
