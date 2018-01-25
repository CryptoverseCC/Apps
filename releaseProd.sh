#!/bin/sh

cd /apps

yarn lerna run build
yarn lerna run deploy
