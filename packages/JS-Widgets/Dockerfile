FROM node

RUN npm i -g yarn envsub

RUN mkdir /module
ADD . /module

WORKDIR /module

RUN yarn
RUN echo "~~~~~Building version: $CI_BRANCH~~~~~"
RUN envsub package.json package.json
RUN yarn build
