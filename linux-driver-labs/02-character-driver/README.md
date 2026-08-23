# Lab 02 — Linux Character Driver

## Objective

Build a minimal Linux character driver and understand the path from a userspace application to kernel file operations.

## Concepts

- `struct file_operations`
- `open()` / `read()` / `write()` / `release()`
- Character device registration
- Major/minor numbers
- Kernel/userspace boundary
- `copy_to_user()` / `copy_from_user()`

## Exercise

Implement a character device that stores a small kernel-side buffer.

Expected flow:

```text
userspace test
     ↓
open()
     ↓
character driver
     ↓
read/write
     ↓
kernel buffer
```

## Validation checklist

- [ ] Module loads without errors
- [ ] Device registration succeeds
- [ ] `open()` is called
- [ ] Data can be written from userspace
- [ ] Data can be read back
- [ ] Invalid userspace pointers are handled safely
- [ ] Module unload releases resources

## Debug questions

1. What is the difference between major and minor numbers?
2. Why can't a driver directly dereference an arbitrary userspace pointer?
3. When is `copy_to_user()` required?
4. What happens if `read()` returns fewer bytes than requested?
