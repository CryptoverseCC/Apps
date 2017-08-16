FROM node

RUN npm i -g yarn envsub

RUN mkdir /module
ADD . /module

WORKDIR /module

RUN yarn

RUN CI_BRANCH=`git describe --tags` envsub package.json package.json
RUN cat package.json

RUN yarn build
