#!/bin/bash

BUILD_DIR=$(pwd)
DOCKER_DIR=$BUILD_DIR/docker

echo "Tar the application into Docker dir for copying to image"
rm -rf $DOCKER_DIR/application.tg
tar -c -z -v --exclude=application/node_modules -C ../ -f $DOCKER_DIR/application.tgz application/

echo "Build the image with Dockerfile in docker dir"
docker-compose build

rm -rf $DOCKER_DIR/application.tg

