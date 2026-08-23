# Lab 11 — Linux Driver Debugging

## Objective

Build a repeatable workflow for diagnosing Linux driver failures using kernel logs, dynamic debug, tracing and debugger-based inspection.

## Failure workflow

```text
Failure
  ↓
Reproduce
  ↓
Capture evidence
  ↓
Classify
  ├── Probe/binding
  ├── Register/MMIO
  ├── IRQ
  ├── DMA
  ├── Protocol
  ├── Race/deadlock
  └── Power/clock/reset
  ↓
Instrument
  ↓
Trace
  ↓
Root cause
  ↓
Fix
  ↓
Regression
```

## First-line tools

### Kernel logs

```bash
dmesg -w
```

### Module information

```bash
lsmod
modinfo <module>
```

### Device/driver binding

```bash
ls /sys/bus/platform/devices/
ls /sys/bus/platform/drivers/
```

### Kernel tracing

Where enabled by the kernel configuration, use ftrace/tracepoints to inspect execution paths.

```bash
mount -t debugfs none /sys/kernel/debug 2>/dev/null || true
ls /sys/kernel/debug/tracing/
```

## Debug evidence template

```text
Issue:
Platform:
Kernel:
Driver:
Reproduction:
Expected:
Observed:
Last known good:
Logs:
Registers:
IRQ state:
DMA state:
Protocol evidence:
Hypothesis:
Root cause:
Fix:
Regression:
```

## Validation checklist

- [ ] Failure is reproducible
- [ ] Kernel version recorded
- [ ] Driver version/commit recorded
- [ ] Boot configuration recorded
- [ ] Kernel logs captured
- [ ] Register state captured where relevant
- [ ] IRQ/DMA state captured where relevant
- [ ] External protocol evidence captured where relevant
- [ ] Root cause separated from symptom
- [ ] Fix validated with original failing test
- [ ] Regression tests executed

## Engineering rule

Do not start by changing code blindly.

**Capture evidence first.**

For hardware-facing bugs, correlate software logs with registers, timing, waveforms or protocol traces whenever possible.
