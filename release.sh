#!/bin/bash

mkdir -p "$HOME/.ssh"
ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

echo -e "$PRIVATE_SSH_KEY" >> $HOME/.ssh/id_rsa

chmod -R 700 $HOME/.ssh

ssh -T git@github.com

git init
git status

# Prepare subtree source
git add /release
git commit -m "Apps Release: $CI_COMMIT_MESSAGE $CI_COMMIT_ID"
git subtree split --prefix=release/ --branch release

# Prepare source gh-pages branch
git checkout -b src
git remote add destination $REMOTE_REPOSITORY
git fetch destination
git reset --hard destination/gh-pages

# Add subtree
git subtree add --prefix=tools/ release

git push $REMOTE_REPOSITORY src:gh-pages --force