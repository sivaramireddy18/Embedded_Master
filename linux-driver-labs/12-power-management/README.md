# Lab 12 — Linux Power Management

## Objective

Understand how a Linux driver participates in runtime and system power-management transitions.

## Architecture

```text
Normal operation
      ↓
Runtime suspend request
      ↓
Driver runtime_suspend()
      ↓
Stop activity / save state
      ↓
Clock / power reduction
      ↓
Runtime resume
      ↓
Restore state
      ↓
Normal operation
```

For system suspend/resume:

```text
Running
  ↓
Suspend preparation
  ↓
Driver suspend()
  ↓
Low-power state
  ↓
Driver resume()
  ↓
Restore hardware
  ↓
Running
```

## Driver responsibilities

A real driver may need to:

- Stop new I/O
- Complete or cancel outstanding work
- Save required hardware state
- Disable interrupts appropriately
- Gate clocks where owned by the driver/framework
- Restore configuration during resume
- Re-enable normal operation
- Handle wake-up sources

## Validation checklist

- [ ] Runtime suspend is entered
- [ ] Runtime resume restores operation
- [ ] No I/O races occur during transition
- [ ] Register state is restored
- [ ] Interrupts behave correctly after resume
- [ ] DMA is stopped/handled safely
- [ ] Wake-up behavior is correct
- [ ] System suspend/resume succeeds repeatedly
- [ ] No resource leaks occur

## Debug evidence

Record:

- PM transition timestamps
- Driver logs
- Clock/reset state
- Relevant registers before/after suspend
- IRQ state
- DMA state
- Wake-up source
- Power-domain state where available

## Debug questions

1. What state must a driver preserve across suspend/resume?
2. How can an outstanding DMA transfer break a suspend sequence?
3. Why can a device work after boot but fail after resume?
4. How would you distinguish a clock/reset restoration problem from a driver-state problem?
