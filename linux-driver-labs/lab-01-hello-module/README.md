# Lab 01 — Linux Kernel Module

## Objective
Build, load, inspect and unload a minimal Linux kernel module.

## Skills

- Kernel module lifecycle
- Kbuild basics
- `insmod`, `modprobe`, `rmmod`
- `dmesg` / kernel logging
- Kernel vs user-space boundary

## Tasks

1. Create `hello.c` with module init/exit functions.
2. Add a Makefile using the running kernel build directory.
3. Build the module.
4. Load it.
5. Verify the kernel log.
6. Inspect the module with `lsmod` and `modinfo`.
7. Unload it.
8. Record expected and observed behavior.

## Validation checklist

- [ ] Module compiles without warnings
- [ ] Module loads successfully
- [ ] Init message appears once
- [ ] Exit message appears once
- [ ] Module unloads cleanly
- [ ] No unexpected kernel warnings

## Debug questions

- What executes in kernel context?
- What happens if module initialization returns an error?
- Why can a kernel module not use normal libc APIs?
- Where does the module execute in the kernel address space?
