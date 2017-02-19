#!/usr/bin/env bash

/bin/bash /var/image_support/wait_for_port.sh state-api 3000

tail -100f /etc/hosts

npm run setup
npm install
npm run dev
