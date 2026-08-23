obj-m += platform_driver.o

KDIR ?= /lib/modules/$(shell uname -r)/build
PWD  := $(shell pwd)

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean

load:
	sudo insmod platform_driver.ko

unload:
	sudo rmmod platform_driver

logs:
	dmesg | tail -n 30
