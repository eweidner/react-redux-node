#!/usr/bin/env bash

/bin/bash /var/image_support/wait_for_port.sh mongo 27017

tail -100f /etc/hosts
npm install

NODE_ENV=production node bin/www
