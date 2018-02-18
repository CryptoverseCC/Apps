#!/bin/sh

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

cd /apps

yarn lerna run build
yarn lerna run deploy

cd ./widgets/linkexchange-link
npm publish --unsafe-perm

./purgeCDNCach.sh latest
