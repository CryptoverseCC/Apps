#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e $PRIVATE_SSH_KEY >> $HOME/.ssh/id_rsa
chmod -R 700 $HOME/.ssh

find . -maxdepth 2 -type d -regex '\./[a-z]+.*' -exec \
    bash -c "echo '{}' && cd '{}' && [ -f package.json ] && yarn install && yarn build && mkdir -p /apps/release/{} && mv build /apps/release/{}" \;

git add /apps/release
git commit -m "Release"
git subtree push -d --prefix=release git@github.com:Userfeeds/Apps.git gh-pages