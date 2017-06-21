FROM node

RUN npm i -g yarn envsub

RUN mkdir /module
ADD . /module

WORKDIR /module

RUN envsub package.json package.json
RUN cat package.json

RUN yarn
RUN yarn build
