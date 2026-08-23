#include <linux/module.h>
#include <linux/platform_device.h>
#include <linux/spi/spi.h>

struct spi_lab {
    struct spi_controller *controller;
};

static int spi_lab_transfer_one(struct spi_controller *controller,
                                struct spi_device *spi,
                                struct spi_transfer *transfer)
{
    dev_info(&spi->dev,
             "transfer: len=%u speed=%uHz bits=%u mode=%u\n",
             transfer->len,
             transfer->speed_hz,
             spi->bits_per_word,
             spi->mode);

    /* Educational skeleton: hardware FIFO/register programming belongs here. */
    return -EOPNOTSUPP;
}

static int spi_lab_probe(struct platform_device *pdev)
{
    struct spi_lab *lab;
    struct spi_controller *controller;
    int ret;

    controller = devm_spi_alloc_host(&pdev->dev, sizeof(*lab));
    if (!controller)
        return -ENOMEM;

    lab = spi_controller_get_devdata(controller);
    lab->controller = controller;

    controller->mode_bits = SPI_CPOL | SPI_CPHA | SPI_CS_HIGH;
    controller->num_chipselect = 4;
    controller->transfer_one = spi_lab_transfer_one;
    controller->dev.of_node = pdev->dev.of_node;

    platform_set_drvdata(pdev, controller);

    ret = devm_spi_register_controller(&pdev->dev, controller);
    if (ret)
        return ret;

    dev_info(&pdev->dev, "SPI controller registered\n");
    return 0;
}

static const struct of_device_id spi_lab_of_match[] = {
    { .compatible = "embedded-lab,spi-controller" },
    { }
};
MODULE_DEVICE_TABLE(of, spi_lab_of_match);

static struct platform_driver spi_lab_driver = {
    .probe = spi_lab_probe,
    .driver = {
        .name = "embedded-lab-spi",
        .of_match_table = spi_lab_of_match,
    },
};

module_platform_driver(spi_lab_driver);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Siva Rami Reddy");
MODULE_DESCRIPTION("Educational Linux SPI controller driver skeleton");
