#!/bin/bash

DOCKER_IMAGE_NAME=omb
DOCKER_IMAGE_VERSION=2.3

BUILD_DIR=$(pwd)
DOCKER_DIR=$BUILD_DIR/api-docker


echo "Tar the application into Docker dir for copying to image ..."
rm -rf $DOCKER_DIR/application.tgz
tar -czv --exclude=application/node_modules \
        --exclude=application/tests  \
        -C ../ -f $DOCKER_DIR/application.tgz application/

echo "Build the image with Dockerfile in api-docker dir ..."
docker build --force-rm -t mijomoore/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./api-docker

echo "Clean up ..."
rm -rf $DOCKER_DIR/application.tgz


BUILD_DIR=$(pwd)
DOCKER_DIR=$BUILD_DIR/ui-docker

echo "Tar the portal into Docker dir for copying to image ..."
rm -rf $DOCKER_DIR/portal.tgz
tar -czv --exclude=portal/node_modules \
        --exclude=portal/.*  \
        --exclude=portal/tests  \
        -C ../ -f $DOCKER_DIR/portal.tgz portal/

echo "Build the image with Dockerfile in api-docker dir ..."
docker build --force-rm -t mijomoore/omb-portal:2.0 ./ui-docker

echo "Clean up ..."
rm -rf $DOCKER_DIR/portal.tgz

docker push mijomoore/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION
