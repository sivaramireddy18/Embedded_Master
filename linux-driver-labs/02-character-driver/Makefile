obj-m += character_driver.o

KDIR ?= /lib/modules/$(shell uname -r)/build
PWD  := $(shell pwd)

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean

load:
	sudo insmod character_driver.ko

unload:
	sudo rmmod character_driver

logs:
	dmesg | tail -n 30
