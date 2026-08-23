# Lab 06 — I2C Adapter Driver

## Objective

Understand how a Linux I2C controller/adapter driver integrates with the Linux I2C core.

This lab deliberately starts with a **hardware-independent adapter skeleton**. It registers an adapter and receives I2C messages, but it does not claim to drive real I2C controller registers yet.

## Linux architecture

```text
I2C client driver
       ↓
i2c_transfer()
       ↓
Linux I2C core
       ↓
i2c_adapter
       ↓
i2c_algorithm.master_xfer()
       ↓
Controller driver
       ↓
I2C registers / FIFO / IRQ
       ↓
SCL / SDA
```

## Implementation

- `i2c_lab_adapter.c` — platform-driver based I2C adapter skeleton
- `Makefile` — out-of-tree kernel module build

The implementation provides:

- `struct i2c_adapter`
- `struct i2c_algorithm`
- `master_xfer()` callback
- `functionality()` callback
- Device Tree compatible matching
- Adapter registration/removal

## Build

```bash
make
```

## Important limitation

`master_xfer()` currently logs the requested messages and returns `-EOPNOTSUPP`.

That is intentional. A real controller implementation must program the specific SoC's I2C registers, handle FIFO/state-machine behavior, acknowledge/NACK conditions, timeouts, interrupts and bus recovery.

## Real hardware implementation plan

```text
1. Obtain controller register specification
2. Map MMIO resource
3. Enable clock/reset
4. Configure bus timing
5. Implement START/STOP
6. Implement address phase
7. Implement TX/RX FIFO handling
8. Handle ACK/NACK
9. Handle clock stretching
10. Add IRQ-driven transfer completion
11. Add timeout/recovery
12. Validate against real I2C devices
```

## Validation checklist

- [ ] Adapter registers successfully
- [ ] `i2c_adapter` appears in the kernel
- [ ] `master_xfer()` receives expected messages
- [ ] Register-level transfer engine implemented for target SoC
- [ ] START/STOP verified
- [ ] Address ACK/NACK verified
- [ ] Read/write transfers verified
- [ ] Repeated-start verified
- [ ] Clock stretching verified
- [ ] Timeout handling verified
- [ ] Bus recovery verified
- [ ] Logic-analyzer/protocol-analyzer trace captured

## Debug questions

1. What is the difference between an I2C adapter driver and an I2C client driver?
2. Why does `master_xfer()` receive an array of `struct i2c_msg`?
3. Where should controller-specific register programming live?
4. How should a driver handle a slave NACK?
5. What evidence proves that a software timeout is caused by a physical bus problem?
