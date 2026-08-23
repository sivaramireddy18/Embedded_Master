# Lab 09 — Linux DMAengine Client

## Objective

Understand how a Linux peripheral/client driver requests a DMA channel and submits asynchronous transfers through the Linux DMAengine framework.

## Architecture

```text
Peripheral / Client Driver
        ↓
DMAengine API
        ↓
dma_chan
        ↓
dma_async_tx_descriptor
        ↓
DMA Controller Driver
        ↓
DMA hardware
        ↓
Memory / Peripheral
```

## Implementation

- `dma_lab_client.c` — educational DMAengine client skeleton
- `Makefile` — out-of-tree module build

The example demonstrates:

- `dma_request_chan()`
- DMA descriptor preparation
- Completion callback
- `dmaengine_submit()`
- `dma_async_issue_pending()`
- Channel release

## Important limitation

The sample intentionally does **not** perform a real memory copy. The example uses placeholder DMA addresses/length to demonstrate the API flow; real DMA addresses must come from correctly allocated and mapped buffers for the target platform.

Do not load this example on hardware expecting a valid transfer without completing the buffer mapping and platform-specific Device Tree/DMA configuration.

## Real implementation plan

```text
1. Identify DMA controller
2. Confirm DMAengine support
3. Describe channel in Device Tree
4. Request channel
5. Allocate suitable buffers
6. Map buffers for DMA
7. Prepare descriptor
8. Register completion callback
9. Submit descriptor
10. Issue pending
11. Wait/check completion
12. Verify data integrity
13. Unmap/free buffers
14. Validate cache/coherency behavior
15. Test timeout and error paths
```

## Validation matrix

### Basic

- [ ] Small transfer
- [ ] Different transfer lengths
- [ ] Aligned buffers
- [ ] Repeated transfers

### Stress

- [ ] Large transfers
- [ ] Back-to-back transfers
- [ ] Multiple DMA channels
- [ ] Concurrent CPU activity

### Negative

- [ ] Invalid length
- [ ] Unsupported alignment
- [ ] DMA timeout
- [ ] Transfer abort
- [ ] Controller error
- [ ] Reset during transfer

## Cache / coherency investigation

For non-coherent platforms, validate the ownership transition explicitly:

```text
CPU writes buffer
      ↓
DMA mapping / cache maintenance
      ↓
DMA owns buffer
      ↓
DMA completes
      ↓
CPU regains ownership
      ↓
Unmap / sync if required
      ↓
CPU verifies data
```

The exact API and coherency behavior depend on the Linux architecture and device.

## Evidence to collect

- DMA channel
- Source/destination addresses as appropriate
- Transfer length
- Descriptor/cookie
- Completion status
- DMA controller status/error registers
- Data-integrity result
- Kernel log
- Trace/debug evidence

## Debug questions

1. Why shouldn't a driver pass an arbitrary virtual address directly to a DMA controller?
2. What is the purpose of DMA mapping?
3. How can cache coherency create apparently random DMA corruption?
4. What evidence distinguishes a DMA-engine software issue from a bus/interconnect issue?
5. How would you validate DMA behavior under CPU and peripheral contention?
