#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa

chmod -R 700 $HOME/.ssh

ssh -T git@github.com

git status
git add /apps/release
git commit -m "Apps Release"
# http://clontz.org/blog/2014/05/08/git-subtree-push-for-deployment/
DHEAD=$(git subtree split --prefix release)

echo "DHEAD $DHEAD"

git status

git remote add destination $REMOTE_REPOSITORY
git fetch destination
git reset --hard destination/gh-pages
git cherry-pick $DHEAD

git push $REMOTE_REPOSITORY $DHEAD:gh-pages --force