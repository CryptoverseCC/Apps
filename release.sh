#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa

chmod -R 700 $HOME/.ssh

ssh -T git@github.com

git clone $REMOTE_REPOSITORY /dest

cd /dest

git checkout gh-pages

rm -rf apps

mkdir -p apps

cp -r /release/* apps/

git add apps
git commit -m "Tools Release: $CI_COMMIT_MESSAGE $CI_COMMIT_ID"

git push origin gh-pages