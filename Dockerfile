FROM ubuntu:14.04
MAINTAINER István Koren <koren ÄT dbis.rwth-aachen.de>

# Let the container know that there is no tty
ENV DEBIAN_FRONTEND noninteractive

# Update base image
RUN sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list
RUN apt-get update -y
RUN apt-get upgrade -y

# Install build tools
RUN apt-get install -y \
                     nodejs \
                     npm \
                     git

RUN ln -s /usr/bin/nodejs /usr/local/bin/node

# create mount point
RUN mkdir /build
WORKDIR /build
VOLUME ["/build"]

# Clone and build code on run
CMD npm install -g npm \
                   grunt-cli \
                   bower && \
    npm install && \
    bower install --allow-root --config.analytics=false && \
	grunt build
