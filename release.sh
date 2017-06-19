#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa

chmod -R 700 $HOME/.ssh

ssh -T git@github.com

git clone $REMOTE_REPOSITORY /dest

cd /dest

git checkout gh-pages

rm -rf tools

mkdir -p tools

cp -r /release/* tools/

git add tools
git commit -m "Tools Release"

git push origin gh-pages