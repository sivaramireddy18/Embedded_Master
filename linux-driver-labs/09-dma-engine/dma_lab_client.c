#include <linux/dmaengine.h>
#include <linux/dma-mapping.h>
#include <linux/module.h>
#include <linux/platform_device.h>
#include <linux/completion.h>

struct dma_lab {
    struct dma_chan *chan;
    struct completion completion;
};

static void dma_lab_complete(void *arg)
{
    struct dma_lab *lab = arg;
    complete(&lab->completion);
}

static int dma_lab_probe(struct platform_device *pdev)
{
    struct dma_lab *lab;
    struct dma_async_tx_descriptor *desc;
    dma_cookie_t cookie;
    int ret;

    lab = devm_kzalloc(&pdev->dev, sizeof(*lab), GFP_KERNEL);
    if (!lab)
        return -ENOMEM;

    init_completion(&lab->completion);
    lab->chan = dma_request_chan(&pdev->dev, "memcpy");
    if (IS_ERR(lab->chan))
        return PTR_ERR(lab->chan);

    /* Educational example: real source/destination DMA addresses must come
     * from a correctly mapped buffer and match the target DMA controller. */
    desc = dmaengine_prep_dma_memcpy(lab->chan, 0, 0, 0,
                                     DMA_CTRL_ACK | DMA_PREP_INTERRUPT);
    if (!desc) {
        ret = -EIO;
        goto release_chan;
    }

    desc->callback = dma_lab_complete;
    desc->callback_param = lab;

    cookie = dmaengine_submit(desc);
    ret = dma_submit_error(cookie);
    if (ret)
        goto release_chan;

    dma_async_issue_pending(lab->chan);
    dev_info(&pdev->dev, "DMA transfer submitted, cookie=%d\n", cookie);

    return 0;

release_chan:
    dma_release_channel(lab->chan);
    return ret;
}

static void dma_lab_remove(struct platform_device *pdev)
{
    struct dma_lab *lab = platform_get_drvdata(pdev);

    if (lab && !IS_ERR_OR_NULL(lab->chan))
        dma_release_channel(lab->chan);
}

static const struct of_device_id dma_lab_of_match[] = {
    { .compatible = "embedded-lab,dma-client" },
    { }
};
MODULE_DEVICE_TABLE(of, dma_lab_of_match);

static struct platform_driver dma_lab_driver = {
    .probe = dma_lab_probe,
    .remove = dma_lab_remove,
    .driver = {
        .name = "embedded-lab-dma",
        .of_match_table = dma_lab_of_match,
    },
};

module_platform_driver(dma_lab_driver);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Siva Rami Reddy");
MODULE_DESCRIPTION("Educational Linux DMAengine client skeleton");
