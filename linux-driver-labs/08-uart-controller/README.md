# Lab 08 — UART Controller Driver

## Objective

Understand how a Linux UART controller integrates with the serial core and how a controller driver eventually converts the kernel serial interface into register/FIFO/interrupt activity on a UART peripheral.

## Linux architecture

```text
Userspace
   ↓
/dev/ttyELAB0
   ↓
TTY / Serial Core
   ↓
uart_driver
   ↓
uart_port / uart_ops
   ↓
UART Controller Driver
   ↓
Registers / FIFO / IRQ
   ↓
TX / RX signals
```

## Implementation

- `uart_lab_controller.c` — educational serial-core driver skeleton
- `Makefile` — out-of-tree module build

The skeleton demonstrates the Linux serial-core concepts:

- `struct uart_driver`
- `struct uart_port`
- `struct uart_ops`
- startup/shutdown lifecycle
- TX/RX control callbacks
- Device Tree matching
- UART port registration

## Build

```bash
make
```

## Important limitation

The callbacks are intentionally incomplete. The driver does **not** claim to operate a real UART controller yet.

A real implementation must connect the serial-core callbacks to the target SoC's UART register map and implement FIFO, baud-rate configuration, interrupts, status/error handling and console integration as appropriate.

## Real hardware implementation plan

```text
1. Map UART registers
2. Enable clock/reset
3. Configure baud divisor
4. Configure word length/parity/stop bits
5. Enable TX/RX FIFOs
6. Implement TX path
7. Implement RX path
8. Handle RX/TX interrupts
9. Handle framing/parity/overrun errors
10. Implement console support if required
11. Validate baud-rate accuracy
12. Validate loopback and external traffic
```

## Validation checklist

- [ ] UART port registers successfully
- [ ] Device Tree resource is correct
- [ ] Baud rate is correct
- [ ] TX output is correct
- [ ] RX input is correct
- [ ] FIFO behavior is correct
- [ ] RX interrupt works
- [ ] TX interrupt works
- [ ] Overrun is detected
- [ ] Framing/parity errors are handled
- [ ] Loopback test passes
- [ ] Logic-analyzer capture matches expected waveform

## Debug questions

1. Why does the Linux serial core use `uart_ops` callbacks?
2. How is a baud rate generated from a UART input clock?
3. What causes a framing error?
4. How would you debug a UART that transmits correctly but receives corrupted data?
5. How can a logic analyzer distinguish a baud-rate error from an incorrect parity configuration?
