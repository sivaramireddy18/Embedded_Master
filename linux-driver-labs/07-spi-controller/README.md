# Lab 07 — SPI Controller Driver

## Objective

Understand how a Linux SPI controller driver integrates with the Linux SPI core and how controller-specific transfer logic eventually drives SCLK, MOSI, MISO and chip-select signals.

## Linux architecture

```text
SPI client driver
       ↓
spi_sync() / spi_async()
       ↓
Linux SPI core
       ↓
spi_controller
       ↓
transfer_one()
       ↓
Controller registers / FIFO / IRQ
       ↓
CS / SCLK / MOSI / MISO
```

## Implementation

- `spi_lab_controller.c` — educational SPI controller skeleton
- `Makefile` — out-of-tree kernel module build

The implementation demonstrates:

- `struct spi_controller`
- `transfer_one()` callback
- SPI mode configuration
- Chip-select count
- Device Tree compatible matching
- Controller registration

## Build

```bash
make
```

## Important limitation

`transfer_one()` currently reports the transfer parameters and returns `-EOPNOTSUPP`.

It does **not** claim to operate real SPI hardware. A production controller driver must implement the target SoC's register/FIFO programming, chip-select control, clock configuration, transfer completion and error handling.

## Real hardware implementation plan

```text
1. Map controller registers
2. Enable clock/reset
3. Configure clock polarity/phase
4. Configure clock divider
5. Configure word size
6. Configure chip select
7. Fill TX FIFO
8. Start transfer
9. Drain RX FIFO
10. Handle completion IRQ
11. Detect overrun/underrun
12. Handle timeout/reset
13. Validate signal timing
```

## Validation checklist

- [ ] Controller registers successfully
- [ ] SPI device is described correctly in Device Tree
- [ ] Mode 0/1/2/3 behavior is correct where supported
- [ ] Clock frequency is correct
- [ ] Chip select timing is correct
- [ ] TX data is correct
- [ ] RX data is correct
- [ ] Full-duplex transfer works
- [ ] FIFO boundaries are handled
- [ ] Timeout/error handling works
- [ ] Logic-analyzer/protocol-analyzer trace captured

## Debug questions

1. What is the difference between an SPI controller driver and an SPI protocol/client driver?
2. How do CPOL and CPHA determine sampling behavior?
3. Why is chip-select timing important for some SPI devices?
4. How would you distinguish an incorrect SPI mode from a clock-frequency problem?
5. What evidence would you collect when MOSI looks correct but MISO data is corrupted?
