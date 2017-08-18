#!/bin/bash

echo "~~~~~Publishing version: $CI_BRANCH~~~~~"
echo $NPMRC > ~/.npmrc

IS_STABLE=`git tag --points-at HEAD | grep -E "^stable$"`
if [ -n "$IS_STABLE" ]; then
  echo "IS STABLE"
  npm publish --tag stable
  curl http://purge.jsdelivr.net/npm/@userfeeds/widgets@stable
else
  echo "NOT STABLE"
  npm publish
  curl http://purge.jsdelivr.net/npm/@userfeeds/widgets@latest
fi
