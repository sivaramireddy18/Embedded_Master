# Lab 01 — Hello Kernel Module

## Objective

Build, load, unload and inspect a minimal Linux kernel module.

## Source

- `hello.c` — module implementation
- `Makefile` — out-of-tree kernel module build/load helpers

## Prerequisites

- Linux host or VM
- Matching kernel headers
- GCC / build tools
- Root privileges for module insertion/removal

## Build

```bash
make
```

## Load

```bash
make load
```

## Verify

```bash
dmesg | tail -n 20
lsmod | grep hello
```

Expected kernel log:

```text
linux-driver-labs: hello module loaded
```

## Unload

```bash
make unload
```

Verify:

```bash
dmesg | tail -n 20
```

Expected:

```text
linux-driver-labs: hello module unloaded
```

## Validation checklist

- [ ] Module builds against the running kernel
- [ ] `.ko` is generated
- [ ] Module loads successfully
- [ ] `module_init()` executes
- [ ] Expected kernel log appears
- [ ] Module unloads successfully
- [ ] `module_exit()` executes
- [ ] No unexpected kernel errors are observed

## What this demonstrates

This is intentionally small, but it establishes the basic Linux driver development workflow:

```text
C source
  ↓
Kernel build system
  ↓
.ko module
  ↓
insmod
  ↓
Kernel
  ↓
init function
  ↓
Runtime observation
  ↓
rmmod
  ↓
exit function
```

## Next lab

Move to **Lab 02 — Character Driver** to introduce `file_operations` and the userspace/kernel interface.
