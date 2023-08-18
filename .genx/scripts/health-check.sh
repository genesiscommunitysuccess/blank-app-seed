#!/bin/bash

url=$1
http_response=$(curl -s -o /dev/null -w "%{http_code}" $url)
counter=15

until [[ $http_response == "200" || counter -lt 0 ]]; do
  echo 'not all services running; waiting 10 seconds and trying again'
  sleep 10
  http_response=$(curl -s -o /dev/null -w "%{http_code}" $url)
  ((counter--))
done

curl $url
printf '\n'

if [[ $http_response == "200" ]]
then
  echo 'all services started correctly'
else
  echo 'not all services started correctly'
  exit 1
fi
