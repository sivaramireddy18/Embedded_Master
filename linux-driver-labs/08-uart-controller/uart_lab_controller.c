#include <linux/module.h>
#include <linux/platform_device.h>
#include <linux/serial_core.h>

struct uart_lab {
    struct uart_port port;
};

static unsigned int uart_lab_tx_empty(struct uart_port *port)
{
    return TIOCSER_TEMT;
}

static void uart_lab_set_mctrl(struct uart_port *port, unsigned int mctrl)
{
}

static unsigned int uart_lab_get_mctrl(struct uart_port *port)
{
    return TIOCM_CAR | TIOCM_DSR | TIOCM_CTS;
}

static void uart_lab_stop_tx(struct uart_port *port)
{
}

static void uart_lab_start_tx(struct uart_port *port)
{
    /* Educational skeleton: TX FIFO/register programming belongs here. */
}

static void uart_lab_stop_rx(struct uart_port *port)
{
}

static void uart_lab_enable_ms(struct uart_port *port)
{
}

static void uart_lab_break_ctl(struct uart_port *port, int break_state)
{
}

static int uart_lab_startup(struct uart_port *port)
{
    return 0;
}

static void uart_lab_shutdown(struct uart_port *port)
{
}

static const char *uart_lab_type(struct uart_port *port)
{
    return "embedded-lab-uart";
}

static void uart_lab_release_port(struct uart_port *port)
{
}

static int uart_lab_request_port(struct uart_port *port)
{
    return 0;
}

static void uart_lab_config_port(struct uart_port *port, int flags)
{
    port->type = PORT_16550A;
}

static int uart_lab_verify_port(struct uart_port *port,
                                struct serial_struct *ser)
{
    return 0;
}

static const struct uart_ops uart_lab_ops = {
    .tx_empty = uart_lab_tx_empty,
    .set_mctrl = uart_lab_set_mctrl,
    .get_mctrl = uart_lab_get_mctrl,
    .stop_tx = uart_lab_stop_tx,
    .start_tx = uart_lab_start_tx,
    .stop_rx = uart_lab_stop_rx,
    .enable_ms = uart_lab_enable_ms,
    .break_ctl = uart_lab_break_ctl,
    .startup = uart_lab_startup,
    .shutdown = uart_lab_shutdown,
    .type = uart_lab_type,
    .release_port = uart_lab_release_port,
    .request_port = uart_lab_request_port,
    .config_port = uart_lab_config_port,
    .verify_port = uart_lab_verify_port,
};

static struct uart_driver uart_lab_driver = {
    .owner = THIS_MODULE,
    .driver_name = "embedded_lab_uart",
    .dev_name = "ttyELAB",
    .major = 0,
    .minor = 0,
    .nr = 1,
};

static int uart_lab_probe(struct platform_device *pdev)
{
    struct uart_lab *lab;
    int ret;

    lab = devm_kzalloc(&pdev->dev, sizeof(*lab), GFP_KERNEL);
    if (!lab)
        return -ENOMEM;

    lab->port.ops = &uart_lab_ops;
    lab->port.dev = &pdev->dev;
    lab->port.fifosize = 16;
    lab->port.line = 0;
    lab->port.iotype = UPIO_MEM;

    platform_set_drvdata(pdev, lab);

    ret = uart_register_driver(&uart_lab_driver);
    if (ret)
        return ret;

    ret = uart_add_one_port(&uart_lab_driver, &lab->port);
    if (ret) {
        uart_unregister_driver(&uart_lab_driver);
        return ret;
    }

    dev_info(&pdev->dev, "UART controller registered\n");
    return 0;
}

static void uart_lab_remove(struct platform_device *pdev)
{
    struct uart_lab *lab = platform_get_drvdata(pdev);

    uart_remove_one_port(&uart_lab_driver, &lab->port);
    uart_unregister_driver(&uart_lab_driver);
}

static const struct of_device_id uart_lab_of_match[] = {
    { .compatible = "embedded-lab,uart-controller" },
    { }
};
MODULE_DEVICE_TABLE(of, uart_lab_of_match);

static struct platform_driver uart_lab_platform_driver = {
    .probe = uart_lab_probe,
    .remove = uart_lab_remove,
    .driver = {
        .name = "embedded-lab-uart",
        .of_match_table = uart_lab_of_match,
    },
};

module_platform_driver(uart_lab_platform_driver);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Siva Rami Reddy");
MODULE_DESCRIPTION("Educational Linux UART controller driver skeleton");
