FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y curl python3 python3-pip clang-format openjdk-17-jdk && \
    pip3 install black && \
    curl -LJO https://github.com/google/google-java-format/releases/download/v1.17.0/google-java-format-1.17.0-all-deps.jar && \
    mv google-java-format-1.17.0-all-deps.jar /usr/local/bin/google-java-format.jar && \
    echo '#!/bin/sh\njava -jar /usr/local/bin/google-java-format.jar "$@"' > /usr/local/bin/google-java-format && \
    chmod +x /usr/local/bin/google-java-format

# Install Prettier
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g prettier

WORKDIR /app
