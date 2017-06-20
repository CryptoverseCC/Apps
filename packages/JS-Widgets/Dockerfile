FROM node

RUN npm i -g yarn

RUN mkdir /module
ADD . /module

WORKDIR /module

RUN yarn
RUN yarn build
