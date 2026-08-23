# Lab 05 — Interrupts and Workqueues

## Objective

Understand how a Linux driver handles hardware interrupts without performing excessive work directly in hard-interrupt context.

## Concepts

- IRQ registration
- Top-half interrupt handler
- Deferred work
- Workqueues
- Interrupt-safe state
- Synchronization
- Interrupt storms

## Exercise

Implement a conceptual driver flow where the IRQ handler captures the minimum required state and schedules deferred processing.

```text
Hardware event
     ↓
IRQ
     ↓
interrupt handler
     ↓
schedule work
     ↓
workqueue context
     ↓
process event
```

## Validation checklist

- [ ] IRQ is requested successfully
- [ ] Handler executes on the expected interrupt
- [ ] Handler does minimal work
- [ ] Deferred work executes
- [ ] Shared state is synchronized
- [ ] Work is cancelled/flushed during removal
- [ ] Repeated interrupts do not corrupt state

## Debug questions

1. Why shouldn't a driver perform blocking operations in hard-IRQ context?
2. When would you choose a workqueue instead of a threaded IRQ?
3. What race can occur between an interrupt and driver removal?
4. How do you prove that an interrupt storm is occurring?
