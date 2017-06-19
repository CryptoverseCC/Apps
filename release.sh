#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa

chmod -R 700 $HOME/.ssh

ssh -T git@github.com

git status

ls -l /apps/release

git add /apps/release
git commit -m "Release"
# http://clontz.org/blog/2014/05/08/git-subtree-push-for-deployment/
git push origin `git subtree split --prefix release master`:gh-pages --force