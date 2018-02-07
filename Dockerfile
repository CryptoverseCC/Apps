FROM node

WORKDIR /

COPY . /apps

WORKDIR /apps

RUN yarn

RUN yarn test

RUN yarn lerna run build-test

WORKDIR /
