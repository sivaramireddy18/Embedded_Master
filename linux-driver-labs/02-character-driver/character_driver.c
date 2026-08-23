#include <linux/cdev.h>
#include <linux/fs.h>
#include <linux/init.h>
#include <linux/module.h>
#include <linux/device.h>
#include <linux/uaccess.h>

#define DEVICE_NAME "lab_char"
#define BUFFER_SIZE 128

static dev_t dev_number;
static struct cdev lab_cdev;
static struct class *lab_class;
static char device_buffer[BUFFER_SIZE];
static size_t data_size;

static int lab_open(struct inode *inode, struct file *file)
{
    pr_info("lab_char: open\n");
    return 0;
}

static int lab_release(struct inode *inode, struct file *file)
{
    pr_info("lab_char: release\n");
    return 0;
}

static ssize_t lab_read(struct file *file, char __user *buf,
                        size_t count, loff_t *offset)
{
    size_t remaining;

    if (*offset >= data_size)
        return 0;

    remaining = data_size - *offset;
    if (count > remaining)
        count = remaining;

    if (copy_to_user(buf, device_buffer + *offset, count))
        return -EFAULT;

    *offset += count;
    return count;
}

static ssize_t lab_write(struct file *file, const char __user *buf,
                         size_t count, loff_t *offset)
{
    if (count == 0)
        return 0;

    if (count > BUFFER_SIZE - 1)
        count = BUFFER_SIZE - 1;

    if (copy_from_user(device_buffer, buf, count))
        return -EFAULT;

    device_buffer[count] = '\0';
    data_size = count;
    *offset = 0;

    pr_info("lab_char: received %zu bytes\n", count);
    return count;
}

static const struct file_operations lab_fops = {
    .owner = THIS_MODULE,
    .open = lab_open,
    .read = lab_read,
    .write = lab_write,
    .release = lab_release,
};

static int __init lab_init(void)
{
    int ret;

    ret = alloc_chrdev_region(&dev_number, 0, 1, DEVICE_NAME);
    if (ret)
        return ret;

    cdev_init(&lab_cdev, &lab_fops);
    lab_cdev.owner = THIS_MODULE;

    ret = cdev_add(&lab_cdev, dev_number, 1);
    if (ret)
        goto unregister_region;

    lab_class = class_create(DEVICE_NAME);
    if (IS_ERR(lab_class)) {
        ret = PTR_ERR(lab_class);
        goto del_cdev;
    }

    if (IS_ERR(device_create(lab_class, NULL, dev_number, NULL, DEVICE_NAME))) {
        ret = -EINVAL;
        goto destroy_class;
    }

    pr_info("lab_char: registered major=%d minor=%d\n",
            MAJOR(dev_number), MINOR(dev_number));
    return 0;

destroy_class:
    class_destroy(lab_class);
del_cdev:
    cdev_del(&lab_cdev);
unregister_region:
    unregister_chrdev_region(dev_number, 1);
    return ret;
}

static void __exit lab_exit(void)
{
    device_destroy(lab_class, dev_number);
    class_destroy(lab_class);
    cdev_del(&lab_cdev);
    unregister_chrdev_region(dev_number, 1);
    pr_info("lab_char: unloaded\n");
}

module_init(lab_init);
module_exit(lab_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Siva Rami Reddy");
MODULE_DESCRIPTION("Educational Linux character driver");
MODULE_VERSION("1.0");
