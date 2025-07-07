FROM openjdk:8-jre-alpine

# Define Allure CLI version and repo
ARG RELEASE=2.32.0
ARG ALLURE_REPO=https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline

# Install required tools
RUN echo "Installing dependencies..." && \
    apk update && \
    apk add --no-cache \
    bash \
    git \
    openssh-client \
    ca-certificates \
    wget \
    unzip \
    && rm -rf /var/cache/apk/*

# Install Allure CLI
RUN echo "Installing Allure CLI version ${RELEASE}..." && \
    wget --no-verbose -O /tmp/allure-${RELEASE}.tgz ${ALLURE_REPO}/${RELEASE}/allure-commandline-${RELEASE}.tgz && \
    tar -xf /tmp/allure-${RELEASE}.tgz -C /opt && \
    rm -rf /tmp/* && \
    chmod -R +x /opt/allure-${RELEASE}/bin

# Set environment variables
ENV ROOT=/app \
    PATH=$PATH:/opt/allure-${RELEASE}/bin

# Create working directory
RUN mkdir -p $ROOT
WORKDIR $ROOT

# Copy the entrypoint script into the image
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Run the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
