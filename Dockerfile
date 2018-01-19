FROM node

WORKDIR /

RUN npm install yarn
COPY . /apps

WORKDIR /apps

RUN yarn

RUN yarn test

RUN yarn lerna run build

WORKDIR /
