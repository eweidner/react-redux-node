#!/bin/bash

DOCKER_IMAGE_NAME=omb-portal
DOCKER_IMAGE_VERSION=2.3

BUILD_DIR=$(pwd)
DOCKER_DIR=$BUILD_DIR/ui-docker

cd ../portal
NODE_ENV=production npm run build
cd $BUILD_DIR

cp ../portal/dist/index.html $DOCKER_DIR
cp ../portal/dist/main.js $DOCKER_DIR

echo "Build the image with Dockerfile in api-docker dir ..."
docker build --force-rm -t mijomoore/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION ./ui-docker

echo "Clean up ..."
rm -rf $DOCKER_DIR/index.html
rm -rf $DOCKER_DIR/main.js

docker push mijomoore/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VERSION
