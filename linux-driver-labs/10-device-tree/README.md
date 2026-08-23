# Lab 10 — Device Tree and Driver Binding

## Objective

Understand how Linux describes SoC hardware through Device Tree and how a platform driver binds to a matching hardware node.

## Core relationship

```text
Device Tree source (.dts/.dtsi)
        ↓
Device Tree Blob (.dtb)
        ↓
Linux boot
        ↓
Device Tree node
        ↓
platform device
        ↓
compatible match
        ↓
driver probe()
```

## Example node

```dts
embedded_lab_uart: uart@40000000 {
    compatible = "embedded-lab,uart-controller";
    reg = <0x40000000 0x1000>;
    interrupts = <42>;
    clocks = <&uart_clk>;
    status = "okay";
};
```

This is an educational example. The address, interrupt and clock references must be replaced with values from the actual SoC hardware specification before use.

## Driver-side concepts

A platform driver typically uses:

- `of_match_table`
- `compatible`
- platform resources
- `platform_get_resource()`
- `devm_ioremap_resource()`
- `platform_get_irq()`
- clock/reset frameworks
- regulator/power dependencies

## Validation checklist

- [ ] DTS syntax is valid
- [ ] Node is enabled
- [ ] `compatible` exactly matches driver
- [ ] MMIO range is correct
- [ ] IRQ is correct
- [ ] Clock/reset dependencies are correct
- [ ] Driver probe executes
- [ ] Resource mapping succeeds
- [ ] Driver removal is clean

## Debug workflow

```bash
dmesg | grep -i <driver>
```

Inspect the live Device Tree where supported:

```bash
ls /sys/firmware/devicetree/base/
```

Inspect platform devices:

```bash
ls /sys/bus/platform/devices/
```

## Debug questions

1. Why is `compatible` the key link between Device Tree and a driver?
2. What happens when the Device Tree resource range is wrong?
3. Why should drivers avoid hard-coded SoC addresses?
4. How do you distinguish a Device Tree problem from a driver `probe()` problem?
5. What evidence would you collect before changing the driver code?
