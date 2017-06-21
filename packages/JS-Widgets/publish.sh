#!/bin/bash
echo "~~~~~Publishing version: $CI_BRANCH~~~~~"
envsub package.json package.json
cat package.json
echo $NPMRC > ~/.npmrc
npm publish