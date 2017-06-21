FROM node

RUN npm i -g yarn envsub

RUN mkdir /module
ADD . /module

WORKDIR /module

RUN yarn
RUN yarn build
