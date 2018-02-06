#!/bin/sh

cd /apps

# yarn lerna run build --scope @linkexchange/widgets
cd widgets/linkexchange && npm publish
