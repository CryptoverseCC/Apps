#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa

chmod -R 700 $HOME/.ssh

ssh -T git@github.com

git status

# Prepare subtree source
git checkout -b temp
git add /apps/release/
git commit -m "Temp"

# Prepare source gh-pages branch
git checkout -b src
git remote add destination $REMOTE_REPOSITORY
git fetch destination
git reset --hard destination/gh-pages

# Add subtree
git read-tree --prefix=release/ -u temp
git commit -m "Apps Release $CI_COMMIT_ID $CI_COMMIT_MESSAGE"

git push $REMOTE_REPOSITORY src:gh-pages --force