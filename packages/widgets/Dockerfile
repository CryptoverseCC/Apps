FROM node

RUN npm i -g yarn envsub

RUN mkdir /module
ADD . /module

WORKDIR /module

RUN yarn

RUN CI_BRANCH=`git tag --points-at HEAD | grep -E "[0-9]+\.[0-9]+*\.[0-9]+"` envsub package.json package.json
RUN cat package.json

RUN yarn build
