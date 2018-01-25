#!/bin/sh

cd /apps

yarn lerna run build --scope @linkexchange/widgets
yarn lerna run publish --scope @linkexchange/widgets
