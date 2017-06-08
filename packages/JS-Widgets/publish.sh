#!/bin/bash
echo $NPMRC > ~/.npmrc
npm build
npm test
npm publish