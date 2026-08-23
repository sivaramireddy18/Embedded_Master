#include <linux/i2c.h>
#include <linux/module.h>
#include <linux/platform_device.h>

struct i2c_lab {
    struct i2c_adapter adapter;
};

static int i2c_lab_master_xfer(struct i2c_adapter *adapter,
                               struct i2c_msg *msgs, int num)
{
    int i;

    /* Educational skeleton: real hardware register programming belongs here. */
    for (i = 0; i < num; ++i) {
        dev_info(&adapter->dev,
                 "msg[%d]: addr=0x%02x flags=0x%x len=%u\n",
                 i, msgs[i].addr, msgs[i].flags, msgs[i].len);
    }

    return -EOPNOTSUPP;
}

static u32 i2c_lab_func(struct i2c_adapter *adapter)
{
    return I2C_FUNC_I2C | I2C_FUNC_SMBUS_EMUL;
}

static const struct i2c_algorithm i2c_lab_algorithm = {
    .master_xfer = i2c_lab_master_xfer,
    .functionality = i2c_lab_func,
};

static int i2c_lab_probe(struct platform_device *pdev)
{
    struct i2c_lab *lab;
    int ret;

    lab = devm_kzalloc(&pdev->dev, sizeof(*lab), GFP_KERNEL);
    if (!lab)
        return -ENOMEM;

    lab->adapter.owner = THIS_MODULE;
    lab->adapter.algo = &i2c_lab_algorithm;
    lab->adapter.dev.parent = &pdev->dev;
    strscpy(lab->adapter.name, "embedded-lab-i2c", sizeof(lab->adapter.name));

    platform_set_drvdata(pdev, lab);

    ret = i2c_add_adapter(&lab->adapter);
    if (ret)
        return ret;

    dev_info(&pdev->dev, "I2C adapter registered\n");
    return 0;
}

static void i2c_lab_remove(struct platform_device *pdev)
{
    struct i2c_lab *lab = platform_get_drvdata(pdev);

    i2c_del_adapter(&lab->adapter);
}

static const struct of_device_id i2c_lab_of_match[] = {
    { .compatible = "embedded-lab,i2c-adapter" },
    { }
};
MODULE_DEVICE_TABLE(of, i2c_lab_of_match);

static struct platform_driver i2c_lab_driver = {
    .probe = i2c_lab_probe,
    .remove = i2c_lab_remove,
    .driver = {
        .name = "embedded-lab-i2c",
        .of_match_table = i2c_lab_of_match,
    },
};

module_platform_driver(i2c_lab_driver);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Siva Rami Reddy");
MODULE_DESCRIPTION("Educational Linux I2C adapter driver skeleton");
