#!/bin/bash
echo "~~~~~Publishing version: $CI_BRANCH~~~~~"
echo $NPMRC > ~/.npmrc
npm publish