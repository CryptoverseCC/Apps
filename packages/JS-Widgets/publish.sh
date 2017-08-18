#!/bin/bash

echo "~~~~~Publishing version: $CI_BRANCH~~~~~"
echo $NPMRC > ~/.npmrc

IS_STABLE=`git tag --points-at HEAD | grep -E "^stable$"`
if [ -n "$IS_STABLE" ]; then
  echo "IS STABLE"
  NPM_VERSION=`node -e "console.log(require('./package.json').version);"`
  npm publish
  npm dist-tag add "@userfeeds/widgets@$NPM_VERSION" stable
  curl http://purge.jsdelivr.net/npm/@userfeeds/widgets@stable
else
  echo "NOT STABLE"
  npm publish
fi

curl http://purge.jsdelivr.net/npm/@userfeeds/widgets@latest