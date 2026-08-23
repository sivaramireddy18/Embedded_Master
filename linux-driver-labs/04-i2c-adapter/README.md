# Lab 04 — I2C Adapter Driver

## Objective

Understand the Linux I2C subsystem from the controller/adapter perspective and learn how an I2C controller driver integrates with the kernel framework.

## Concepts

- I2C bus architecture
- `struct i2c_adapter`
- Bus registration
- Controller hardware operations
- I2C messages and transfers
- Device Tree integration
- Clock stretching and bus errors

## Exercise

Design the driver flow for an I2C controller:

```text
I2C client driver
      ↓
i2c_transfer()
      ↓
I2C core
      ↓
i2c_adapter
      ↓
controller driver
      ↓
registers / FIFO / IRQ
      ↓
I2C bus
```

## Validation checklist

- [ ] Adapter registers
- [ ] Bus appears in Linux
- [ ] Device Tree address is correct
- [ ] Read/write transfer succeeds
- [ ] Repeated-start behavior is handled
- [ ] NACK is detected
- [ ] Timeout is handled
- [ ] Bus recovery behavior is understood

## Debug questions

1. What is the difference between an I2C adapter driver and client driver?
2. Where does `i2c_transfer()` eventually reach the controller hardware?
3. How should a driver handle clock stretching?
4. What happens when a slave returns NACK?
