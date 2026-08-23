# Lab 02 — Linux Character Driver

## Objective

Build, load and test a minimal Linux character driver and understand the path from a userspace application to kernel file operations.

## Included implementation

- `character_driver.c` — kernel character driver
- `Makefile` — out-of-tree module build helpers
- `test_char.c` — userspace read/write test

## Concepts

- `struct file_operations`
- `open()` / `read()` / `write()` / `release()`
- Character device registration
- Major/minor numbers
- Kernel/userspace boundary
- `copy_to_user()` / `copy_from_user()`
- Device nodes

## Build

```bash
make
cc -Wall -Wextra -O2 test_char.c -o test_char
```

## Load

```bash
make load
```

The driver creates `/dev/lab_char` through the kernel device model.

Verify:

```bash
ls -l /dev/lab_char
make logs
```

## Run the userspace test

```bash
sudo ./test_char
```

Expected output:

```text
read back: hello from userspace
```

A zero exit status indicates that the data written from userspace was read back correctly through the driver.

## Unload

```bash
make unload
```

## Validation checklist

- [ ] Module builds against the running kernel
- [ ] Device registration succeeds
- [ ] `/dev/lab_char` is created
- [ ] `open()` is called
- [ ] Data can be written from userspace
- [ ] `copy_from_user()` safely transfers data
- [ ] Data can be read back
- [ ] `copy_to_user()` safely transfers data
- [ ] Driver handles end-of-data correctly
- [ ] Module unload releases resources
- [ ] No unexpected kernel errors are observed

## Debug questions

1. What is the difference between major and minor numbers?
2. Why can't a driver directly dereference an arbitrary userspace pointer?
3. When is `copy_to_user()` required?
4. Why does `read()` return zero at end-of-data?
5. What resources must be released during module removal?

## Important limitation

This lab is intentionally a small educational driver. It uses an in-memory buffer and does not control physical hardware. The next stages introduce platform devices, Device Tree, interrupts and real peripheral subsystems.
