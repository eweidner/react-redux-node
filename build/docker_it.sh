#!/bin/bash

BUILD_DIR=$(pwd)
DOCKER_DIR=$BUILD_DIR/docker

echo "Tar the application into Docker dir for copying to image ..."
rm -rf $DOCKER_DIR/application.tg

tar -czv --exclude=application/node_modules \
        --exclude=application/.*  \
        --exclude=application/tests  \
        -C ../ -f $DOCKER_DIR/application.tgz application/

echo "Build the image with Dockerfile in docker dir ..."
docker build --force-rm -t omb ./docker

echo "Clean up ..."
rm -rf $DOCKER_DIR/application.tgz

