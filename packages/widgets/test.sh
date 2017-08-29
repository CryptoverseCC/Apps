#!/bin/bash
echo "~~~~~Testing version: $CI_BRANCH~~~~~"
envsub package.json package.json
cat package.json
yarn test