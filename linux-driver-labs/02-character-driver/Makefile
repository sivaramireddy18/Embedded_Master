obj-m += character_driver.o

KDIR ?= /lib/modules/$(shell uname -r)/build
PWD  := $(shell pwd)

all: module test

module:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

test:
	$(CC) -Wall -Wextra -O2 -o test_char test_char.c

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean
	rm -f test_char

load:
	sudo insmod character_driver.ko

unload:
	sudo rmmod character_driver

run:
	./test_char

logs:
	dmesg | tail -n 30
