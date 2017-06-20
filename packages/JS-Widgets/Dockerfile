FROM node

RUN mkdir /module
ADD . /module

WORKDIR /module

RUN npm install
RUN npm run build
RUN npm test
