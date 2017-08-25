#!/bin/bash

echo "~~~~~Publishing version: $CI_BRANCH~~~~~"
echo $NPMRC > ~/.npmrc

IS_STABLE=`git tag --points-at HEAD | grep -E "^stable$"`
if [ -n "$IS_STABLE" ]; then
  echo "IS STABLE"
  NPM_VERSION=`node -e "console.log(require('./package.json').version);"`
  npm publish
  npm dist-tag add "@linkexchange/widgets@$NPM_VERSION" stable
  curl http://purge.jsdelivr.net/npm/@linkexchange/widgets@stable
else
  echo "NOT STABLE"
  npm publish
fi

curl http://purge.jsdelivr.net/npm/@linkexchange/widgets@latest