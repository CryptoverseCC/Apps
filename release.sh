#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e $PRIVATE_SSH_KEY >> $HOME/.ssh/id_rsa
chmod -R 700 $HOME/.ssh

git status

ls -l /apps/release

git add /apps/release
git commit -m "Release"
git subtree push -d --prefix=release git@github.com:Userfeeds/Apps.git gh-pages