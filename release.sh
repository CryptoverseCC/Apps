#!/bin/sh

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

cd /apps

yarn lerna run deploy-test
yarn lerna publish --yes --canary --skip-git --skip-npm

# Rebuild widget to use new version tag
cd ./widgets/linkexchange-link
yarn build-test
npm publish --tag canary --unsafe-perm


cd ../../
./purgeCDNCach.sh canary
