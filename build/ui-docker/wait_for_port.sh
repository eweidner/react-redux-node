#!/usr/bin/env bash

host=$1
port=$2

while ! exit | nc "$host" "$port";
  do echo "Waiting for: $host Port: $port" && sleep 3;
done
echo ""
echo "Port responding"
