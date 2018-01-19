FROM node

RUN git config --global user.email "servant@userfeeds.io"
RUN git config --global user.name "Userfeeds Servant"

WORKDIR /

RUN npm install yarn
COPY . /apps

WORKDIR /apps

RUN yarn

RUN yarn test

RUN yarn lerna run build

WORKDIR /
