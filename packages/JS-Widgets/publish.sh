#!/bin/bash

echo "~~~~~Publishing version: $CI_BRANCH~~~~~"
echo $NPMRC > ~/.npmrc
npm publish
curl http://purge.jsdelivr.net/npm/@userfeeds/widgets@latest