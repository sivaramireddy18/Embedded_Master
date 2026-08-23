# Linux Driver Labs

A hands-on Linux kernel and device-driver laboratory focused on understanding the complete path from hardware description to kernel driver, user-space interface, debugging, and validation.

## Goals

- Build Linux kernel modules from scratch
- Understand platform drivers and Device Tree
- Implement GPIO, UART, I2C, SPI and interrupt-driven drivers
- Practice sysfs, procfs, misc and character-device interfaces
- Understand DMA, locking, workqueues and deferred execution
- Debug with kernel logs, ftrace, dynamic debug and GDB/kgdb concepts
- Develop validation-oriented test cases

## Lab progression

1. Kernel module hello world
2. Character driver
3. File operations and ioctl
4. Device Tree basics
5. Platform driver
6. GPIO driver
7. Interrupt handling
8. Workqueues and tasklets/deferred work
9. I2C client/adapter concepts
10. SPI device driver concepts
11. UART/TTY architecture
12. DMA and coherent memory
13. Runtime PM and power management
14. Driver debugging and tracing
15. Driver validation and fault injection
16. Capstone: complete virtual/physical peripheral driver validation

## Engineering rule

Every lab should contain:

- Objective
- Architecture
- Source code
- Build instructions
- Test procedure
- Expected result
- Failure cases
- Debug methodology
- Validation checklist
- Lessons learned

This repository is intended to demonstrate engineering depth, not just copied kernel examples.
