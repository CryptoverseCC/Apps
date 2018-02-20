#!/bin/sh

TAG_NAME="$1"

curl "http://purge.jsdelivr.net/npm/@linkexchange/widgets@$TAG_NAME"
curl "http://purge.jsdelivr.net/npm/@linkexchange/widgets@$TAG_NAME/build/0.bundle.js"
curl "http://purge.jsdelivr.net/npm/@linkexchange/widgets@$TAG_NAME/build/1.bundle.js"
curl "http://purge.jsdelivr.net/npm/@linkexchange/widgets@$TAG_NAME/build/2.bundle.js"
curl "http://purge.jsdelivr.net/npm/@linkexchange/widgets@$TAG_NAME/build/3.bundle.js"
curl "http://purge.jsdelivr.net/npm/@linkexchange/widgets@$TAG_NAME/build/4.bundle.js"
curl "http://purge.jsdelivr.net/npm/@linkexchange/widgets@$TAG_NAME/build/5.bundle.js"