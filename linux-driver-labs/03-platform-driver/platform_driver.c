#include <linux/init.h>
#include <linux/module.h>
#include <linux/of.h>
#include <linux/platform_device.h>

static int lab_probe(struct platform_device *pdev)
{
    dev_info(&pdev->dev, "platform driver probe\n");
    return 0;
}

static void lab_remove(struct platform_device *pdev)
{
    dev_info(&pdev->dev, "platform driver remove\n");
}

static const struct of_device_id lab_of_match[] = {
    { .compatible = "siva,embedded-lab" },
    { }
};
MODULE_DEVICE_TABLE(of, lab_of_match);

static struct platform_driver lab_driver = {
    .probe = lab_probe,
    .remove = lab_remove,
    .driver = {
        .name = "embedded-platform-lab",
        .of_match_table = lab_of_match,
    },
};

module_platform_driver(lab_driver);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Siva Rami Reddy");
MODULE_DESCRIPTION("Educational Linux platform driver");
MODULE_VERSION("1.0");
