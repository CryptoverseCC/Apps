#!/bin/sh

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

cd /apps/widgets/linkexchange-link

npm publish --unsafe-perm
