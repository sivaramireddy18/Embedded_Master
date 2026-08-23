#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

#define DEVICE "/dev/lab_char"

int main(void)
{
    const char message[] = "hello from userspace";
    char buffer[128] = {0};
    int fd;
    ssize_t written;
    ssize_t read_bytes;

    fd = open(DEVICE, O_RDWR);
    if (fd < 0) {
        perror("open");
        return 1;
    }

    written = write(fd, message, strlen(message));
    if (written < 0) {
        perror("write");
        close(fd);
        return 1;
    }

    lseek(fd, 0, SEEK_SET);

    read_bytes = read(fd, buffer, sizeof(buffer) - 1);
    if (read_bytes < 0) {
        perror("read");
        close(fd);
        return 1;
    }

    buffer[read_bytes] = '\0';
    printf("read back: %s\n", buffer);

    close(fd);
    return strcmp(message, buffer) == 0 ? 0 : 2;
}
