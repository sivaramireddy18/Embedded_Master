# Lab 03 — Platform Driver

## Objective

Understand how Linux represents non-discoverable SoC peripherals and how a platform driver binds to a device described by firmware, typically Device Tree.

## Concepts

- Platform devices
- Platform drivers
- `probe()` / `remove()`
- Device Tree matching
- `compatible` strings
- MMIO resources
- Managed resource APIs

## Exercise

Create a minimal platform driver and bind it to a Device Tree node.

```text
Device Tree
    ↓
platform device
    ↓
compatible match
    ↓
platform_driver
    ↓
probe()
    ↓
resource initialization
```

## Validation checklist

- [ ] Device Tree node is valid
- [ ] `compatible` matches the driver
- [ ] Driver registers successfully
- [ ] `probe()` executes
- [ ] MMIO resource is obtained safely
- [ ] `remove()` cleans up correctly

## Debug questions

1. Why are platform devices common in SoCs?
2. What is the purpose of the `compatible` property?
3. What causes `probe()` to be called?
4. Why should a driver avoid hard-coded physical addresses?
