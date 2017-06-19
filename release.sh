#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa

chmod -R 700 $HOME/.ssh

ssh -T git@github.com

git status

git checkout -b temp

git remote add destination $REMOTE_REPOSITORY
git fetch destination
git reset --hard destination/gh-pages

git add /apps/release
git commit -m "Apps Release $CI_COMMIT_ID"

git push $REMOTE_REPOSITORY temp:gh-pages --force